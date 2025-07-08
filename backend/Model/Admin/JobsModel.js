const mongoose = require("mongoose");

const Projects = require("./ProjectsModel");

const jobsSchema = new mongoose.Schema({
    projectId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true,
    }],
    JobNo: {
    type: String,
    required: true,
    unique: true
  },
    brandName: {
        type: String,
        required: true,
    },
    subBrand: {
        type: String,
        required: true,
    },
    flavour: {
        type: String,
        required: true,
    },
    packType: {
        type: String,
        required: true,
    },
    packCode: {
        type: String,
        required: true,
    },
    packSize: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        required: true,
    },
    assign: {
        type: String,
        required: true,
    },
    barcode: {
        type: String,
        required: true
    },
    // totalTime: {
    //     type: String,
    //     require: true
    // }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Jobs', jobsSchema);

