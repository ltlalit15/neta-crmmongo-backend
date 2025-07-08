const asyncHandler = require('express-async-handler');
const Jobs = require('../Model/JobsModel');
const Projects = require("../Model/ProjectsModel");
const cloudinary = require('../Config/cloudinary');
const mongoose =require("mongoose")

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const jobCreate = asyncHandler(async (req, res) => {
  const {
    projectsId, 
    brandName,
    subBrand,
    flavour,
    packType,
    packSize,
    priority,
    Status,
    assign,
    totalTime,
    barcode
  } = req.body;

  try {
    const project = await Projects.findById(projectsId);
    if (!mongoose.Types.ObjectId.isValid(projectsId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID format"
      });
    }
    
    const newJob = new Jobs({
      projects: projectsId,
      brandName,
      subBrand,
      flavour,
      packType,
      packSize,
      priority,
      Status,
      assign,
      totalTime,
      barcode
    });
    await newJob.save();
    const jobData = newJob.toObject();
    jobData.projectId = jobData.projects;
    delete jobData.projects; 
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: jobData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the Job",
      error: error.message,
    });
  }
});


    //GET SINGLE AllProjects
  //METHOD:GET
  const AllJob = async (req, res) => {
    try {
      // Fetch all jobs and populate the related project data (_id and projectName)
      const allJobs = await Jobs.find()
        .populate('projects', '_id projectName'); // Populate project fields: _id and projectName
  
      if (!allJobs || allJobs.length === 0) {
        return res.status(404).json({ success: false, message: "No jobs found" });
      }
  
      res.status(200).json({
        success: true,
        jobs: allJobs, // Return all jobs with populated project data
      });
  
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching jobs",
        error: error.message,
      });
    }
};

  
  
  
  
  


  //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteJob = async (req, res) => {
      let deleteJobID = req.params.id
      if (deleteJob) {
        const deleteJob = await Jobs.findByIdAndDelete(deleteJobID, req.body);
        res.status(200).json("Delete Job Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateJob = async (req, res) => {
    try {
      const allowedFields = [
        'projects',  // Project ID
        'projectName',     
        'brandName',
        'subBrand',    
        'flavour',    
        'packType',
        'packSize',
        'priority',
        'Status',
        'assign',
        'totalTime',
      ];
      const updateData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'At least one field must be provided for update' });
      }
      const updatedDiary = await Jobs.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedDiary) {
        return res.status(404).json({ message: 'Diary not found' });
      }
      res.status(200).json(updatedDiary);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };




  
  //METHOD:Single
  //TYPE:PUBLIC
    const SingleJob=async(req,res)=>{
      try {
          const SingleJob= await Jobs.findById(req.params.id);
          res.status(200).json(SingleJob)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Diaries"} )
      }
  }


module.exports = {jobCreate,AllJob,deleteJob,UpdateJob,SingleJob};
























const asyncHandler = require('express-async-handler');
const Jobs = require('../Model/JobsModel');
const Projects = require("../Model/ProjectsModel");
const cloudinary = require('../Config/cloudinary');
const mongoose =require("mongoose")

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});
const jobCreate = asyncHandler(async (req, res) => {
  const {
    projectsId, 
    brandName,
    subBrand,
    flavour,
    packType,
    packSize,
    priority,
    Status,
    assign,
    totalTime,
    barcode
  } = req.body;

  try {
    // Check if the Project ID is valid
    if (!mongoose.Types.ObjectId.isValid(projectsId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID format"
      });
    }
    
    // Find the Project to verify it exists
    const project = await Projects.findById(projectsId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Create a new Job with the correct field name projectId
    const newJob = new Jobs({
      projectId: projectsId, // Fixing this to use projectId
      brandName,
      subBrand,
      flavour,
      packType,
      packSize,
      priority,
      Status,
      assign,
      totalTime,
      barcode
    });

    // Save the job
    await newJob.save();

    // Format the job data to include projectId instead of projects
    const jobData = newJob.toObject();
    jobData.projectId = jobData.projectId; // Ensure projectId is returned
    delete jobData.projects; // Remove the old field if it exists
    
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: jobData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the Job",
      error: error.message,
    });
  }
});




    //GET SINGLE AllProjects
  //METHOD:GET
  const AllJob = async (req, res) => {
    try {
      const allJobs = await Jobs.find()
        .populate({
          path: 'projectId', // Use projectId to populate
          select: '_id name', // Include both project ID and name
          model: 'Projects'
        });
  
      if (!allJobs || allJobs.length === 0) {
        return res.status(404).json({ success: false, message: "No jobs found" });
      }
  
      // Modify the response to include projectId and projectName
      const jobsWithProjectDetails = allJobs.map(job => {
        return {
          ...job.toObject(),
          project: {
            projectId: job.projectId._id, // project ID
            projectName: job.projectId.name, // project name
          }
        };
      });
  
      res.status(200).json({
        success: true,
        jobs: jobsWithProjectDetails,
      });
  
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching jobs",
        error: error.message,
      });
    }
  };
  
  
  
  
  


  //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteJob = async (req, res) => {
      let deleteJobID = req.params.id
      if (deleteJob) {
        const deleteJob = await Jobs.findByIdAndDelete(deleteJobID, req.body);
        res.status(200).json("Delete Job Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateJob = async (req, res) => {
    try {
      const allowedFields = [
        'projects',  // Project ID
        'projectName',     
        'brandName',
        'subBrand',    
        'flavour',    
        'packType',
        'packSize',
        'priority',
        'Status',
        'assign',
        'totalTime',
      ];
      const updateData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'At least one field must be provided for update' });
      }
      const updatedDiary = await Jobs.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedDiary) {
        return res.status(404).json({ message: 'Diary not found' });
      }
      res.status(200).json(updatedDiary);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };




  
  //METHOD:Single
  //TYPE:PUBLIC
    const SingleJob=async(req,res)=>{
      try {
          const SingleJob= await Jobs.findById(req.params.id);
          res.status(200).json(SingleJob)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Diaries"} )
      }
  }


