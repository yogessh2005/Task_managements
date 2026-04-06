const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  details: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
