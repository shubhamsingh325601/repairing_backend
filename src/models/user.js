const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String},
  phone: { type: String },
  address: { type: String },
  password: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  skills: [String],
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  fcmToken: { type: String },

  imageUrl: { type: String, default: 'https://example.com/default-avatar.png' }, // Default avatar URL
  experience: {
    type: Number,
    min: 0,
    default: 0 // Default experience set to 0
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin',""],
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);