module.exports = {jobCreate,AllJob,deleteJob,UpdateJob,SingleJob};





const mongoose = require("mongoose");

const Projects = require("./ProjectsModel");

const jobsSchema = new mongoose.Schema({
    projectId:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true,
    }],
    brandName: {
        type:String ,
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
    packSize: {
        type: String,
        required: true,
    },
    priority:{
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
    totalTime: {
        type: String,
        require: true
    }
},{
    timestamps: true,
});

module.exports = mongoose.model('Jobs', jobsSchema);






























  const AllJob = async (req, res) => {
    try {
      // Fetch all projects with their _id and projectName
      const allProjects = await Projects.find()
        .select('_id projectName'); // Only select _id and projectName fields
  
      if (!allProjects || allProjects.length === 0) {
        return res.status(404).json({ success: false, message: "No projects found" });
      }
  
      res.status(200).json({
        success: true,
        jobs: allProjects, // Return the projects in the response
      });
  
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching projects",
        error: error.message,
      });
    }
  };
  



  {
    "projectsId": [
      "681c8656d90e15caa3863398", 
      "681c8662d90e15caa386339a"
    ],
    "brandName": "Pepsi",
    "subBrand": "Pepsi Max",
    "flavour": "Cherry",
    "packType": "Can",
    "packSize": "330ml",
    "priority": "Low",
    "Status": "In Progress",
    "assign": "Designer",
    "barcode": "POS-123456",
    "totalTime": "05:30"
  }
  

























  // //////////////
  
// ///////////////////


const userRegister=asynchandler(
async(req,res)=>{
    const {name,email,phone,address,city,password}=req.body

    if(!name || !email || !phone || !address || !city || !password ){
        throw new Error("Pliss Fill All Detilse")
    }
     if(phone.length > 10){
        res.status(401)
        throw new Error('Please number is 10 digit')    
     }
    // user Exist 
     const userExist = await User.findOne({email:email})

    if(userExist){
    res.status(401)
    throw new Error("User Already Exist")
    }

     const salt = await bcrypt.genSalt(10)
     const hashpassword =await bcrypt.hash(password,salt)

    //  creat 
    const user = await User.create({
        name,
        email,
        phone,
        address,
        city,
        password:hashpassword,
    })
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            city:user.city,
            password:user.password,
            token:genretToken(user._id)

        })
    } 
 
    res.send("Register Router")
})

const userlogin=asynchandler(
async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        throw new Error("Pliss Fill All Detilse")
    }

    //  user Exist 
    const  user =await User.findOne({email})

    if(user && (await bcrypt.compare(password,user.password))){
     res.status(200).json({
        _id:user._id,
        email:user.email,
        password:user.password,
        isAdmin : user?.isAdmin,
        token:genretToken(user._id),
        

     })
    }else{
        res.status(401)
        throw new Error("Invalid Cordetion")
    }

    res.send("Login Router")
})



module.exports = {userRegister,userlogin,getMe}

























