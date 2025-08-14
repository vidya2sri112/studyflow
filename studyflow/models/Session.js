const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['work', 'short_break', 'long_break'],
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Session', SessionSchema);