const mongoose = require("mongoose");

const Projects = require("./ProjectsModel");
const Jobs = require('./JobsModel');
// const User = require('./Model/userModel');

const TimesheetWorklogSchema = new mongoose.Schema({
    projectId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true,
    }],
    jobId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
        required: true
    }],
    employeeId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    taskDescription: {
        type: String,
        required: true,
    },

    hours: {
        type: String,
        required: false // or just remove 'required'
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('TimesheetWorklog', TimesheetWorklogSchema);