const asyncHandler = require('express-async-handler');
const ReceivablePurchase = require('../Model/ReceivablePurchaseModel');
const Projects = require("../Model/ProjectsModel");
const ClientManagement = require("../Model/ClientManagementModel");
const cloudinary = require('../Config/cloudinary');
const mongoose = require("mongoose");

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const ReceivablePurchaseCreate = asyncHandler(async (req, res) => {
  let {
    projectsId,
    ClientId,
    Status,
    ReceivedDate,
    Amount
  } = req.body;

  try {
    if (typeof projectsId === "string") {
      try {
        projectsId = JSON.parse(projectsId);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid projectsId format",
        });
      }
    }

    if (!projectsId || !Array.isArray(projectsId)) {
      return res.status(400).json({
        success: false,
        message: "projectsId is required and should be an array"
      });
    }

    const projects = await Projects.find({ _id: { $in: projectsId } });
    if (projects.length !== projectsId.length) {
      return res.status(404).json({
        success: false,
        message: "One or more projects not found."
      });
    }

    const client = await ClientManagement.findById(ClientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found."
      });
    }

    let imageUrls = [];

    if (req.files && req.files.image) {
      const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

      for (const file of files) {
        try {
          const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'user_profiles',
            resource_type: 'image',
          });
          if (result.secure_url) {
            imageUrls.push(result.secure_url);
          }
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
        }
      }
    }

    const newReceivablePurchase = new ReceivablePurchase({
      projectsId,
      ClientId,
      ReceivedDate,
      Status,
      Amount,
      image: imageUrls, 
    });

    await newReceivablePurchase.save();

    res.status(201).json({
      success: true,
      message: "Receivable Purchase created successfully",
      receivablePurchase: newReceivablePurchase,
    });

  } catch (error) {
    console.error("Error creating Receivable Purchase:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the Receivable Purchase",
      error: error.message,
    });
  }
});


module.exports = { ReceivablePurchaseCreate };




















































function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.trim().split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


const TimesheetWorklogCreate = asyncHandler(async (req, res) => {
  const {
    projectId,
    jobId,
    employeeId,
    date,
    startTime,
    endTime,
    taskDescription,
    status,
    tags
  } = req.body;

  try {
    // Validate project IDs
    if (!Array.isArray(projectId) || projectId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID format. Ensure all IDs are valid."
      });
    }

    // Validate jobId array
    if (!Array.isArray(jobId) || jobId.length === 0 || jobId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID format. Ensure all IDs are valid."
      });
    }

    // Validate EmployeeId array
    // ✅ Validate Employee ID array
    if (!Array.isArray(employeeId) || employeeId.length === 0 || employeeId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID format. Ensure all IDs are valid."
      });
    }

    // Check if all projects exist
    const projects = await Projects.find({ '_id': { $in: projectId } });
    if (projects.length !== projectId.length) {
      return res.status(404).json({
        success: false,
        message: "One or more projects not found"
      });
    }

    // Check if job exists (using first jobId only)
    const job = await Jobs.findById(jobId[0]);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    // Check if job exists (using first jobId only)

    // Validate EmployeeId array
    // ✅ Find employee in User table
    const employeeUser = await User.findOne({ _id: employeeId[0], role: "employee" });
    if (!employeeUser) {
      return res.status(404).json({
        success: false,
        message: "Employee user not found or role is not 'employee'"
      });
    }

    // Convert to 24-hour format
    const start24 = convertTo24Hour(startTime);
    const end24 = convertTo24Hour(endTime);

    // Validate and calculate hours
    const start = new Date(`${date}T${start24}`);
    const end = new Date(`${date}T${end24}`);


    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid startTime or endTime format"
      });
    }

    // ✅ Handle overnight shift
    if (start >= end) {
      end.setDate(end.getDate() + 1); // Add 1 day to end
    }

    const milliseconds = end - start;
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = +(totalMinutes / 60).toFixed(2);
    const durationReadable = `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, '0')}`;

    // Create the new TimeLog
    const newTimesheetWorklog = new TimesheetWorklogs({
      projectId,
      jobId: jobId[0],
      employeeId: employeeUser._id,
      date,
      startTime,
      endTime,
      hours: durationReadable,
      taskDescription,
      status,
      tags
    });

    await newTimesheetWorklog.save();

    res.status(201).json({
      success: true,
      message: "TimeLog created successfully",
      TimesheetWorklog: newTimesheetWorklog.toObject(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the TimeLog",
      error: error.message,
    });
  }
});



















// const TimesheetWorklogCreate = asyncHandler(async (req, res) => {

//     const {
//         projectId,
//         jobId,
//         date,
//         startTime,
//         endTime,
//         hours,
//         taskDescription,
//         status,
//         tags
//     } = req.body;

//     try {
//         // Validate project IDs
//         if (!Array.isArray(projectId) || projectId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Project ID format. Ensure all IDs are valid."
//             });
//         }

