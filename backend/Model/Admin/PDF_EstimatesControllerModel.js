const mongoose = require("mongoose");

const PDFSchema = new mongoose.Schema({
    CostEstimatesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CostEstimates',
        required: true,
    }],
    projectId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true,
    }],
    clientId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientManagement',
        required: true,
    }],
}, { timestamps: true });

module.exports = mongoose.model('PDF_Estimate', PDFSchema);
