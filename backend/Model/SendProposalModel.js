const mongoose = require('mongoose');

const envelopeLogSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientManagement",
    default: null,
  },

   project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projects",
   
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  envelope_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
   
    default: "sent",
  },
  sent_at: {
    type: String,
   
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const EnvelopeLog = mongoose.model("EnvelopeLog", envelopeLogSchema);
module.exports = EnvelopeLog;
