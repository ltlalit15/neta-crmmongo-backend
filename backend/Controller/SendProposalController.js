const asyncHandler = require("express-async-handler");
const axios = require("axios");
const fs = require("fs");
const docusign = require("docusign-esign");
const cloudinary = require("../Config/cloudinary.js");
//const { sendEmail } = require("../utils/sendEmail.js");
const { getJWTToken, apiClient } = require("../utils/docusignAuth.js");
const EnvelopeLog = require("../Model/SendProposalModel.js");
const Projects = require("../Model/Admin/ProjectsModel.js")

// ✅ Send Proposal for Signature
const sendProposalForSignature = asyncHandler(async (req, res) => {
  const { email, name, subject, message, project_id } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Client email is required" });
  }

  let validProjectId = null;

  // ✅ Step 2: Try to find Project only if project_id is provided
  if (project_id) {
    try {
      const project = await Projects.findById(project_id);
      if (project) {
        validProjectId = project._id;
        // ✅ Check if proposal already sent for this project
        const existing = await EnvelopeLog.findOne({ project_id: validProjectId });
        if (existing) {
          return res.status(409).json({
            success: false,
            message: "Proposal already sent for this project.",
            envelopeId: existing.envelope_id,
            sent_at: existing.sent_at,
          });
        }
      } else {
        console.warn("Project not found, proceeding without project_id.");
      }
    } catch (err) {
      console.warn("Invalid project_id format, proceeding without project_id.");
    }
  }

  const signer_email = email.trim().toLowerCase();
  const signer_name = name || "Client";
  const email_subject = subject || "Please sign the proposal";
  const email_message = message || `Dear ${signer_name},\n\nYour proposal has been sent via DocuSign. Please check your inbox and spam folder, and sign the document.\n\nThank you!`;

  let attachmentUrl = null;

  // ✅ Upload to Cloudinary
  if (req.files && req.files.attachment && req.files.attachment.tempFilePath) {
    const uploadResult = await cloudinary.uploader.upload(
      req.files.attachment.tempFilePath,
      {
        folder: "proposal_attachments",
        resource_type: "auto",
      }
    );
    attachmentUrl = uploadResult.secure_url;
  } else {
    return res.status(400).json({ success: false, message: "Attachment upload failed or missing." });
  }

  // ✅ Get PDF buffer
  const pdfResponse = await axios.get(attachmentUrl, { responseType: "arraybuffer" });
  const fileBuffer = Buffer.from(pdfResponse.data, "binary");

  // ✅ DocuSign Auth
  const { accessToken, accountId, basePath } = await getJWTToken();
  const localApiClient = new docusign.ApiClient();
  localApiClient.setBasePath(basePath || "https://demo.docusign.net/restapi");
  localApiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopeApi = new docusign.EnvelopesApi(localApiClient);

  // ✅ Envelope Definition
  const envDef = new docusign.EnvelopeDefinition();
  envDef.emailSubject = email_subject;
  envDef.status = "sent";

  const doc = new docusign.Document();
  doc.documentBase64 = fileBuffer.toString("base64");
  doc.name = "Uploaded Proposal";
  doc.fileExtension = "pdf";
  doc.documentId = "1";

  const signer = docusign.Signer.constructFromObject({
    email: signer_email,
    name: signer_name,
    recipientId: "1",
    routingOrder: "1",
    tabs: {
      signHereTabs: [
        {
          anchorString: "*signature_here*",
          anchorUnits: "pixels",
          anchorYOffset: "10",
          anchorXOffset: "20",
        },
      ],
    },
  });

  envDef.documents = [doc];
  envDef.recipients = { signers: [signer] };

  // ✅ Create envelope
  const result = await envelopeApi.createEnvelope(accountId, {
    envelopeDefinition: envDef,
  });

  // ✅ Log envelope
  try {
    await axios.post("https://neta-crmmongo-backend-production.up.railway.app/api/LogEnvelope", {
      client_id: null,
      project_id: validProjectId,
      email: signer_email,
      envelope_id: result.envelopeId,
      status: "sent",
      sent_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Failed to log envelope:", err.response?.data || err.message);
  }

  // ✅ Send email notification
  try {
    await axios.post("https://neta-crmmongo-backend-production.up.railway.app/api/sendProposalEmail", {
      email: signer_email,
      subject: email_subject,
      message: email_message,
    });
  } catch (err) {
    console.error("❌ Failed to send email notification:", err.response?.data || err.message);
  }

  return res.status(200).json({
    success: true,
    message: "Proposal sent for signature",
    envelopeId: result.envelopeId,
    docusign_status: "sent",
    project_id: validProjectId || null,
  });
});

// ✅ Check Envelope Status
const checkIfSigned = asyncHandler(async (req, res) => {
  const { envelopeId } = req.params;

  if (!envelopeId) {
    return res.status(400).json({ success: false, message: "Envelope ID is required" });
  }

  const { accessToken, accountId } = await getJWTToken();
  const envelopeApi = new docusign.EnvelopesApi(apiClient);
  const envelope = await envelopeApi.getEnvelope(accountId, envelopeId);
  const status = envelope.status;

  return res.status(200).json({
    success: true,
    envelopeId,
    status,
    message: `Envelope is currently: ${status}`,
  });
});


const getEnvelopesByProjectId = asyncHandler(async (req, res) => {
  const { project_id } = req.params;

  if (!project_id) {
    return res.status(400).json({ success: false, message: "project_id is required" });
  }

  const envelopes = await EnvelopeLog.find({ project_id });

  if (!envelopes || envelopes.length === 0) {
    return res.status(404).json({ success: false, message: "No envelopes found for this project." });
  }

  const { accessToken, accountId } = await getJWTToken();
  const envelopeApi = new docusign.EnvelopesApi(apiClient);

  const enrichedEnvelopes = await Promise.all(
    envelopes.map(async (log) => {
      try {
        const envelope = await envelopeApi.getEnvelope(accountId, log.envelope_id);
        return {
          ...log.toObject(),
          current_status: envelope.status, // real-time status
        };
      } catch (err) {
        console.warn(`⚠️ Failed to fetch status for envelope ${log.envelope_id}`);
        return {
          ...log.toObject(),
          current_status: log.status, // fallback to saved status
        };
      }
    })
  );

  return res.status(200).json({
    success: true,
    total: enrichedEnvelopes.length,
    data: enrichedEnvelopes,
  });
});



module.exports = {
  sendProposalForSignature,
  checkIfSigned,
  getEnvelopesByProjectId
};
