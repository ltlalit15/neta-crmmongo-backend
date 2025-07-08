const asyncHandler = require('express-async-handler');
const CostEstimates = require('../../Model/Admin/CostEstimatesModel');
const Projects = require("../../Model/Admin/ProjectsModel");
const ClientManagement = require("../../Model/Admin/ClientManagementModel");
const cloudinary = require('../../Config/cloudinary');
const { generateEstimateNo } = require('../../middlewares/generateEstimateRef');
const mongoose = require("mongoose");
const ReceivablePurchase = require('../../Model/Admin/ReceivablePurchaseModel');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});
const costEstimatesCreate = asyncHandler(async (req, res) => {
  const {
    projectId,
    clientId,
    estimateDate,
    validUntil,
    currency,
    lineItems,
    VATRate,
    Notes,
    POStatus,
    Status
  } = req.body;

  try {
    if (!Array.isArray(projectId) || projectId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ success: false, message: "Invalid Project ID format." });
    }

    if (!Array.isArray(clientId) || clientId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ success: false, message: "Invalid Client ID format." });
    }

    const projects = await Projects.find({ '_id': { $in: projectId } });
    if (projects.length !== projectId.length) {
      return res.status(404).json({ success: false, message: "One or more projects not found" });
    }

    const clients = await ClientManagement.find({ '_id': { $in: clientId } });
    if (clients.length !== clientId.length) {
      return res.status(404).json({ success: false, message: "One or more clients not found" });
    }

    const estimateRef = await generateEstimateNo();

    const newCostEstimate = new CostEstimates({
      estimateRef,
      projectId: projectId,
      clientId, // already an array
      estimateDate,
      validUntil,
      currency,
      lineItems,
      VATRate,
      Notes,
      POStatus,
      Status
    });

    await newCostEstimate.save();

    res.status(201).json({
      success: true,
      message: "Cost Estimate created successfully",
      costEstimate: newCostEstimate,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the Cost Estimate",
      error: error.message,
    });
  }
});



// GET All Cost Estimates with project and client info
const AllCostEstimates = async (req, res) => {
  try {
    const allCostEstimates = await CostEstimates.aggregate([
      // 1) Join Projects
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'projects'
        }
      },
      // 2) Join Clients
      {
        $lookup: {
          from: 'clientmanagements',
          localField: 'clientId',
          foreignField: '_id',
          as: 'clients'
        }
      },
      // 3) Join ReceivablePurchases
      {
        $lookup: {
          from: 'receivablepurchases',
          localField: '_id',
          foreignField: 'CostEstimatesId',
          as: 'receivablePurchases'
        }
      },
      // 4) Project needed fields (this is a new separate stage)
      {
        $project: {
          _id: 1,
          estimateDate: 1,
          validUntil: 1,
          currency: 1,
          estimateRef: 1,
          lineItems: 1,
          VATRate: 1,
          Notes: 1,
          Status: 1,
          createdAt: 1,
          updatedAt: 1,
          projects: {
            $map: {
              input: '$projects',
              as: 'p',
              in: {
                projectId: '$$p._id',
                projectName: '$$p.projectName'
              }
            }
          },
          clients: {
            $map: {
              input: '$clients',
              as: 'c',
              in: {
                clientId: '$$c._id',
                clientName: '$$c.clientName',
                clientEmail: '$$c.contactPersons.email',
                clientPhone: '$$c.contactPersons.phone'
              }
            }
          },
          receivablePurchases: {
            $map: {
              input: '$receivablePurchases',
              as: 'rp',
              in: {
                _id: '$$rp._id',
                POStatus: '$$rp.POStatus',
                purchaseDate: '$$rp.purchaseDate',
                amount: '$$rp.amount'
              }
            }
          }
        }
      }
    ]);

    // Handle empty
    if (!allCostEstimates.length) {
      return res
        .status(404)
        .json({ success: false, message: 'No cost estimates found' });
    }

    // Success
    return res.status(200).json({
      success: true,
      costEstimates: allCostEstimates
    });
  } catch (error) {
    console.error('Error fetching cost estimates:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching cost estimates',
      error: error.message
    });
  }
};




//GET SINGLE DeleteProjects
//METHOD:DELETE
const deleteCostEstimate = async (req, res) => {
  let deleteCostEstimateID = req.params.id
  if (deleteCostEstimateID) {
    const deleteCostEstimate = await CostEstimates.findByIdAndDelete(deleteCostEstimateID, req.body);
    res.status(200).json("Delete Cost Estimate Successfully")
  } else {
    res.status(400).json({ message: "Not Delete Cost Estimate" })
  }
}


//GET SINGLE ProjectsUpdate
//METHOD:PUT
const UpdateCostEstimate = async (req, res) => {
    const id = req.body.id || req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Missing Cost Estimate ID' });
    }
    const {
    projectId,
    clientId,
    estimateDate,
    validUntil,
    currency,
    lineItems,
    VATRate,
    Notes,
    POStatus,
    Status
  } = req.body;

  try {
    const updatedCostEstimate = await CostEstimates.findByIdAndUpdate(id, {
      projectId,
      clientId,
      estimateDate,
      validUntil,
      currency,
      lineItems,
      VATRate,
      Notes,
      POStatus,
      Status
    }, { new: true });

    if (!updatedCostEstimate) {
      return res.status(404).json({ message: 'Cost Estimate not found' });
    }

    res.status(200).json(updatedCostEstimate);

  } catch (error) {
    console.error("Error updating cost estimate:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


//METHOD:Single
//TYPE:PUBLIC
const SingleCostEstimate = async (req, res) => {
  try {
    const SingleCostEstimate = await CostEstimates.findById(req.params.id);
    res.status(200).json(SingleCostEstimate)
  } catch (error) {
    res.status(404).json({ msg: "Can t Find Cost Estimate" })
  }
}


module.exports = { costEstimatesCreate, AllCostEstimates, deleteCostEstimate, UpdateCostEstimate, SingleCostEstimate }