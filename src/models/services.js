const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  durationInMinutes: {
    type: Number,
    default: 60
  },
  imageUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);