//         // Validate jobId array
//         if (!Array.isArray(jobId) || jobId.length === 0 || jobId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Job ID format. Ensure all IDs are valid."
//             });
//         }

//         // Check if all projects exist
//         const projects = await Projects.find({ '_id': { $in: projectId } });
//         if (projects.length !== projectId.length) {
//             return res.status(404).json({
//                 success: false,
//                 message: "One or more projects not found"
//             });
//         }

//         // Check if job exists (using first jobId only)
//         const job = await Jobs.findById(jobId[0]);
//         if (!job) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Job not found"
//             });
//         }

//         // Create the new TimeLog
//         const newTimesheetWorklog = new TimesheetWorklogs({
//             projectId: projectId,
//             jobId: jobId[0],  
//             date,
//             startTime,
//             endTime,
//             hours,
//             taskDescription,
//             status,
//             tags
//         });

//         await newTimesheetWorklog.save();

//         res.status(201).json({
//             success: true,
//             message: "TimeLog created successfully",
//             TimesheetWorklog: newTimesheetWorklog.toObject(),
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "An error occurred while creating the TimeLog",
//             error: error.message,
//         });
//     }
// });

// Helper: Convert 12-hour format (e.g., "02:30 PM") to 24-hour format (e.g., "14:30")

























const asyncHandler = require('express-async-handler');
const CostEstimates = require('../../Model/Admin/CostEstimatesModel');
const Projects = require("../../Model/Admin/ProjectsModel");
const ClientManagement = require("../../Model/Admin/ClientManagementModel");
const cloudinary = require('../../Config/cloudinary');

const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});
const costEstimatesCreate = asyncHandler(async (req, res) => {
  const {
    projectsId,
    clientId,
    estimateDate,
    validUntil,
    currency,
    lineItems,
    VATRate,
    Notes,
    POStatus,
    Status
  } = req.body;

  try {
if (!Array.isArray(projectsId) || projectsId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
  return res.status(400).json({ success: false, message: "Invalid Project ID format." });
}


    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ success: false, message: "Invalid Client ID format." });
    }

    const projects = await Projects.find({ '_id': { $in: projectsId } });
    if (projects.length !== projectsId.length) {
      return res.status(404).json({ success: false, message: "One or more projects not found" });
    }

    const client = await ClientManagement.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const newCostEstimate = new CostEstimates({
      projectId: projectsId,
      clientId,
      estimateDate,
      validUntil,
      currency,
      lineItems,
      VATRate,
      Notes,
      POStatus,
      Status,
      estimateRef 
    });

    await newCostEstimate.save();

    res.status(201).json({
      success: true,
      message: "Cost Estimate created successfully",
      costEstimate: newCostEstimate,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the Cost Estimate",
      error: error.message,
    });
  }
});



























import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Example user data (replace with props or redux in real app)
const userData = {
  permissions: {
    dashboardAccess: true,
    userManagement: true,
   
  },
  accessLevel: {
    fullAccess: true,
    limitedAccess: false,
    viewOnly: false
  },
  _id: '68418bc45df221af4efdffee',
  firstName: 'employee',
  lastName: '1',
  email: 'employee@gmail.com',
  phone: '1234567890',
  role: 'employee',
  state: 'California',
  country: 'California',
  assign: 'Production',
  isAdmin: false,
  profileImage: [
    ''
  ],
  googleSignIn: false,
  createdAt: '2025-06-05T12:21:24.100Z',
  updatedAt: '2025-06-05T12:21:24.100Z',
};


