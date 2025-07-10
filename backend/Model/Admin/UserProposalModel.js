const mongoose = require("mongoose");

const userProposalSchema = new mongoose.Schema({

    proposal: {
        type: String,
        required: true,
        default: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    'projects&jobs': {
        type: String,
        required: true,
         default: false,
    },
 
    tasks: {
        type: String,
        required: true,
         default: false,
    },
    reports: {
        type: String,
        required: true,
        default: false,
    },
    user: {
        type: String,
        required: true,
        default: false
    },
    client: {
        type: String,
        required: true,
        default: false
    },
    'invoice&billing': {
        type: String,
        required: true,
        default: false
    },
   
    dailylogs: {
        type: String,
        required: true,
        default: false
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('UserProposal', userProposalSchema);
