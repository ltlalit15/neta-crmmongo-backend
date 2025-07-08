// const asyncHandler = require('express-async-handler');
// const Assignment = require("../../Model/Admin/AssignmentJobControllerModel");
// const Jobs = require('../../Model/Admin/JobsModel');
// const User = require('../../Model/userModel');
// const mongoose = require("mongoose");

// const AssignmentCreate = asyncHandler(async (req, res) => {
//     const {
//         employeeId,     
//         jobId,         
//         selectDesigner,
//         description
//     } = req.body;

//     if (!Array.isArray(jobId) || jobId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid job ID format. Ensure all IDs are valid."
//         });
//     }

//     if (!Array.isArray(employeeId) || employeeId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid employee ID format. Ensure all IDs are valid."
//         });
//     }

//     const jobs = await Jobs.find({ _id: { $in: jobId } });
//     if (jobs.length !== jobId.length) {
//         return res.status(404).json({
//             success: false,
//             message: "One or more jobs not found"
//         });
//     }

//     const users = await User.find({ _id: { $in: employeeId } });
//     if (users.length !== employeeId.length) {
//         return res.status(404).json({
//             success: false,
//             message: "One or more employees not found"
//         });
//     }

//     const newAssignment = new Assignment({
//         employeeId,
//         jobId,
//         selectDesigner,
//         description,
//     });
//     await newAssignment.save();
//     res.status(201).json({
//         success: true,
//         message: "Assignment created successfully",
//         assignment: newAssignment,
//     });
// });


// const AssignmentCreate = asyncHandler(async (req, res) => {
//     const {
//         employeeId,     
//         jobId,         
//         selectDesigner,
//         description
//     } = req.body;

//     if (!Array.isArray(jobId) || jobId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid job ID format. Ensure all IDs are valid."
//         });
//     }

//     if (!Array.isArray(employeeId) || employeeId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid employee ID format. Ensure all IDs are valid."
//         });
//     }

//     const jobs = await Jobs.find({ _id: { $in: jobId } });
//     if (jobs.length !== jobId.length) {
//         return res.status(404).json({
//             success: false,
//             message: "One or more jobs not found"
//         });
//     }

//     const users = await User.find({ _id: { $in: employeeId } });
//     if (users.length !== employeeId.length) {
//         return res.status(404).json({
//             success: false,
//             message: "One or more employees not found"
//         });
//     }

//     // Find existing assignment for the given employeeId
//     const existingAssignment = await Assignment.findOne({
//         employeeId: { $in: employeeId },  // Checks if employeeId already exists
//         jobId: { $in: jobId }  // Checks if jobId is already assigned to the employee
//     });

//     if (existingAssignment) {
//         // If both employeeId and jobId exist in the database
//         return res.status(200).json({
//             success: false,
//             message: "Job already assigned to this employee."
//         });
//     } else {
//         // If assignment exists for the employee, but jobId is not present, add jobId
//         const existingAssignmentForEmployee = await Assignment.findOne({
//             employeeId: { $in: employeeId }
//         });

//         if (existingAssignmentForEmployee) {
//             // Push the new jobId to the existing record
//             const newJobIds = [...new Set([...existingAssignmentForEmployee.jobId, ...jobId])]; // Remove duplicates
//             existingAssignmentForEmployee.jobId = newJobIds;
//             existingAssignmentForEmployee.selectDesigner = selectDesigner;
//             existingAssignmentForEmployee.description = description;

//             await existingAssignmentForEmployee.save();

//             return res.status(200).json({
//                 success: true,
//                 message: "Job added to existing employee assignment",
//                 assignment: existingAssignmentForEmployee,
//             });
//         } else {
//             // If no existing record for the employee, create a new assignment
//             const newAssignment = new Assignment({
//                 employeeId,
//                 jobId,
//                 selectDesigner,
//                 description,
//             });

//             await newAssignment.save();

//             return res.status(201).json({
//                 success: true,
//                 message: "Assignment created successfully",
//                 assignment: newAssignment,
//             });
//         }
//     }
// });

// const AssignmentCreate = asyncHandler(async (req, res) => {
//     const {
//         employeeId,     
//         jobId,         
//         selectDesigner,
//         description
//     } = req.body;

//     if (!Array.isArray(jobId) || jobId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid job ID format. Ensure all IDs are valid."
//         });
//     }

//     if (!Array.isArray(employeeId) || employeeId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid employee ID format. Ensure all IDs are valid."
//         });
//     }

//     const jobs = await Jobs.find({ _id: { $in: jobId } });
//     if (jobs.length !== jobId.length) {
//         return res.status(404).json({
//             success: false,
//             message: "One or more jobs not found"
//         });
//     }

//     const users = await User.find({ _id: { $in: employeeId } });
//     if (users.length !== employeeId.length) {
//         return res.status(404).json({
//             success: false,
//             message: "One or more employees not found"
//         });
//     }

//     // Check if the jobId is already assigned to any employee
//     const existingJobAssignment = await Assignment.findOne({
//         jobId: { $in: jobId }  // Check if jobId is already assigned
//     });

//     if (existingJobAssignment) {
//         // If the jobId is assigned to another employee, return a message
//         return res.status(400).json({
//             success: false,
//             message: "Job already assigned to another employee."
//         });
//     } else {
//         // Find existing assignment for the given employeeId
//         const existingAssignment = await Assignment.findOne({
//             employeeId: { $in: employeeId }  // Checks if employeeId already exists
//         });

//         if (existingAssignment) {
//             // Check if the jobId already exists in the assignment
//             const existingJobIds = existingAssignment.jobId || [];

