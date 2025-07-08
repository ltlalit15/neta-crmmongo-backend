const asyncHandler = require('express-async-handler');
const Comment = require('../../Model/Admin/CommentsModle');
const DailyLog = require("../../Model/Admin/DailyLogSchema");
const User = require('../../Model/userModel');

// ➕ Create a comment
const createComment = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body);

  const { dailylog_id, comment } = req.body;
  const user_id = req.user._id;

  if (!dailylog_id || !comment) {
    return res.status(400).json({ 
      success: false, 
      message: "Daily log ID and comment are required." 
    });
  }

  // Validate if daily log exists
  const dailyLog = await DailyLog.findById(dailylog_id);
  if (!dailyLog) {
    return res.status(404).json({ 
      success: false, 
      message: "Daily log not found" 
    });
  }

  const newComment = await Comment.create({ 
    user_id, 
    dailylog_id, 
    comment 
  });

  // Populate user data
  await newComment.populate('user_id', 'firstName lastName email');

  res.status(201).json({ 
    success: true, 
    message: "Comment created successfully", 
    data: newComment 
  });
});

// 📥 Get all comments with user and daily log data
const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find()
    .populate('user_id', 'firstName lastName email')
    .populate('dailylog_id', 'title description')
    .sort({ createdAt: -1 });

  res.status(200).json({ 
    success: true, 
    message: "Comments fetched successfully", 
    data: comments 
  });
});

// 📌 Get comment by ID with populated data
const getCommentById = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)
    .populate('user_id', 'firstName lastName email')
    .populate('dailylog_id', 'title description');

  if (!comment) {
    return res.status(404).json({ 
      success: false, 
      message: "Comment not found" 
    });
  }

  res.status(200).json({ 
    success: true, 
    message: "Comment fetched successfully", 
    data: comment 
  });
});

// 🔎 Get comments by DailyLog ID with basic log info
const getCommentsByDailyLog = asyncHandler(async (req, res) => {
  const { dailylog_id } = req.params;

  // Validate if daily log exists
  const dailyLog = await DailyLog.findById(dailylog_id);
  if (!dailyLog) {
    return res.status(404).json({ 
      success: false, 
      message: "Daily log not found" 
    });
  }

  const comments = await Comment.find({ dailylog_id })
    .populate('user_id', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Comments with daily log fetched successfully",
    data: {
      daily_log: {
        dailylog_id,
        title: dailyLog.title || '',
        description: dailyLog.description || '',
        created_at: dailyLog.createdAt || '',
      },
      comments
    }
  });
});

// ✏️ Update comment
const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user_id = req.user._id;

  if (!comment) {
    return res.status(400).json({ 
      success: false, 
      message: "Comment text is required" 
    });
  }

  // Find comment and check if user owns it
  const existingComment = await Comment.findById(id);
  if (!existingComment) {
    return res.status(404).json({ 
      success: false, 
      message: "Comment not found" 
    });
  }

  // Check if user owns the comment or is admin
  if (existingComment.user_id.toString() !== user_id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: "Not authorized to update this comment" 
    });
  }

  const updated = await Comment.findByIdAndUpdate(
    id, 
    { comment }, 
    { new: true }
  ).populate('user_id', 'firstName lastName email');

  res.status(200).json({ 
    success: true, 
    message: "Comment updated successfully", 
    data: updated 
  });
});

// ❌ Delete comment
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  // Find comment and check if user owns it
  const existingComment = await Comment.findById(id);
  if (!existingComment) {
    return res.status(404).json({ 
      success: false, 
      message: "Comment not found" 
    });
  }

  // Check if user owns the comment or is admin
  if (existingComment.user_id.toString() !== user_id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: "Not authorized to delete this comment" 
    });
  }

  const deleted = await Comment.findByIdAndDelete(id);
  res.status(200).json({ 
    success: true, 
    message: "Comment deleted successfully" 
  });
});

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  getCommentsByDailyLog,
  updateComment,
  deleteComment
};

