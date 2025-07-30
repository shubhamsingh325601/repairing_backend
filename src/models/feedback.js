const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // refers to User collection
    required: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent', // refers to Agent collection
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);