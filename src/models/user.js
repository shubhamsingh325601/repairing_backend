const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  skills: [String],
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  stripeCustomerId: { type: String, unique: true, sparse: true },
  stripeSessionId: { type: String, unique: true, sparse: true },
  fcmToken: { type: String },

  imageUrl: { type: String, default: 'https://example.com/default-avatar.png' }, // Default avatar URL
  experience: {
    type: Number,
    min: 0,
    default: 0 // Default experience set to 0
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);