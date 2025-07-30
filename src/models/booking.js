const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  },
  applianceType: { type: String },
  preferredTime: { type: Date },
  agentResponseTime: { type: Date },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);