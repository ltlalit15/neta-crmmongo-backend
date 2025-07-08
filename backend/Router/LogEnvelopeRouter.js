const express = require('express');
const { logEnvelope } = require('../Controller/LogEnvelopeController');

const router = express.Router();

router.post('/LogEnvelope', logEnvelope);

module.exports = router;