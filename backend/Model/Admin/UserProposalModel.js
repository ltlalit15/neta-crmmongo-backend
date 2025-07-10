const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  view: { type: String, default: false },
  edit: { type: String, default: false },
  create: { type: String, default: false },
  delete: { type: String, default: false }
}, { _id: false });

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
   projectsAndJobs: { type: permissionSchema, required: true, default: () => ({}) },
 
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
    invoiceAndBilling: { type: permissionSchema, required: true, default: () => ({}) },
   
    dailylogs: {
        type: String,
        required: true,
        default: false
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('UserProposal', userProposalSchema);
