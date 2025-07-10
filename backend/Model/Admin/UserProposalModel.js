const mongoose = require("mongoose");

const userProposalSchema = new mongoose.Schema({

    proposal: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    projects: {
        type: String,
        required: true,
    },
    jobs: {
        type: String,
        required: true,
    },
    tasks: {
        type: String,
        required: true,
    },
    reports: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    client: {
        type: String,
        required: true,
    },
    invoice: {
        type: String,
        required: true,
    },
    billing: {
        type: String,
        required: true,
    },
    dailylogs: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('UserProposal', userProposalSchema);
