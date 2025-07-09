const asyncHandler = require("express-async-handler");
const EnvelopeLog = require("../Model/SendProposalModel");
const Projects = require("../Model/Admin/ProjectsModel.js")

const logEnvelope = asyncHandler(async (req, res) => {
  const { client_id, project_id, email, envelope_id, status, sent_at } = req.body;

  if (!email || !envelope_id) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  let validProjectId = null;

  // ✅ Try to validate project_id if provided
  if (project_id) {
    try {
      const project = await Projects.findById(project_id);
      if (project) {
        validProjectId = project._id;
      } else {
        console.warn("⚠️ Project ID not found, saving log without project reference.");
      }
    } catch (err) {
      console.warn("⚠️ Invalid Project ID format, saving log without project reference.");
    }
  }

  // ✅ Save Envelope Log
  const log = await EnvelopeLog.create({
    client_id,
    project_id: validProjectId, // either valid _id or null
    email,
    envelope_id,
    status: status || "sent",
    sent_at: sent_at ? new Date(sent_at) : new Date(),
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

