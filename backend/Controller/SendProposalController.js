const asyncHandler = require("express-async-handler");
const axios = require("axios");
const fs = require("fs");
const docusign = require("docusign-esign");
const cloudinary = require("../Config/cloudinary.js");
//const { sendEmail } = require("../utils/sendEmail.js");
const { getJWTToken, apiClient } = require("../utils/docusignAuth.js");
const EnvelopeLog = require("../Model/SendProposalModel.js");

// ✅ Send Proposal for Signature
const sendProposalForSignature = asyncHandler(async (req, res) => {
  const { email, name, subject, message, project_id } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Client email is required" });
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
      project_id: project_id || null,
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

module.exports = {
  sendProposalForSignature,
  checkIfSigned,
};
