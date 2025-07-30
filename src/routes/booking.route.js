const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
// const authMiddleware = require('../middleware/auth');

router.post('/', bookingController.createBooking);
router.get('/customer', bookingController.getBookingsByCustomer);
router.get('/agent', bookingController.getBookingsByAgent);
router.patch('/:bookingId/status', bookingController.updateBookingStatus);
router.post('/:bookingId/feedback', bookingController.submitFeedback);

module.exports = router;
