const asyncHandler = require("express-async-handler");
const Projects = require("../../Model/Admin/ProjectsModel");
const ClientManagement = require("../../Model/Admin/ClientManagementModel"); // Make sure the path is correct
const {generateProjectNo} = require('../../middlewares/generateEstimateRef');

const cloudinary = require('../../Config/cloudinary');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const createProjects = asyncHandler(async (req, res) => {
  const {
    projectName,
    clientId,
    // managerId,
    startDate,
    endDate,
    projectPriority,
    description,   
    status,
    projectRequirements,
    budgetAmount,
    currency,
    tempPoles,
    projectAddress,
  } = req.body;

  try {
    // ✅ Validate Client ID
    const existingClient = await ClientManagement.findById(clientId);
    if (!existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Invalid clientId. No such client exists.',
      });
    }

     const projectNo = await generateProjectNo();
    
    // Optionally validate managerId similarly if needed
    const newAssignment = new Projects({
      projectNo,
      projectName,
      clientId,
      // managerId,
      startDate,
      endDate,
      projectPriority,
      description,
      status,
      projectRequirements,
      budgetAmount,
      currency,
      tempPoles,
      projectAddress,
    });

    const savedAssignment = await newAssignment.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: savedAssignment.toJSON(),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    });
  }
}
)



 //GET SINGLE AllProjects
  //METHOD:GET
const getAllProjects = async (req, res) => {
  try {
    const allProjects = await Projects.find()
      .populate({
        path: 'clientId',
        select: 'clientName', // Only fetch the clientName field
      });

    const projectsWithVirtuals = allProjects.map(project =>
      project.toObject({ virtuals: true })
    );

    res.status(200).json({
      success: true,
      data: projectsWithVirtuals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

//GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteProjects = async (req, res) => {
    let deleteProjectsID = req.params.id
    if (deleteProjects) {
      const deleteProjects = await Projects.findByIdAndDelete(deleteProjectsID, req.body);
      res.status(200).json("Delete Checklists Successfully")
    } else {
      res.status(400).json({ message: "Not Delete project" })
    }
  }

 //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateProject = async (req, res) => {
    try {
      const allowedFields = [
        'projectName',
        'clientId',
        // 'managerId',
        'startDate',
        'endDate',
        'projectPriority',
        'description',
        'status',
        'projectRequirements',
        'budgetAmount',
        'currency',
        'tempPoles',
        'projectAddress',
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
      const updatedDiary = await Projects.findByIdAndUpdate(
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
  const SingleProjects=async(req,res)=>{
    try {
        const SingleProjects= await Projects.findById(req.params.id);
        res.status(200).json(SingleProjects)
    } catch (error) {
        res.status(404).json({msg:"Can t Find Diaries"} )
    }
}


module.exports = {createProjects,getAllProjects,UpdateProject,deleteProjects,SingleProjects};





