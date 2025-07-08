const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const cloudinary = require('../../Config/cloudinary');
const ClientManagement = require('../../Model/Admin/ClientManagementModel');

// Cloudinary is already configured in Config/cloudinary.js

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'packageitappofficially@gmail.com',
        pass: 'epvuqqesdioohjvi',
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Email sending function
const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: 'sagar.kiaan12@gmail.com',
        to,
        subject,
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};

class SendEmailController {
    static async sendProposalEmail(req, res) {
        try {
            const { email, subject, message } = req.body;

            // Validate client by email in contactPersons array
            const client = await ClientManagement.findOne({
                'contactPersons.email': email.trim().toLowerCase()
            });

            if (!client) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Client not found." 
                });
            }

            // Get client name from the first contact person or use clientName
            const clientName = client.contactPersons && client.contactPersons.length > 0 
                ? client.contactPersons[0].contactName 
                : client.clientName;

            // Upload file if present
            let attachmentUrl = null;
            if (req.files && req.files.attachment) {
                const uploadResult = await cloudinary.uploader.upload(req.files.attachment.tempFilePath, {
                    folder: "proposal_attachments",
                    resource_type: "auto",
                });
                attachmentUrl = uploadResult.secure_url;
            }

            // Styled HTML Email Content
            const htmlContent = `
                <div style="background-color:#f4f4f4;padding:40px 0;font-family:Arial,sans-serif;">
                    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="padding:30px 30px 20px 30px;border-bottom:1px solid #eee;">
                            <h2 style="margin:0;font-size:22px;color:#333;">Proposal from <span style="color:#0e76a8;">Bon Bon</span></h2>
                        </div>
                        <div style="padding:30px;">
                            <p style="font-size:16px;color:#333;margin-bottom:20px;">Dear ${clientName || "Client"},</p>
                            <p style="font-size:15px;color:#555;line-height:1.6;margin-bottom:25px;">
                                ${message || "Please review the proposal attached below."}
                            </p>
                            ${attachmentUrl ? `
                            <div style="margin-bottom:30px;">
                                <p style="font-size:15px;margin:0;"><strong>Download:</strong></p>
                                <a href="${attachmentUrl}" style="display:inline-block;margin-top:8px;background:#0e76a8;color:#ffffff;padding:10px 20px;border-radius:5px;text-decoration:none;font-size:15px;">View Proposal</a>
                            </div>
                            ` : ''}
                            <p style="font-size:15px;color:#777;">Best regards,<br/>The Bon Bon Team</p>
                            <p style="margin-top:20px;font-size:13px;color:#999;">
                                For any questions, contact us at 
                                <a href="mailto:support@bonbon.com" style="color:#0e76a8;text-decoration:none;">support@bonbon.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            `;

            // Send email
            await sendEmail(email, subject || "Proposal from Bon Bon", htmlContent);

            return res.status(200).json({
                success: true,
                message: "Email sent successfully",
                email_to: email,
                attachment: attachmentUrl,
            });
        } catch (error) {
            console.error("Error sending proposal email:", error);
            return res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Additional email methods can be added here
    static async sendGeneralEmail(req, res) {
        try {
            const { to, subject, message, htmlContent } = req.body;

            if (!to || !subject) {
                return res.status(400).json({
                    success: false,
                    message: "Email address and subject are required"
                });
            }

            // Use provided HTML content or create a simple one
            const emailHtml = htmlContent || `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">${subject}</h2>
                    <p style="color: #555; line-height: 1.6;">${message || ''}</p>
                    <p style="color: #777; margin-top: 20px;">Best regards,<br/>Bon Bon Team</p>
                </div>
            `;

            await sendEmail(to, subject, emailHtml);

            return res.status(200).json({
                success: true,
                message: "Email sent successfully",
                email_to: to
            });
        } catch (error) {
            console.error("Error sending general email:", error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = SendEmailController;
