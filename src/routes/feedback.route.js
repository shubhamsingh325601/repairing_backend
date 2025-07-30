const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
// const auth = require('../middleware/auth');

router.post('/:bookingId', feedbackController.submitFeedback);
router.get('/agent/:agentId', feedbackController.getAgentRatings);
router.put('/:bookingId', feedbackController.updateFeedback);
router.delete('/:bookingId', feedbackController.deleteFeedback);

module.exports = router;