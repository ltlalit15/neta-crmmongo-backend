const asyncHandler = require('express-async-handler');
const DailyLog = require("../../Model/Admin/DailyLogSchema");
const cloudinary = require("../../Config/cloudinary");
const Jobs = require('../../Model/Admin/JobsModel');
const mongoose = require('mongoose');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

// CREATE
const createDailyLog = asyncHandler(async (req, res) => {
  const { job_id, date, title, notes } = req.body;

  // 🔒 Validate ObjectId format before using it
  if (!mongoose.Types.ObjectId.isValid(job_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid job_id. Must be a 24-character MongoDB ObjectId."
    });
  }

  // ✅ Check if job exists
  const jobExists = await Jobs.findById(job_id);
  if (!jobExists) {
    return res.status(404).json({ 
      success: false, 
      message: "Job not found with the provided jobId." 
    });
  }

  let imageUrls = [];

  if (req.files && req.files.images) {
    let files = req.files.images;
    if (!Array.isArray(files)) files = [files];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'audit_reports',
        resource_type: 'image'
      });
      imageUrls.push(result.secure_url);
    }
  }

  const newLog = await DailyLog.create({
    job_id,
    date,
    title,
    notes,
    images: imageUrls
  });

  res.status(201).json({ 
    success: true, 
    message: "Log created", 
    data: newLog 
  });
});

// GET ALL
const getAllDailyLogs = asyncHandler(async (req, res) => {
  const logs = await DailyLog.find()
    .populate('jobId', 'title description') // Populate job details
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: logs });
});

// GET LOGS BY JOB ID
const getDailyLogsByJobId = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid jobId format." 
    });
  }

  const logs = await DailyLog.find({ jobId })
    .populate('jobId', 'title description')
    .sort({ createdAt: -1 });
    
  res.status(200).json({ success: true, data: logs });
});


// GET SINGLE
const getDailyLogById = asyncHandler(async (req, res) => {
  const log = await DailyLog.findById(req.params.id).populate('jobId', 'title description');
  if (!log) return res.status(404).json({ message: "Log not found" });
  res.status(200).json(log);
});

// UPDATE
const updateDailyLog = asyncHandler(async (req, res) => {
  const { jobId, date, title, notes } = req.body;

  const updateData = {};
  if (jobId) updateData.jobId = jobId;
  if (date) updateData.date = date;
  if (title) updateData.title = title;
  if (notes) updateData.notes = notes;

  let imageUrls = [];

  if (req.files && req.files.images) {
    let files = req.files.images;
    if (!Array.isArray(files)) files = [files];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'audit_reports',
        resource_type: 'image'
      });
      imageUrls.push(result.secure_url);
    }
    updateData.images = imageUrls;
  }

  const updated = await DailyLog.findByIdAndUpdate(req.params.id, updateData, { new: true });

  if (!updated) return res.status(404).json({ message: "Log not found" });

  res.status(200).json({ success: true, message: "Log updated", data: updated });
});

// DELETE
const deleteDailyLog = asyncHandler(async (req, res) => {
  const deleted = await DailyLog.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Log not found" });

  res.status(200).json({ success: true, message: "Log deleted successfully" });
});

module.exports = {
  createDailyLog,
  getAllDailyLogs,
  getDailyLogsByJobId,
  getDailyLogById,
  updateDailyLog,
  deleteDailyLog
};
