const express = require('express');
const { 
  createComment, 
  getAllComments, 
  getCommentById, 
  getCommentsByDailyLog, 
  updateComment, 
  deleteComment 
} = require('../../Controller/Admin/CommentsController');
const { protect } = require('../../middlewares/authMiddlewares');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Create comment
router.post('/', createComment);

// Get all comments
router.get('/', getAllComments);

// Get comment by ID
router.get('/:id', getCommentById);

// Get comments by daily log ID
router.get('/dailylog/:dailylog_id', getCommentsByDailyLog);

// Update comment
router.put('/:id', updateComment);

// Delete comment
router.delete('/:id', deleteComment);

module.exports = router;