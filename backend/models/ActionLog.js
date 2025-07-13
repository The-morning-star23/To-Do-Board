const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  actionType: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'ASSIGN'],
    required: true,
  },
  message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ActionLog', actionLogSchema);
