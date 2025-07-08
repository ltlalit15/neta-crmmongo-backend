const mongoose = require("mongoose");

const Projects = require("./ProjectsModel");
const ClientManagement = require("./ClientManagementModel");

const CostEstimatesSchema = new mongoose.Schema({
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
    receivablePurchaseId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReceivablePurchase',
        required: true,
    }],

    estimateDate: {
        type: Date,
        required: true,
    },
    validUntil: {
        type: Date,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    estimateRef: {
        type: String,
        required: true,
        unique: true
    },
    lineItems: [{
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        _id: false,
    }],
    VATRate: {
        type: Number,
        required: true,
    },
    Notes: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('CostEstimates', CostEstimatesSchema);

