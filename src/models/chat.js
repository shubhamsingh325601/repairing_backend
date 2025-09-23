const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false
  }
}, { timestamps: true });

// Index for efficient querying
ChatSchema.index({ sender: 1, receiver: 1 });
ChatSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Chat', ChatSchema);
