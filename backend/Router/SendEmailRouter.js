const express = require("express");
const { sendProposalEmail } = require("../Controller/sendEmailController");

const router = express.Router();

router.post('/sendProposalEmail', sendProposalEmail);
//router.get('/checkEnvelopeStatus/:envelopeId', checkIfSigned);

module.exports = router;
