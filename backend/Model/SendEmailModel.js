const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true
    },
    htmlContent: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const EmailHistorySchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    htmlContent: {
        type: String,
        required: true
    },
    attachmentUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
       
        default: 'pending'
    },
    errorMessage: {
        type: String,
        default: null
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientManagement'
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmailTemplate'
    }
}, {
    timestamps: true
});

// Email Template Model
const EmailTemplate = mongoose.model('EmailTemplate', EmailTemplateSchema);

// Email History Model
const EmailHistory = mongoose.model('EmailHistory', EmailHistorySchema);

module.exports = {
    EmailTemplate,
    EmailHistory
};
