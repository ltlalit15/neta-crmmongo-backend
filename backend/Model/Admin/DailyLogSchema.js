const mongoose = require("mongoose");

const DailyLogSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  images: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("DailyLog", DailyLogSchema);