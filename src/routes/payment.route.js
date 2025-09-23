// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

/**
 * @swagger
 * /api/Payment/create-payment-intent:
 *   post:
 *     summary: Create a Stripe PaymentIntent
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *               - amount
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               role:
 *                 type: string
 *                 enum: [User, Agent]
 *                 description: User role
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               currency:
 *                 type: string
 *                 default: usd
 *                 description: Payment currency
 *               metadata:
 *                 type: object
 *                 description: Additional payment metadata
 *     responses:
 *       200:
 *         description: Stripe session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Stripe session created
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                       description: Stripe checkout session ID
 *       400:
 *         description: Bad request - missing required fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/create-payment-intent', paymentController.createPaymentIntent);

/**
 * @swagger
 * /api/Payment/confirm-payment:
 *   post:
 *     summary: Confirm a PaymentIntent (optional)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentIntentId
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *                 description: Stripe PaymentIntent ID
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment confirmed
 *                 data:
 *                   type: object
 *                   description: Confirmed PaymentIntent object
 *       500:
 *         description: Internal server error
 */
router.post('/confirm-payment', paymentController.confirmPayment);

/**
 * @swagger
 * /api/Payment/upi:
 *   post:
 *     summary: Initiate UPI payment via Razorpay
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
 *                 description: Payment amount in INR
 *               currency:
 *                 type: string
 *                 default: INR
 *                 description: Payment currency
 *               receipt:
 *                 type: string
 *                 description: Receipt ID for the payment
 *               notes:
 *                 type: object
 *                 description: Additional payment notes
 *     responses:
 *       201:
 *         description: Razorpay UPI order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Razorpay UPI order created
 *                 data:
 *                   type: object
 *                   description: Razorpay order object
 *       500:
 *         description: Internal server error
 */
router.post('/upi', paymentController.createUpiPayment);

module.exports = router;