// // Example user data (replace with props or redux in real app)
const Data = {
  permissions: {
    dashboardAccess: true,
    userManagement: true,
    clientManagement: false,
    projectManagement: false,
    designTools: false,
    financialManagement: false,
    reportGeneration: false,
    systemSettings: false
  },
  accessLevel: {
    fullAccess: true,
    limitedAccess: false,
    viewOnly: false
  },
  _id: '68418bc45df221af4efdffee',
  firstName: 'employee',
  lastName: '1',
  email: 'employee@gmail.com',
  phone: '1234567890',
  role: 'employee',
  state: 'California',
  country: 'California',
  assign: 'Production',
  isAdmin: false,
  profileImage: [
    ''
  ],
  googleSignIn: false,
  createdAt: '2025-06-05T12:21:24.100Z',
  updatedAt: '2025-06-05T12:21:24.100Z',
};
function Profile() {
  // Form state
  const [form, setForm] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    state: userData.state,
    country: userData.country,
    assign: userData.assign,
    profileImage: userData.profileImage[0] || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files && files[0]) {
      setForm({ ...form, profileImage: URL.createObjectURL(files[0]) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle form submit (simulate update)
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage('Profile updated successfully!');
    }, 1200);
  };

  // Permissions badges
  const permissionBadges = Object.entries(userData.permissions).map(([key, value]) => (
    <span key={key} className={`badge me-2 mb-1 ${value ? 'bg-success' : 'bg-secondary'}`} title={key.replace(/([A-Z])/g, ' $1')}>
      {key.replace(/([A-Z])/g, ' $1')}
    </span>
  ));
  // Access level badges
  const accessBadges = Object.entries(userData.accessLevel).map(([key, value]) => (
    <span key={key} className={`badge me-2 mb-1 ${value ? 'bg-primary' : 'bg-light text-dark border'}`} title={key.replace(/([A-Z])/g, ' $1')}>
      {key.replace(/([A-Z])/g, ' $1')}
    </span>
  ));




  const createdDate = new Date(userData.createdAt).toLocaleDateString('en-GB');
  const updatedDate = new Date(userData.updatedAt).toLocaleDateString('en-GB');

  // Access Level list
  const accessLevels = Object.entries(userData.accessLevel).map(([key, value]) => (
    <li key={key} className="mb-2">
      <span className={`badge px-3 py-2 fs-6 d-flex align-items-center gap-2 ${value ? 'bg-primary' : 'bg-light text-dark border'}`}
        title={key.replace(/([A-Z])/g, ' $1').toLowerCase()}>
        <i className="bi bi-shield-lock-fill"></i>
        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
      </span>
    </li>
  ));

  // Permissions list
  const permissions = Object.entries(userData.permissions).map(([key, value]) => (
    <li key={key} className="mb-2">
      <span className={`badge px-3 py-2 fs-6 d-flex align-items-center gap-2 ${value ? 'bg-success' : 'bg-secondary'}`}
        title={key.replace(/([A-Z])/g, ' $1').toLowerCase()}>
        <i className="bi bi-check2-circle"></i>
        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
      </span>
    </li>
  ));

  return (
    <>
      <div className="container py-2">
        <div className="row justify-content-center g-4">
          {/* Profile summary */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-lg " style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)', borderRadius: '1.5rem' }}>
              <div className="card-body text-center p-4 d-flex flex-column align-items-center justify-content-between h-100">
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src={form.profileImage || 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2654'}
                    alt="avatar"
                    className="rounded-circle border border-3 border-primary shadow"
                    style={{ width: '140px', height: '140px', objectFit: 'cover', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                  />
                </div>
                <h4 className="fw-bold mb-1 mt-2">{userData.firstName} {userData.lastName}</h4>
                <div className="mb-2">
                  <i className="bi bi-envelope-at me-1"></i>
                  <span className="fw-semibold">{Data.email}</span>
                </div>
                <div className="mb-2">
                  <i className="bi bi-telephone me-1"></i>
                  <span className="fw-semibold">{Data.phone}</span>
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
                  <span className="small text-secondary"><i className="bi bi-clock-history me-1"></i>Last Updated: {updatedDate}</span>
                  <span className="small text-secondary"><i className="bi bi-hash me-1"></i>User ID: {Data._id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile details & update form */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg mb-4" style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)', borderRadius: '1.5rem' }}>
              <div className="card-body p-4">
                <h5 className="mb-4 fw-bold d-flex align-items-center"><i className="bi bi-pencil-square me-2"></i>Profile Details</h5>
                {/* User Details Section */}
                <div className="row mb-3 g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-envelope-at me-2 text-primary"></i>
                        <span className="fw-semibold">{Data.email}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-telephone me-2 text-primary"></i>
                        <span className="fw-semibold">{Data.phone}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-geo-alt me-2 text-primary"></i>
                        <span className="fw-semibold">{Data.state}, {Data.country}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-semibold">Access Level:</span>
                        <span className="badge bg-primary ms-2 text-capitalize">Full Access</span>
                      </div>
                      <div className="mb-2 text-muted small">
                        {Data.role && <span className="badge bg-info text-dark me-1 text-capitalize">{Data.role}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-google me-2 text-primary"></i>
                        <span className="fw-semibold">Google Sign In:</span>
                        <span className={`badge ms-2 ${Data.googleSignIn ? 'bg-success' : 'bg-secondary'}`}>{Data.googleSignIn ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-diagram-3-fill me-2 text-primary"></i>
                        <span className="fw-semibold">Department:</span>
                        <span className="text-muted ms-1">{Data.assign}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-check-circle-fill me-2 text-primary"></i>
                        <span className="fw-semibold">Status:</span>
                        <span className="badge ms-2 bg-success">Active</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-calendar-event me-2 text-primary"></i>
                        <span className="fw-semibold">Account Created:</span>
                        <span className="text-muted ms-1">{createdDate}</span>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-3 d-flex align-items-center"><i className="bi bi-check2-circle me-2"></i>Permissions</h5>
                        <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
                          {permissions}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" mt-4 border-0 ">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-2 d-flex align-items-center"><i className="bi bi-info-circle me-2"></i>About</h5>
                    <p className="text-muted mb-2">This is a placeholder for user bio or additional information. You can add more details about the employee here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Profile;
























const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const cloudinary = require('../Config/cloudinary');
const nodemailer = require('nodemailer');
const {encodeToken} = require ("../middlewares/decodeToken")
// Cloudinary config
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

// JWT Token function
const genretToken = (id) => {
    return jwt.sign({ id }, 'your_jwt_secret_key', { expiresIn: '7d' });
};

// Register user
const createUser = async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, passwordConfirm,
            phone, role, state, country, permissions, accessLevel,assign
        } = req.body;

        const requiredFields = { firstName, lastName, email, password, passwordConfirm, phone, role, state, country,assign };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || value.toString().trim() === '') {
                return res.status(400).json({ status: false, message: `${key} is required` });
            }
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ status: false, message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with same email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profileImage = '';
        if (req.files && req.files.image) {
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                folder: 'user_profiles',
                resource_type: 'image',
            });
            profileImage = result.secure_url;
        }

        const parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : permissions;
        const parsedAccessLevel = typeof accessLevel === 'string' ? JSON.parse(accessLevel) : accessLevel;

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role,
            state,
            country,
            assign,
            profileImage,
            permissions: parsedPermissions,
            accessLevel: parsedAccessLevel,
        });

        const token = genretToken(newUser._id);

        res.status(201).json({
            status: 'success',
            data: { user: newUser, token }
        });
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: 'Invalid email or password' });
        }

        const token = await genretToken(user._id);
        console.log(token)
        const encodeTokens= await encodeToken(token)
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token:encodeTokens,
            user
        });

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: "false", message: "User not found." });
        }

        if (user.googleSignIn === true) {
            return res.status(400).json({
                status: "false",
                message: "Password reset is not allowed for Google Sign-In users. Please log in using Google."
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'packageitappofficially@gmail.com',
                pass: 'epvuqqesdioohjvi',
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        await transporter.sendMail({
            from: 'packageitappofficially@gmail.com',
            to: email,
            subject: "Your Password Reset Token",
            html: `<p>Your password reset token: <strong>${resetToken}</strong></p>
                   <p>This token is valid for <strong>15 minutes</strong>.</p>
                   <p>If you did not request this, please ignore this email.</p>`,
        });

        res.status(200).json({ status: "true", message: "Password reset email sent successfully." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ status: "false", message: "Server error" });
    }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email and password are required." });
    }l
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    if (user.googleSignIn === true) {
      return res.status(400).json({ status: false, message: "Google sign-in user cannot reset password." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ status: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ status: false, message: "Server error." });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
};


       //GET SINGLE DeleteUser
  //METHOD:DELETE
  const deleteUser = async (req, res) => {
    let deleteUserID = req.params.id
    if (deleteUser) {
      const deleteUser = await User.findByIdAndDelete(deleteUserID, req.body);
      res.status(200).json("Delete Checklists Successfully")
    } else {
      res.status(400).json({ message: "Not Delete User" })
    }
  }

  //GET SINGLE UserUpdate
    //METHOD:PUT
    const UpdateUser = async (req, res) => {
      try {
        const allowedFields = [
           'firstName',
            'lastName',
            'email',
            'phone',
            'role',
            'state',
            'country',
            'profileImage',
            'permissions',
            'accessLevel'
        ];
        const updateData = {};
        allowedFields.forEach(field => {
          if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
          }
        });
        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ message: 'At least one field must be provided for update' });
        }
        const updatedDiary = await User.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );
        if (!updatedDiary) {
          return res.status(404).json({ message: 'Diary not found' });
        }
        res.status(200).json(updatedDiary);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
      }
    };
  

    module.exports = {createUser ,loginUser,forgotPassword,resetPassword,getAllUsers,deleteUser,UpdateUser}
















    const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const cloudinary = require('../Config/cloudinary');
