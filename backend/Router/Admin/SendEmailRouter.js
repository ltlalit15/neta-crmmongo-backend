const express = require('express');
const router = express.Router();
const SendEmailController = require('../../Controller/Admin/SendEmailController');
const asyncHandler = require('express-async-handler');

// Route to send proposal email
router.post('/send-proposal', asyncHandler(SendEmailController.sendProposalEmail));

// Route to send general email
router.post('/send-general', asyncHandler(SendEmailController.sendGeneralEmail));

module.exports = router; 