//             // If the jobId is not already present, push it to the jobId array
//             const newJobIds = [...new Set([...existingJobIds, ...jobId])]; // Remove duplicates
//             if (existingJobIds.length !== newJobIds.length) {
//                 existingAssignment.jobId = newJobIds;
//                 existingAssignment.selectDesigner = selectDesigner;
//                 existingAssignment.description = description;

//                 await existingAssignment.save();

//                 return res.status(200).json({
//                     success: true,
//                     message: "Job added to existing employee assignment",
//                     assignment: existingAssignment,
//                 });
//             } else {
//                 return res.status(400).json({
//                     success: false,
//                     message: "The jobId already exists for this employee."
//                 });
//             }
//         } else {
//             // If no assignment exists for the employeeId, create a new assignment
//             const newAssignment = new Assignment({
//                 employeeId,
//                 jobId,
//                 selectDesigner,
//                 description,
//             });

//             await newAssignment.save();

//             return res.status(201).json({
//                 success: true,
//                 message: "Assignment created successfully",
//                 assignment: newAssignment,
//             });
//         }
//     }
// });


const asyncHandler = require('express-async-handler');
const Assignment = require("../../Model/Admin/AssignmentJobControllerModel");
const Jobs = require('../../Model/Admin/JobsModel');
const User = require('../../Model/userModel');
const mongoose = require("mongoose");

const AssignmentCreate = asyncHandler(async (req, res) => {
    const {
        employeeId,     
        jobId,         
        selectDesigner,
        description
    } = req.body;

    if (!Array.isArray(jobId) || jobId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({
            success: false,
            message: "Invalid job ID format. Ensure all IDs are valid."
        });
    }

    if (!Array.isArray(employeeId) || employeeId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID format. Ensure all IDs are valid."
        });
    }

    const jobs = await Jobs.find({ _id: { $in: jobId } });
    if (jobs.length !== jobId.length) {
        return res.status(404).json({
            success: false,
            message: "One or more jobs not found"
        });
    }

    const users = await User.find({ _id: { $in: employeeId } });
    if (users.length !== employeeId.length) {
        return res.status(404).json({
            success: false,
            message: "One or more employees not found"
        });
    }

    // Check if the jobId is already assigned to any employee
    const existingJobAssignment = await Assignment.findOne({
        jobId: { $in: jobId }  // Check if jobId is already assigned
    }).populate('employeeId');  // Populate employee details

    if (existingJobAssignment) {
        // If the jobId is assigned to another employee, get the assigned employee's name
        const assignedEmployee = existingJobAssignment.employeeId;  // This should have the employee details after population
        const employeeName = assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : "Unknown Employee";

        // Return message with employee details
        return res.status(200).json({
            success: false,
            message: `Job already assigned : ${employeeName}.`
        });
    } else {
        // Find existing assignment for the given employeeId
        const existingAssignment = await Assignment.findOne({
            employeeId: { $in: employeeId }  // Checks if employeeId already exists
        });

        if (existingAssignment) {
            // Check if the jobId already exists in the assignment
            const existingJobIds = existingAssignment.jobId || [];

            // If the jobId is not already present, push it to the jobId array
            const newJobIds = [...new Set([...existingJobIds, ...jobId])]; // Remove duplicates
            if (existingJobIds.length !== newJobIds.length) {
                existingAssignment.jobId = newJobIds;
                existingAssignment.selectDesigner = selectDesigner;
                existingAssignment.description = description;

                await existingAssignment.save();

                return res.status(200).json({
                    success: true,
                    message: "Job added to existing employee assignment",
                    assignment: existingAssignment,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "The jobId already exists for this employee."
                });
            }
        } else {
            // If no assignment exists for the employeeId, create a new assignment
            const newAssignment = new Assignment({
                employeeId,
                jobId,
                selectDesigner,
                description,
            });

            await newAssignment.save();

            return res.status(201).json({
                success: true,
                message: "Assignment created successfully",
                assignment: newAssignment,
            });
        }
    }
});




//GET SINGLE ProjectsUpdate
//METHOD:PUT
// GET /api/assignments/by-employee/:employeeId
const AllAssignJobID = asyncHandler(async (req, res) => {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const assignments = await Assignment.find({ employeeId: employeeId })
        .populate('employeeId') // populate employee details
        .populate({
            path: 'jobId',
            populate: {
                path: 'projectId', // assuming Job has a field called projectId
                select: 'projectName' // only return projectName
            }
        });

    if (!assignments || assignments.length === 0) {
        return res.status(404).json({ message: 'No assignments found for this employee' });
    }

    res.status(200).json({
        success: true,
        count: assignments.length,
        assignments,
    });
});



// const AllAssignJobID = asyncHandler(async (req, res) => {
//     const { employeeId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(employeeId)) {
//         return res.status(400).json({ message: 'Invalid employee ID' });
//     }

//     const assignments = await Assignment.find({ employeeId: employeeId })
//         .populate({
//             path: 'employeeId',
//             select: 'firstName lastName email phone' 
//         })
//         .populate({
//             path: 'jobId', 
//             select: 'JobNo brandName subBrand flavour packType priority Status barcode',
//             populate: {
//                 path: 'projectId', 
//                 select: 'projectName' 
//             }
//         });

//     if (!assignments || assignments.length === 0) {
//         return res.status(404).json({ message: 'No assignments found for this employee' });
//     }

//     res.status(200).json({
//         success: true,
//         count: assignments.length,
//         assignments,
//     });
// });


const AllAssignJob = asyncHandler(async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate('employeeId') // populate user details
            .populate('jobId');     // populate job details

        if (!assignments || assignments.length === 0) {
            return res.status(404).json({ message: 'No assignments found' });
        }

        res.status(200).json({
            success: true,
            count: assignments.length,
            assignments,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = { AssignmentCreate, AllAssignJobID,AllAssignJob };