const nodemailer = require('nodemailer');
const {encodeToken} = require ("../middlewares/decodeToken")
// Cloudinary config
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

// JWT Token function
const genretToken = (id) => {
    return jwt.sign({ id }, 'your_jwt_secret_key', { expiresIn: '7d' });
};

// Register user
const createUser = async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, passwordConfirm,
            phone, role, state, country, permissions, accessLevel,assign
        } = req.body;

        const requiredFields = { firstName, lastName, email, password, passwordConfirm, phone, role, state, country,assign };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || value.toString().trim() === '') {
                return res.status(400).json({ status: false, message: `${key} is required` });
            }
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ status: false, message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with same email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profileImage = '';
        if (req.files && req.files.image) {
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                folder: 'user_profiles',
                resource_type: 'image',
            });
            profileImage = result.secure_url;
        }

        const parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : permissions;
        const parsedAccessLevel = typeof accessLevel === 'string' ? JSON.parse(accessLevel) : accessLevel;

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role,
            state,
            country,
            assign,
            profileImage,
            permissions: parsedPermissions,
            accessLevel: parsedAccessLevel,
        });

        const token = genretToken(newUser._id);

        res.status(201).json({
            status: 'success',
            data: { user: newUser, token }
        });
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: 'Invalid email or password' });
        }

        const token = await genretToken(user._id);
        console.log(token)
        const encodeTokens= await encodeToken(token)
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token:encodeTokens,
            user
        });

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: "false", message: "User not found." });
        }

        if (user.googleSignIn === true) {
            return res.status(400).json({
                status: "false",
                message: "Password reset is not allowed for Google Sign-In users. Please log in using Google."
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'packageitappofficially@gmail.com',
                pass: 'epvuqqesdioohjvi',
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        await transporter.sendMail({
            from: 'packageitappofficially@gmail.com',
            to: email,
            subject: "Your Password Reset Token",
            html: `<p>Your password reset token: <strong>${resetToken}</strong></p>
                   <p>This token is valid for <strong>15 minutes</strong>.</p>
                   <p>If you did not request this, please ignore this email.</p>`,
        });

        res.status(200).json({ status: "true", message: "Password reset email sent successfully." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ status: "false", message: "Server error" });
    }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email and password are required." });
    }l
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    if (user.googleSignIn === true) {
      return res.status(400).json({ status: false, message: "Google sign-in user cannot reset password." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ status: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ status: false, message: "Server error." });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
};


       //GET SINGLE DeleteUser
  //METHOD:DELETE
  const deleteUser = async (req, res) => {
    let deleteUserID = req.params.id
    if (deleteUser) {
      const deleteUser = await User.findByIdAndDelete(deleteUserID, req.body);
      res.status(200).json("Delete Checklists Successfully")
    } else {
      res.status(400).json({ message: "Not Delete User" })
    }
  }

  //GET SINGLE UserUpdate
    //METHOD:PUT
    const UpdateUser = async (req, res) => {
      try {
        const allowedFields = [
           'firstName',
            'lastName',
            'email',
            'phone',
            'role',
            'state',
            'country',
            'profileImage',
            'permissions',
            'accessLevel'
        ];
        const updateData = {};
        allowedFields.forEach(field => {
          if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
          }
        });
        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ message: 'At least one field must be provided for update' });
        }
        const updatedDiary = await User.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );
        if (!updatedDiary) {
          return res.status(404).json({ message: 'Diary not found' });
        }
        res.status(200).json(updatedDiary);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
      }
    };
  

    module.exports = {createUser ,loginUser,forgotPassword,resetPassword,getAllUsers,deleteUser,UpdateUser}






    const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const cloudinary = require('../Config/cloudinary');
