const express = require("express");
const { sendProposalForSignature, checkIfSigned, getEnvelopesByProjectId } = require("../Controller/SendProposalController");

const router = express.Router();

router.post('/sendProposalForSignature', sendProposalForSignature);
router.get('/checkIfSigned/:envelopeId', checkIfSigned);
router.get('/getEnvelopesByProjectId/:project_id', getEnvelopesByProjectId);

module.exports = router;
