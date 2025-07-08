const express = require('express');
const router = express.Router();
const { 
   
  getAllDailyLogs, 
  getDailyLogById, 
  updateDailyLog, 
  deleteDailyLog, 
  createDailyLog,
  getDailyLogsByJobId
} = require('../../Controller/Admin/DailyLogController');

// Create new daily log
router.post('/', createDailyLog);

// Get all daily logs
router.get('/', getAllDailyLogs);

// Get daily logs by job ID
router.get('/job/:job_id', getDailyLogsByJobId);

// Get single daily log by ID
router.get('/:id', getDailyLogById);

// Update daily log by ID
router.put('/:id', updateDailyLog);

// Delete daily log by ID
router.delete('/:id', deleteDailyLog);

module.exports = router; 
