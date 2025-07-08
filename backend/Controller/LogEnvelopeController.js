const asyncHandler = require("express-async-handler");
 
const EnvelopeLog = require("../Model/SendProposalModel")

const logEnvelope = asyncHandler(async (req, res) => {
  const { client_id, email, envelope_id, status, sent_at } = req.body;

  if (!email || !envelope_id) {
    return errorResponse(res, 400, "Missing required fields");
  }

  // Optional client existence check (commented out)
  // const client = await ClientTable.findById(client_id);
  // if (!client) {
  //   return errorResponse(res, 404, "Client not found");
  // }

  const log = await EnvelopeLog.create({
    client_id,
    email,
    envelope_id,
    status: status || "sent",
    sent_at: sent_at || new Date().toISOString(),
  });

  console.log("📥 Envelope Log saved:", log);

  return successResponse(res, 200, "Envelope log saved successfully", log);
});

module.exports = { logEnvelope };
