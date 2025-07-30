const { Booking, User } = require('../models');
const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');
const notifications = require('../helpers/notifications');

/**
 * @method POST
 * Creates a new booking for the authenticated customer
 */
exports.createBooking = async (req, res) => {
  try {
    const { serviceType, description, appointmentDate, location, agent, applianceType, preferredTime } = req.body;

    const newBooking = new Booking({
      customer: req.user.id,
      agent,
      serviceType,
      description,
      appointmentDate,
      location,
      applianceType,
      preferredTime
    });

    await newBooking.save();

    // Notify agent
    const agentUser = await User.findById(agent);
    if (agentUser && agentUser.fcmToken) {
      await notifications(
        agentUser.fcmToken,
        'New Repair Request',
        `You have a new repair request for ${applianceType || serviceType}.`,
        { bookingId: newBooking._id.toString() }
      );
    }

    return successResponse(res, newBooking, 'Booking created', 201);
  } catch (err) {
    return errorResponse(res, err, 'Error creating booking');
  }
};

/**
 * @method GET
 * Retrieves all bookings for the authenticated customer
 */
exports.getBookingsByCustomer = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id }).populate('agent');
    return successResponse(res, bookings, 'Customer bookings fetched');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching bookings');
  }
};

/**
 * @method GET
 * Retrieves all bookings assigned to the authenticated agent
 */
exports.getBookingsByAgent = async (req, res) => {
  try {
    const bookings = await Booking.find({ agent: req.user.id }).populate('customer');
    return successResponse(res, bookings, 'Agent bookings fetched');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching bookings');
  }
};

/**
 * @method PATCH
 * Updates the status of a specified booking (accepted, rejected, etc.)
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['accepted', 'rejected', 'in-progress', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return failedResponse(res, 'Invalid status value', 400);
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, agentResponseTime: new Date() },
      { new: true }
    );

    if (!booking) {
      return failedResponse(res, 'Booking not found', 404);
    }

    // Notify customer on agent response
    if (['accepted', 'rejected'].includes(status)) {
      const customerUser = await User.findById(booking.customer);
      if (customerUser && customerUser.fcmToken) {
        await notifications(
          customerUser.fcmToken,
          `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          `Your booking has been ${status} by the agent.`,
          { bookingId: booking._id.toString() }
        );
      }
    }

    return successResponse(res, booking, 'Booking status updated');
  } catch (err) {
    return errorResponse(res, err, 'Error updating booking status');
  }
};

/**
 * @method POST
 * Submit feedback for a completed booking
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return failedResponse(res, 'Booking not found', 404);
    }
    if (booking.status !== 'completed') {
      return failedResponse(res, 'Feedback can only be submitted for completed bookings', 400);
    }
    booking.feedback = { rating, comment };
    await booking.save();
    return successResponse(res, booking, 'Feedback submitted');
  } catch (err) {
    return errorResponse(res, err, 'Error submitting feedback');
  }
};
