const express = require("express");
const { sendProposalForSignature, checkIfSigned } = require("../Controller/SendProposalController");

const router = express.Router();

router.post('/sendProposalForSignature', sendProposalForSignature);
router.get('/checkIfSigned/:envelopeId', checkIfSigned);

module.exports = router;
