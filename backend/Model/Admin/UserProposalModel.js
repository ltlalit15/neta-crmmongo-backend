const mongoose = require("mongoose");

// Reusable permission schema
const permissionSchema = new mongoose.Schema({
  view: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  delete: { type: Boolean, default: false }
}, { _id: false });

const userProposalSchema = new mongoose.Schema({
  proposal: {
    type: permissionSchema,
    required: true,
    default: () => ({}),
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  projectsAndJobs: {
    type: permissionSchema,
    required: true,
    default: () => ({}),
  },
  tasks: {
    type: permissionSchema,
    required: true,
    default: () => ({}),
  },
  reports: {
    type: permissionSchema,
    required: true,
    default: () => ({}),
  },
  user: {
    type: permissionSchema,
    required: true,
    default: () => ({}),
  },
  client: {
    type: permissionSchema,
    required: true,
    default: () => ({}),
  },
  invoiceAndBilling: {
    type: permissionSchema,
    required: true,
    default: () => ({}),
  },
  dailylogs: {
    type: permissionSchema,
    required: true,
    default: () => ({}),
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserProposal', userProposalSchema);
