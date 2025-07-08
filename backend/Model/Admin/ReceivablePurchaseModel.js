const mongoose = require("mongoose");

const Projects = require("./ProjectsModel");
const ClientManagement = require("./ClientManagementModel");

const ReceivablePurchaseSchema = new mongoose.Schema({
    projectId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true,
    }],
    ClientId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientManagement',
        required: true
    }],
    CostEstimatesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CostEstimates',
        required: true
    }],
   
    PONumber: {
        type: String,
        required: true,
        unique: true
    },
    POStatus: {
        type: String,
        required: true,
        default: 'Pending',
    },
    ReceivedDate: {
        type: Date,
        required: true,
    },
    Amount: {
        type: Number,
        required: true,
    },
    image: [],
}, {
    timestamps: true,
});


module.exports = mongoose.model('ReceivablePurchase', ReceivablePurchaseSchema);

