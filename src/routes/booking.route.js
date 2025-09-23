const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
// const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/Booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceType
 *               - appointmentDate
 *               - location
 *               - agent
 *             properties:
 *               serviceType:
 *                 type: string
 *                 description: Type of service needed
 *               description:
 *                 type: string
 *                 description: Detailed description of the problem
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *                 description: Preferred appointment date
 *               location:
 *                 type: string
 *                 description: Service location address
 *               agent:
 *                 type: string
 *                 description: ID of the selected agent
 *               applianceType:
 *                 type: string
 *                 description: Type of appliance to be repaired
 *               preferredTime:
 *                 type: string
 *                 format: date-time
 *                 description: Preferred time for the appointment
 *     responses:
 *       201:
 *         description: Booking created successfully
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
 *                   example: Booking created
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /api/Booking/customer:
 *   get:
 *     summary: Get all bookings for the authenticated customer
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Customer bookings fetched successfully
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
 *                   example: Customer bookings fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Internal server error
 */
router.get('/customer', bookingController.getBookingsByCustomer);

/**
 * @swagger
 * /api/Booking/agent:
 *   get:
 *     summary: Get all bookings assigned to the authenticated agent
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Agent bookings fetched successfully
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
 *                   example: Agent bookings fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Internal server error
 */
router.get('/agent', bookingController.getBookingsByAgent);

/**
 * @swagger
 * /api/Booking/{bookingId}/status:
 *   patch:
 *     summary: Update the status of a specified booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the booking to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected, in-progress, completed, cancelled]
 *                 description: New status for the booking
 *     responses:
 *       200:
 *         description: Booking status updated successfully
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
 *                   example: Booking status updated
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request - invalid status
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:bookingId/status', bookingController.updateBookingStatus);

/**
 * @swagger
 * /api/Booking/{bookingId}/feedback:
 *   post:
 *     summary: Submit feedback for a completed booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the completed booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Feedback comment
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
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
 *                   example: Feedback submitted
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request - feedback can only be submitted for completed bookings
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.post('/:bookingId/feedback', bookingController.submitFeedback);

module.exports = router;
