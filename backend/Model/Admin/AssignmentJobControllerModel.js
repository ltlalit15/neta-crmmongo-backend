const mongoose = require("mongoose");



const AssignmentSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    jobId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
        required: true
    }],
    selectDesigner: {
        type: String,
        required: true,
    },
    // employee: {
    //     type: String,
    //     required: true,
    // },
    description: {
        type: String,
        required: true,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Assignment', AssignmentSchema);