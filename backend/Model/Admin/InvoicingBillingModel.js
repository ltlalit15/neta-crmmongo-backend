const mongoose = require("mongoose");

const Projects = require("./ProjectsModel");
const ClientManagement = require("./ClientManagementModel");

const InvoicingBillingSchema = new mongoose.Schema({
    projectId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true,
    }],
    clientId: {
        type: mongoose.Schema.Types.ObjectId,    //id client
        ref: 'ClientManagement',
        required: true,
    },
    InvoiceNo: {
        type: String,
        required: true,
        unique: true,
    },
    
    CostEstimatesId: {
        type: mongoose.Schema.Types.ObjectId,    //id client
        ref: 'CostEstimates',
        required: true,
    },
    ReceivablePurchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReceivablePurchase',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    document: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
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


}, {
    timestamps: true,
});

module.exports = mongoose.model('InvoicingBilling', InvoicingBillingSchema);