const nodemailer = require('nodemailer');
const {encodeToken} = require ("../middlewares/decodeToken")
// Cloudinary config
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

// JWT Token function
const genretToken = (id) => {
    return jwt.sign({ id }, 'your_jwt_secret_key', { expiresIn: '7d' });
};

// Register user
const createUser = async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, passwordConfirm,
            phone, role, state, country, permissions, accessLevel,assign
        } = req.body;

        const requiredFields = { firstName, lastName, email, password, passwordConfirm, phone, role, state, country,assign };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || value.toString().trim() === '') {
                return res.status(400).json({ status: false, message: `${key} is required` });
            }
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ status: false, message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with same email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profileImage = '';
        if (req.files && req.files.image) {
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                folder: 'user_profiles',
                resource_type: 'image',
            });
            profileImage = result.secure_url;
        }

        const parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : permissions;
        const parsedAccessLevel = typeof accessLevel === 'string' ? JSON.parse(accessLevel) : accessLevel;

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role,
            state,
            country,
            assign,
            profileImage,
            permissions: parsedPermissions,
            accessLevel: parsedAccessLevel,
        });

        const token = genretToken(newUser._id);

        res.status(201).json({
            status: 'success',
            data: { user: newUser, token }
        });
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: 'Invalid email or password' });
        }

        const token = await genretToken(user._id);
        console.log(token)
        const encodeTokens= await encodeToken(token)
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token:encodeTokens,
            user
        });

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// ✅ Email Function
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'packageitappofficially@gmail.com',
      pass: 'epvuqqesdioohjvi'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'sagarkher1999@gmail.com',
    to: options.email,
    subject: options.subject,
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Hi,</p>
        <p>We received a request to reset your password. Please click the button below to reset your password:</p>
        <a href="https://construction-mngmt.netlify.app/resetpassword?token=${options.resetToken}" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p>This link will expire in 10 minutes for security reasons.</p>
        <br>
        <p>Regards,<br>PackageIt Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found with this email' });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: 'Reset Your Password',
      resetToken: resetToken
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email!',
      resetToken: resetToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'There was an error sending email.' });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ status: 'fail', message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ status: 'fail', message: 'Passwords do not match.' });
    }

    // Hash the token to match with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with this token and check expiration
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ status: 'fail', message: 'Token is invalid or has expired.' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully.'
    });

  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
};


       //GET SINGLE DeleteUser
  //METHOD:DELETE
  const deleteUser = async (req, res) => {
    let deleteUserID = req.params.id
    if (deleteUser) {
      const deleteUser = await User.findByIdAndDelete(deleteUserID, req.body);
      res.status(200).json("Delete Checklists Successfully")
    } else {
      res.status(400).json({ message: "Not Delete User" })
    }
  }

  //GET SINGLE UserUpdate
    //METHOD:PUT
    const UpdateUser = async (req, res) => {
      try {
        const allowedFields = [
           'firstName',
            'lastName',
            'email',
            'phone',
            'role',
            'state',
            'country',
            'profileImage',
            'permissions',
            'accessLevel'
        ];
        const updateData = {};
        allowedFields.forEach(field => {
          if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
          }
        });
        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ message: 'At least one field must be provided for update' });
        }
        const updatedDiary = await User.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );
        if (!updatedDiary) {
          return res.status(404).json({ message: 'Diary not found' });
        }
        res.status(200).json(updatedDiary);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
      }
    };
  

    module.exports = {createUser ,loginUser,forgotPassword,resetPassword,getAllUsers,deleteUser,UpdateUser}











    // const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//     firstName: {
