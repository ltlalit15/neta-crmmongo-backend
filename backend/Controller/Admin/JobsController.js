const asyncHandler = require('express-async-handler');
const Jobs = require('../../Model/Admin/JobsModel');
const Projects = require("../../Model/Admin/ProjectsModel");
const Assignment = require("../../Model/Admin/AssignmentJobControllerModel");
const cloudinary = require('../../Config/cloudinary');
const mongoose = require("mongoose")
const { generateJobsNo } = require('../../middlewares/generateEstimateRef');

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
    packCode,
    priority,
    Status,
    assign,
    // totalTime,
    barcode
  } = req.body;

  try {
    // Validate each projectId
    if (!Array.isArray(projectsId) || projectsId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID format. Ensure all IDs are valid."
      });
    }
    // Check if all projects exist
    const projects = await Projects.find({ '_id': { $in: projectsId } });
    if (projects.length !== projectsId.length) {
      return res.status(404).json({
        success: false,
        message: "One or more projects not found"
      });
    }
    const JobNo = await generateJobsNo();
    // Create the new Job
    const newJob = new Jobs({
      projectId: projectsId,
      JobNo,
      brandName,
      subBrand,
      flavour,
      packType,
      packCode,
      packSize,
      priority,
      Status,
      assign,
      // totalTime,
      barcode
    });

    await newJob.save();
    const jobData = newJob.toObject();
    jobData.projectId = jobData.projectId;
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

// const AllJobID = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid projectId",
//       });
//     }

//     const allJobs = await Jobs.find({ projectId })
//       .populate({
//         path: 'projectId',
//         select: '_id projectName',
//         model: 'Projects',
//       });

//     const jobsWithDetails = allJobs.map(job => ({
//       ...job.toObject(),
//       projects: job.projectId
//         ? {
//           projectId: job.projectId._id,
//           projectName: job.projectId.projectName,
//         }
//         : {},
//     }));

//     res.status(200).json({
//       success: true,
//       jobs: jobsWithDetails,
//     });
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching jobs",
//       error: error.message,
//     });
//   }
// };


const AllJobID = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid projectId",
      });
    }

    const allJobs = await Jobs.find({ projectId })
      .populate({
        path: 'projectId',
        select: '_id projectName',
        model: 'Projects',
      });

    // Now for each job, check assignment
    const jobsWithDetails = await Promise.all(allJobs.map(async (job) => {
      // Find assignment for this job
      const assignment = await Assignment.findOne({ jobId: job._id })
        .populate({
          path: 'employeeId',
          select: 'firstName lastName',
        });

      // Prepare assigned name
      let assignedTo = "Not Assigned";
      if (assignment && assignment.employeeId) {
        assignedTo = `${assignment.employeeId.firstName} ${assignment.employeeId.lastName}`;
      }

      return {
        ...job.toObject(),
        projects: job.projectId
          ? {
              projectId: job.projectId._id,
              projectName: job.projectId.projectName,
            }
          : {},
        assignedTo,   // 👈 Add assignedTo field
      };
    }));

    res.status(200).json({
      success: true,
      jobs: jobsWithDetails,
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



//GET SINGLE AllProjects
//METHOD:GET
// GET All Jobs with project and client info
const AllJob = async (req, res) => {
  try {
    const allJobs = await Jobs.find().populate({
      path: 'projectId',
      select: '_id projectName',
      model: 'Projects'
    });

    if (!allJobs || allJobs.length === 0) {
      return res.status(404).json({ success: false, message: "No jobs found" });
    }

    const jobsWithDetails = await Promise.all(allJobs.map(async (job) => {
      const jobObj = job.toObject();

      // Check assignment for this job
      const assignment = await Assignment.findOne({ jobId: job._id })
        .populate({
          path: 'employeeId',
          select: 'firstName lastName',
        });

      // Prepare assignedTo name
      let assignedTo = "Not Assigned";
      if (assignment && assignment.employeeId) {
        assignedTo = `${assignment.employeeId.firstName} ${assignment.employeeId.lastName}`;
      }

      return {
        ...jobObj,
        projects: Array.isArray(job.projectId)
          ? job.projectId.map(project => ({
              projectId: project?._id,
              projectName: project?.projectName
            }))
          : (job.projectId ? {
              projectId: job.projectId._id,
              projectName: job.projectId.projectName
            } : {}),
        assignedTo  // 👈 add assignedTo here
      };
    }));

    res.status(200).json({
      success: true,
      jobs: jobsWithDetails,
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




//GET SINGLE AllProjects
//METHOD:GET
// GET All Jobs with project and client info
const filter = async (req, res) => {
  try {
    const { Status } = req.params;

    const allJobs = await Jobs.find({ Status: Status }).populate({
      path: 'projectId',
      select: '_id projectName',
      model: 'Projects'
    });

    if (!allJobs || allJobs.length === 0) {
      return res.status(404).json({ success: false, message: "No jobs found" });
    }

    const jobsWithDetails = await Promise.all(allJobs.map(async (job) => {
      const jobObj = job.toObject();

      // Check assignment for this job
      const assignment = await Assignment.findOne({ jobId: job._id })
        .populate({
          path: 'employeeId',
          select: 'firstName lastName',
        });

      // Prepare assignedTo name
      let assignedTo = "Not Assigned";
      if (assignment && assignment.employeeId) {
        assignedTo = `${assignment.employeeId.firstName} ${assignment.employeeId.lastName}`;
      }

      return {
        ...jobObj,
        projects: Array.isArray(job.projectId)
          ? job.projectId.map(project => ({
              projectId: project?._id,
              projectName: project?.projectName
            }))
          : (job.projectId ? {
              projectId: job.projectId._id,
              projectName: job.projectId.projectName
            } : {}),
        assignedTo  // 👈 add assignedTo here
      };
    }));

    res.status(200).json({
      success: true,
      jobs: jobsWithDetails,
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
    const jobId = req.params.id; // ✅ ID from URL

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }
    const allowedFields = [
      'projects',
      'projectName',
      'brandName',
      'subBrand',
      'flavour',
      'packType',
      'packCode',
      'packSize',
      'priority',
      'Status',
      'assign',
      // 'totalTime',
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
    const updatedJob = await Jobs.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


//GET SINGLE ProjectsUpdate
//METHOD:PUT
const UpdateJobAssign = async (req, res) => {
  try {
    const allowedFields = [
      'projects',
      'projectName',
      'brandName',
      'subBrand',
      'flavour',
      'packType',
      "packCode",
      'packSize',
      'priority',
      'Status',
      'assign',
      // 'totalTime',
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (!Array.isArray(req.body.id) || req.body.id.length === 0) {
      return res.status(400).json({ message: 'ID array is required and must not be empty' });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'At least one field must be provided for update' });
    }

    const updatedResult = await Jobs.updateMany(
      { _id: { $in: req.body.id } },
      { $set: updateData }
    );

    res.status(200).json({
      message: 'Jobs updated successfully',
      matchedCount: updatedResult.matchedCount,
      modifiedCount: updatedResult.modifiedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//METHOD:Single
//TYPE:PUBLIC
const SingleJob = async (req, res) => {
  try {
    const SingleJob = await Jobs.findById(req.params.id);
    res.status(200).json(SingleJob)
  } catch (error) {
    res.status(404).json({ msg: "Can t Find Diaries" })
  }
}


module.exports = { jobCreate, AllJob, deleteJob, UpdateJob, SingleJob, UpdateJobAssign, AllJobID, filter };