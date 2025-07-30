const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');
const Stripe = require('stripe');
const { stripeSecretKey } = require('../config/keys');
const { User } = require('../models');
const stripe = Stripe(stripeSecretKey);
const razorpay = require('../config/razorpay.config');

/**
 * @method POST
 * Creates a Stripe PaymentIntent for a given amount and currency
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { email,role,amount, currency = 'usd', metadata = {} } = req.body;
    // Validate role
    if (!email || !role || !amount) {
      return failedResponse(res, 'Email, role, and amount are required', 400);
    }
    const application = await findUserByEmail(email,role);
    if (!application) {
      return failedResponse(res, `${role} not found`, 404);
    }
    let customer;
    if (!application || !application.stripeCustomerId) {
      customer = await stripe.customers.create({
        email:email,
        name: application.name,
        phone: application.phone,
        address: {
          line1: application.address,
        },
        metadata: {
          role: role,
        },
      });
      application.stripeCustomerId = customer.id;
    } else {
      customer = await stripe.customers.retrieve(application.stripeCustomerId);
    }
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "payment",
      line_items: [
        {
          price: 'price_1RVF92QM2HraHdurQxZBLosH',
          quantity: 1,
        },
      ],
      success_url: "http://yoursite.com/order/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: `http://localhost:5001/signup/subscribe?role=business_partner`,
    });
    application.stripeSessionId = session.id;
    await application.save();
    return successResponse(res, { sessionId: session.id }, 'Stripe session created');
  } catch (err) {
    return errorResponse(res, err, 'Error creating payment intent');
  }
};

/**
 * @method POST
 * Optional: Confirms the PaymentIntent if using manual confirmation flow
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const confirmed = await stripe.paymentIntents.confirm(paymentIntentId);
    return successResponse(res, confirmed, 'Payment confirmed');
  } catch (err) {
    return errorResponse(res, err, 'Error confirming payment');
  }
};

/**
 * @method POST
 * Initiates a Razorpay order for UPI payments.
 */
exports.createUpiPayment = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt,
      payment_capture: 1,
      notes,
      method: 'upi',
    };
    const order = await razorpay.orders.create(options);
    return successResponse(res, order, 'Razorpay UPI order created', 201);
  } catch (err) {
    return errorResponse(res, err, 'Error creating Razorpay UPI order');
  }
};


async function findUserByEmail(email, role) {
  if (!email || !role) return null;

  const Model = role === 'User' ? User : Agent;
  return await Model.findOne({ email });
}

async function createCustomer(application, role) {
  try {
    let customer;

    if (!application.stripeCustomerId) {
      customer = await stripe.customers.create({
        email: application.email,
        name: application.name || '',
        phone: application.phone || '',
        address: {
          line1: application.address || '',
        },
        metadata: { role },
      });

      application.stripeCustomerId = customer.id;
    } else {
      customer = await stripe.customers.retrieve(application.stripeCustomerId);
    }

    return customer;
  } catch (error) {
    console.error('Error in createCustomer:', error);
    throw new Error('Stripe customer creation failed');
  }
}
