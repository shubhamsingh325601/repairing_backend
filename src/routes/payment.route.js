const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

/**
 * @swagger
 * /api/payment/create-payment-intent:
 *   post:
 *     summary: Create Razorpay order for normal payments
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               currency:
 *                 type: string
 *                 example: INR
 *               receipt:
 *                 type: string
 *               notes:
 *                 type: object
 *               email:
 *                 type: string
 *                 example: customer@email.com
 *               role:
 *                 type: string
 *                 example: customer
 *     responses:
 *       200:
 *         description: Order created successfully
 */
router.post('/create-payment-intent', paymentController.createPaymentIntent);


/**
 * @swagger
 * /api/payment/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment signature
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.post('/verify-payment', paymentController.verifyPayment);


/**
 * @swagger
 * /api/payment/upi:
 *   post:
 *     summary: Create generic UPI payment order
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               upiApp:
 *                 type: string
 *                 example: google_pay
 *     responses:
 *       201:
 *         description: UPI order created successfully
 */
router.post('/upi', paymentController.createUpiPayment);


/**
 * @swagger
 * /api/payment/upi/google-pay:
 *   post:
 *     summary: Create Google Pay UPI order
 *     tags: [Payments]
 */
router.post('/upi/google-pay', paymentController.createGooglePayOrder);


/**
 * @swagger
 * /api/payment/upi/phonepe:
 *   post:
 *     summary: Create PhonePe UPI order
 *     tags: [Payments]
 */
router.post('/upi/phonepe', paymentController.createPhonePeOrder);


/**
 * @swagger
 * /api/payment/upi/paytm:
 *   post:
 *     summary: Create Paytm UPI order
 *     tags: [Payments]
 */
router.post('/upi/paytm', paymentController.createPaytmOrder);


/**
 * @swagger
 * /api/payment/{orderId}:
 *   get:
 *     summary: Get payment details using order ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment details retrieved
 */
router.get('/:orderId', paymentController.getPaymentDetails);

module.exports = router;
