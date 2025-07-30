// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/confirm-payment', paymentController.confirmPayment); // optional

// UPI Payment
router.post('/upi', paymentController.createUpiPayment);

module.exports = router;
