const asyncHandler = require("express-async-handler");
const EnvelopeLog = require("../Model/SendProposalModel");
const Projects = require("../Model/Admin/ProjectsModel.js")

const logEnvelope = asyncHandler(async (req, res) => {
  const { client_id, project_id, email, envelope_id, status, sent_at } = req.body;

  if (!email || !envelope_id) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  
  // ✅ Optional: Check if project_id is valid and exists
  let project = null;
  if (project_id) {
    try {
      project = await Projects.findById(project_id);
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid project_id" });
    }
  }

  const log = await EnvelopeLog.create({
    client_id,
    project_id: project ? project._id : null,
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

