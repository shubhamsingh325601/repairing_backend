const Feedback = require('../models');
const Booking = require('../models');
const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');

// POST /api/feedback/:bookingId
exports.submitFeedback = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return failedResponse(res, 'Booking not found', 404);
    if (booking.customer.toString() !== req.user.id)
      return failedResponse(res, 'You are not allowed to review this booking', 403);
    if (booking.status !== 'completed')
      return failedResponse(res, 'Cannot review incomplete booking', 400);

    const existing = await Feedback.findOne({ booking: bookingId });
    if (existing) return failedResponse(res, 'Feedback already submitted', 400);

    const feedback = await Feedback.create({
      booking: bookingId,
      user: req.user.id,
      agent: booking.agent,
      rating,
      comment,
    });

    return successResponse(res, feedback, 'Feedback submitted');
  } catch (err) {
    return errorResponse(res, err, 'Error submitting feedback');
  }
};

// GET /api/feedback/agent/:agentId
exports.getAgentRatings = async (req, res) => {
  try {
    const { agentId } = req.params;

    const feedbacks = await Feedback.find({ agent: agentId });
    const ratings = feedbacks.map(f => f.rating);
    const averageRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length) || 0;

    return successResponse(res, {
      ratings,
      count: ratings.length,
      averageRating
    }, 'Agent ratings fetched');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching agent ratings');
  }
};

// PUT /api/feedback/:bookingId
exports.updateFeedback = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;

    const feedback = await Feedback.findOne({ booking: bookingId, user: req.user.id });
    if (!feedback) return failedResponse(res, 'No existing feedback to update', 404);

    feedback.rating = rating;
    feedback.comment = comment;
    await feedback.save();

    return successResponse(res, feedback, 'Feedback updated successfully');
  } catch (err) {
    return errorResponse(res, err, 'Error updating feedback');
  }
};

// DELETE /api/feedback/:bookingId
exports.deleteFeedback = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const feedback = await Feedback.findOneAndDelete({ booking: bookingId, user: req.user.id });
    if (!feedback) return failedResponse(res, 'No feedback to delete', 404);

    return successResponse(res, [], 'Feedback deleted successfully');
  } catch (err) {
    return errorResponse(res, err, 'Error deleting feedback');
  }
};
