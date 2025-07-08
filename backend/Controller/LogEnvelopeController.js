const asyncHandler = require("express-async-handler");
const EnvelopeLog = require("../Model/SendProposalModel");

const logEnvelope = asyncHandler(async (req, res) => {
  const { client_id, email, envelope_id, status, sent_at } = req.body;

  if (!email || !envelope_id) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const log = await EnvelopeLog.create({
    client_id,
    email,
    envelope_id,
    status: status || "sent",
    sent_at: sent_at || new Date().toISOString(),
  });

  console.log("📥 Envelope Log saved:", log);

  return res.status(200).json({
    success: true,
    message: "Envelope log saved successfully",
    data: log,
  });
});



module.exports = {
  logEnvelope
  
};

