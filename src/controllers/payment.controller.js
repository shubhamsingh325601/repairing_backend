const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');
const { User } = require('../models');
const razorpay = require('../config/razorpay.config');
const crypto = require('crypto');
const { razorpayKeySecret } = require('../config/keys');

/**
 * @method POST
 * Create a generic Razorpay order
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes, email, role } = req.body;

    if (!amount) {
      return failedResponse(res, 'Amount is required', 400);
    }

    let user = null;
    if (email && role) {
      user = await User.findOne({ email, role });
      if (!user) {
        return failedResponse(res, `${role} not found`, 404);
      }
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: notes || {}
    });

    return successResponse(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    }, 'Order created successfully');
  } catch (err) {
    return errorResponse(res, err, 'Error creating payment intent');
  }
};

/**
 * @method POST
 * Verify Razorpay payment signature
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return failedResponse(res, 'Missing payment verification data', 400);
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return failedResponse(res, 'Payment verification failed', 400);
    }

    return successResponse(res, {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: 'verified'
    }, 'Payment verified successfully');

  } catch (err) {
    return errorResponse(res, err, 'Error verifying payment');
  }
};

/**
 * @method POST
 * Create a UPI-only order
 */
exports.createUpiPayment = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount) return failedResponse(res, 'Amount is required', 400);

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `upi_${Date.now()}`,
      payment_capture: 1,
      notes: { ...notes, method: 'upi' }
    });

    return successResponse(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    }, 'UPI order created successfully');

  } catch (err) {
    return errorResponse(res, err, 'Error creating UPI order');
  }
};

/**
 * @method POST
 * Create a specific UPI app order
 */
const createSpecificUpiOrder = async (req, res, app) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount) return failedResponse(res, 'Amount is required', 400);

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `${app}_${Date.now()}`,
      payment_capture: 1,
      notes: { ...notes, upiApp: app }
    });

    return successResponse(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      upiApp: app,
      key: process.env.RAZORPAY_KEY_ID
    }, `${app} UPI order created`);

  } catch (err) {
    return errorResponse(res, err, `Error creating ${app} order`);
  }
};

exports.createGooglePayOrder = (req, res) => createSpecificUpiOrder(req, res, 'google_pay');
exports.createPhonePeOrder = (req, res) => createSpecificUpiOrder(req, res, 'phonepe');
exports.createPaytmOrder = (req, res) => createSpecificUpiOrder(req, res, 'paytm');

/**
 * @method GET
 * Fetch Razorpay order details
 */
exports.getPaymentDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return failedResponse(res, 'Order ID required', 400);

    const order = await razorpay.orders.fetch(orderId);
    return successResponse(res, order, 'Payment details fetched');

  } catch (err) {
    return errorResponse(res, err, 'Error fetching payment details');
  }
};