//         type: String,
//         required: [true, 'First name is required'],
//         trim: true
//     },
//     lastName: {
//         type: String,
//         required: [true, 'Last name is required'],
//         trim: true
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//             unique: true, 
//     },
//     phone: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required'],
//     },
//     role: {
//         type: String,
//         required: [true, 'Role is required'],
//         default: "user",
//     },
//     state: {
//         type: String,
//         required: true,
//     },
//     country: {
//         type: String,
//         required: true,
//     },
//     permissions: {
//         dashboardAccess: {
//             type: Boolean,
//             default: false
//         },
//         clientManagement: {
//             type: Boolean,
//             default: false
//         },
//         projectManagement: {
//             type: Boolean,
//             default: false
//         },
//         designTools: {
//             type: Boolean,
//             default: false
//         },
//         financialManagement: {
//             type: Boolean,
//             default: false
//         },
//         userManagement: {
//             type: Boolean,
//             default: false
//         },
//         reportGeneration: {
//             type: Boolean,
//             default: false
//         },
//         systemSettings: {
//             type: Boolean,
//             default: false
//         }
//     },
//     accessLevel: {
//         fullAccess: {
//             type: Boolean,
//             default: false
//         },
//         limitedAccess: {
//             type: Boolean,
//             default: false
//         },
//         viewOnly: {
//             type: Boolean,
//             default: false
//         }
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     },
//     profileImage: [],
// });



// const User = mongoose.model('User', userSchema);

// module.exports = User;



const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        default: "user",
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    assign:{
        type:String,
        required:true
    },
    permissions: {
        dashboardAccess: { type: Boolean, default: false },
        clientManagement: { type: Boolean, default: false },
        projectManagement: { type: Boolean, default: false },
        designTools: { type: Boolean, default: false },
        financialManagement: { type: Boolean, default: false },
        userManagement: { type: Boolean, default: false },
        reportGeneration: { type: Boolean, default: false },
        systemSettings: { type: Boolean, default: false }
    },
    accessLevel: {
        fullAccess: { type: Boolean, default: false },
        limitedAccess: { type: Boolean, default: false },
        viewOnly: { type: Boolean, default: false }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profileImage: [],
    googleSignIn: {
        type: Boolean,
        default: false
    },
    resetToken: String,
    resetTokenExpiry: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add method to generate and hash password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
