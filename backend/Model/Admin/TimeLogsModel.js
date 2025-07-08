const mongoose = require("mongoose");

const Projects = require("./ProjectsModel");
const Jobs = require('./JobsModel');

const TimeLogsSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true,
    },
    extraHours: {
        type: String,
        required: true,
    },
    hours: {
        type:String,
        required: true,
    },
    taskNotes: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('TimeLogs', TimeLogsSchema);

