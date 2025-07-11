const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  dailylog_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'DailyLog'
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
