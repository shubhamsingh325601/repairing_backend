const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  resourceType: { type: String, required: true }, // e.g., 'Agent', 'User', etc.
  resourceId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema); 