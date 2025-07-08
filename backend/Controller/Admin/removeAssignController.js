const asyncHandler = require('express-async-handler');
const Assignment = require("../../Model/Admin/AssignmentJobControllerModel");
const Jobs = require('../../Model/Admin/JobsModel');
const User = require('../../Model/userModel');
const mongoose = require("mongoose");

const RemoveAssignedJob = asyncHandler(async (req, res) => {
  const { employeeId, jobId } = req.body;

  const employeeIdValue = Array.isArray(employeeId) ? employeeId[0] : employeeId;

  if (!mongoose.Types.ObjectId.isValid(employeeIdValue)) {
    return res.status(400).json({ success: false, message: 'Invalid employee ID' });
  }

  const user = await User.findById(employeeIdValue);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }

  if (!Array.isArray(jobId) || jobId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid job ID format. Ensure array of valid IDs.'
    });
  }

  const assignment = await Assignment.findOne({ employeeId: employeeIdValue });
  if (!assignment) {
    return res.status(404).json({ success: false, message: 'No assignment found for this employee' });
  }

  const beforeCount = assignment.jobId.length;
  assignment.jobId = assignment.jobId.filter(
    id => !jobId.includes(id.toString())
  );

  if (assignment.jobId.length === beforeCount) {
    return res.status(400).json({
      success: false,
      message: 'No matching jobId(s) found in this assignment'
    });
  }

  await assignment.save();
  res.status(200).json({
    success: true,
    message: 'Job(s) removed successfully',
    assignment
  });
});


module.exports = {  RemoveAssignedJob };