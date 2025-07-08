const express=require('express');
const { TimesheetWorklogCreate, getAllTimesheetWorklogs, deleteTimesheetWorklog, UpdateTimesheetWorklog } = require('../../Controller/Admin/TimesheetWorklogController');


const router = express.Router()

router.post('/',TimesheetWorklogCreate)

router.get('/',getAllTimesheetWorklogs)

router.delete('/:id',deleteTimesheetWorklog)

router.patch('/:id',UpdateTimesheetWorklog)



 module.exports = router 
