const asyncHandler = require('express-async-handler');
const TimeLogss = require('../../Model/Admin/TimeLogsModel');
const Projects = require("../../Model/Admin/ProjectsModel");
const Jobs = require('../../Model/Admin/JobsModel');
const cloudinary = require('../../Config/cloudinary');
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const TimeLogsCreate = asyncHandler(async (req, res) => {
  const {
    projectsId,
    jobId,
    date,
    extraHours,
    hours,
    taskNotes,
  } = req.body;

  try {
    // Validate project IDs
    if (!Array.isArray(projectsId) || projectsId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
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

    // Check if all projects exist
    const projects = await Projects.find({ '_id': { $in: projectsId } });
    if (projects.length !== projectsId.length) {
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

    // Create the new TimeLog
    const newTimeLogs = new TimeLogss({
      projectId: projectsId,
      jobId: jobId[0],
      date,
      extraHours,
      hours,
      taskNotes,
    });

    await newTimeLogs.save();

    const TimeLogsData = newTimeLogs.toObject();
    res.status(201).json({
      success: true,
      message: "TimeLog created successfully",
      TimeLogs: TimeLogsData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the TimeLog",
      error: error.message,
    });
  }
});




//GET SINGLE AllTimeLogs
//METHOD:GET
const AllTimeLogs = async (req, res) => {
  try {
    const allTimeLogss = await TimeLogss.find()
      .populate({
        path: 'projectId',
        select: '_id projectName',
        model: 'Projects',
      })
      .populate({
        path: 'jobId',
        select: '_id jobName',
        model: 'Jobs',
      });

    if (!allTimeLogss || allTimeLogss.length === 0) {
      return res.status(404).json({ success: false, message: "No TimeLogss found" });
    }

    const TimeLogssWithDetails = allTimeLogss.map(TimeLogs => {
      const TimeLogsObj = TimeLogs.toObject();

      return {
        ...TimeLogsObj,
        projects: Array.isArray(TimeLogs.projectId)
          ? TimeLogs.projectId.map(project => ({
            projectId: project?._id,
            projectName: project?.projectName,
          }))
          : [],
        jobs: Array.isArray(TimeLogs.jobId)
          ? TimeLogs.jobId.map(job => ({
            jobId: job?._id,
            jobName: job?.jobName,
          }))
          : [],
      };
    });

    res.status(200).json({
      success: true,
      TimeLogss: TimeLogssWithDetails,
    });

  } catch (error) {
    console.error("Error fetching TimeLogss:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching TimeLogss",
      error: error.message,
    });
  }
};




// //GET SINGLE DeleteProjects
// //METHOD:DELETE
const deleteTimeLogs = async (req, res) => {
  let deleteTimeLogsID = req.params.id
  if (deleteTimeLogs) {
    const deleteTimeLogs = await TimeLogss.findByIdAndDelete(deleteTimeLogsID, req.body);
    res.status(200).json("Delete TimeLogs Successfully")
  } else {
    res.status(400).json({ message: "Not Delete project" })
  }
}


// //GET SINGLE ProjectsUpdate
// //METHOD:PUT
const UpdateTimeLogs = async (req, res) => {
  try {
    const allowedFields = [
      'projectsId',
      'jobId',
      'date',
      'extraHours',
      'hours',
      'taskNotes',
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
    const updatedDiary = await TimeLogss.findOneAndUpdate(
      { jobId: req.body.jobId },
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



//GET SINGLE 	Extra Hours
//METHOD:PUT
const UpdateExtraHours = async (req, res) => {
  try {
    const { id, extraHours } = req.body;

    if (!Array.isArray(id) || id.length === 0) {
      return res.status(400).json({ message: 'ID array is required and must not be empty' });
    }

    if (extraHours === undefined) {
      return res.status(400).json({ message: 'extraHours value is required' });
    }

    // Validate ObjectIds
    const validIds = id.filter(mongoose.Types.ObjectId.isValid);
    if (validIds.length === 0) {
      return res.status(400).json({ message: 'No valid ObjectIds provided' });
    }

    // Properly convert to ObjectId with 'new'
    const objectIds = validIds.map(_id => new mongoose.Types.ObjectId(_id));

    // Update all matching TimeLogs
    const updatedResult = await TimeLogss.updateMany(
      { _id: { $in: objectIds } },
      { $set: { extraHours } }
    );

    res.status(200).json({
      message: 'extraHours updated successfully',
      matchedCount: updatedResult.matchedCount,
      modifiedCount: updatedResult.modifiedCount
    });
  } catch (error) {
    console.error("UpdateExtraHours Error:", error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// //METHOD:Single
// //TYPE:PUBLIC
// const SingleTimeLogs = async (req, res) => {
//   try {
//     const SingleTimeLogs = await TimeLogss.findById(req.params.id);
//     res.status(200).json(SingleTimeLogs)
//   } catch (error) {
//     res.status(404).json({ msg: "Can t Find Diaries" })
//   }
// }


module.exports = { TimeLogsCreate, AllTimeLogs, UpdateTimeLogs, deleteTimeLogs,UpdateExtraHours };