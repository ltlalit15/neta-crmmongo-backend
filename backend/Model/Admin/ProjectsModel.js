const mongoose = require("mongoose");

const ClientManagement = require("./ClientManagementModel");


const ProjectsSchema = new mongoose.Schema({
  projectNo: {
    type: String,
    required: true,
    unique: true
  },
  projectName: {
    type: String,
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,    //id client
    ref: 'ClientManagement',
    required: true,
  },
  // managerId: {
  //   type: mongoose.Schema.Types.ObjectId,  //id projectManager
  //   ref: 'projectManager',
  //   required: true,
  // },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  projectPriority: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  projectRequirements: [{
    creativeDesign: {
      type: Boolean,
      required: true,
    },
    artworkAdaptation: {
      type: Boolean,
      required: true,
    },
    prepress: {
      type: Boolean,
      required: true,
    },
    POS: {
      type: Boolean,
      required: true,
    },
    mockups: {
      type: Boolean,
      required: true,
    },
    rendering: {
      type: Boolean,
      required: true,
    },
    _id: false,
  }],

  budgetAmount: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  // totalTime :{
  //   type:String,
  //   require:true
  // }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Projects', ProjectsSchema);