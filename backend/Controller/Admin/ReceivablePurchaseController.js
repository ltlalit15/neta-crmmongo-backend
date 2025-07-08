const asyncHandler = require('express-async-handler');
const ReceivablePurchase = require('../../Model/Admin/ReceivablePurchaseModel');
const Projects = require("../../Model/Admin/ProjectsModel");
const ClientManagement = require("../../Model/Admin/ClientManagementModel");
const CostEstimates = require('../../Model/Admin/CostEstimatesModel');
const cloudinary = require('../../Config/cloudinary');
const mongoose = require("mongoose");
const { ReceivablePurchaseNo } = require('../../middlewares/generateEstimateRef');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});
const ReceivablePurchaseCreate = asyncHandler(async (req, res) => {
  let {
    projectsId,
    ClientId,
    CostEstimatesId,
    ReceivedDate,
    POStatus,
    Amount
  } = req.body;

  console.log("first", req.body);
  try {
    if (typeof projectsId === "string") {
      try {
        projectsId = JSON.parse(projectsId);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid projectsId format",
        });
      }
    }

    if (!projectsId || !Array.isArray(projectsId)) {
      return res.status(400).json({
        success: false,
        message: "projectsId is required and should be an array"
      });
    }

    const projects = await Projects.find({ _id: { $in: projectsId } });
    if (projects.length !== projectsId.length) {
      return res.status(404).json({
        success: false,
        message: "One or more projects not found."
      });
    }

    const client = await ClientManagement.findById(ClientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found."
      });
    }

    if (typeof CostEstimatesId === "string") {
      try {
        CostEstimatesId = JSON.parse(CostEstimatesId);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid CostEstimatesId format",
        });
      }
    }

    if (!CostEstimatesId || !Array.isArray(CostEstimatesId)) {
      return res.status(400).json({
        success: false,
        message: "CostEstimatesId is required and should be an array"
      });
    }

    const costEstimates = await CostEstimates.find({ _id: { $in: CostEstimatesId } });
    if (costEstimates.length !== CostEstimatesId.length) {
      return res.status(404).json({
        success: false,
        message: "One or more Cost Estimates not found."
      });
    }

    // Image upload handling (agar koi file aaye toh)
    let imageUrls = [];
    if (req.files && req.files.image) {
      const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
      for (const file of files) {
        try {
          const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'user_profiles',
            resource_type: 'image',
          });
          if (result.secure_url) {
            imageUrls.push(result.secure_url);
          }
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
        }
      }
    }

    const PONumber = await ReceivablePurchaseNo();
    const newReceivablePurchase = new ReceivablePurchase({
      projectId: projectsId,
      CostEstimatesId,
      ClientId,
      ReceivedDate,
      PONumber,
      POStatus,
      Amount,
      image: imageUrls,
    });

    await newReceivablePurchase.save();

    res.status(201).json({
      success: true,
      message: "Receivable Purchase created successfully",
      receivablePurchase: newReceivablePurchase,
    });

  } catch (error) {
    console.error("Error creating Receivable Purchase:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the Receivable Purchase",
      error: error.message,
    });
  }
});




//GET SINGLE AllReceivablePurchase
//METHOD:GET
const AllReceivablePurchase = asyncHandler(async (req, res) => {
  try {
    const allReceivablePurchases = await ReceivablePurchase.find()
      .populate({
        path: 'projectId',
        select: '_id projectName',
        model: 'Projects'
      })
      .populate({
        path: 'ClientId',
        select: '_id clientName',
        model: 'ClientManagement'
      })
      .populate({
        path: 'CostEstimatesId',
        select: '_id estimateRef',
        model: 'CostEstimates'
      });

    if (!allReceivablePurchases || allReceivablePurchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No receivable purchases found"
      });
    }

    const receivablePurchasesWithDetails = allReceivablePurchases.map(purchase => {
      const purchaseObj = purchase.toObject();

      return {
        ...purchaseObj,
        projects: Array.isArray(purchaseObj.projectId)
          ? purchaseObj.projectId.map(project => ({
              projectId: project?._id,
              projectName: project?.projectName
            }))
          : [],
        client: purchaseObj.ClientId
          ? {
              clientId: purchaseObj.ClientId._id,
              clientName: purchaseObj.ClientId.clientName
            }
          : null,
        costEstimates: Array.isArray(purchaseObj.CostEstimatesId)
          ? purchaseObj.CostEstimatesId.map(ce => ({
              costEstimateId: ce?._id,
              estimateRef: ce?.estimateRef
            }))
          : [],
      };
    });

    res.status(200).json({
      success: true,
      receivablePurchases: receivablePurchasesWithDetails,
    });

  } catch (error) {
    console.error("Error fetching receivable purchases:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching receivable purchases",
      error: error.message,
    });
  }
});


//GET SINGLE DeleteProjects
//METHOD:DELETE
const deleteReceivablePurchase = async (req, res) => {
  let deleteReceivablePurchaseID = req.params.id
  if (deleteReceivablePurchaseID) {
    const deleteReceivablePurchase = await ReceivablePurchase.findByIdAndDelete(deleteReceivablePurchaseID, req.body);
    res.status(200).json("Delete Receivable Purchase Successfully")
  } else {
    res.status(400).json({ message: "Not Delete Receivable Purchase" })
  }
}



//GET SINGLE ClientUpdate
//METHOD:PUT
const UpdateReceivablePurchase = async (req, res) => {
  try {
    const allowedFields = [
      'projectId',
      'ClientId',
      'ReceivedDate',
      'Status',
      'Amount',
      'image'
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
    const updatedReceivablePurchase = await ReceivablePurchase.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedReceivablePurchase) {
      return res.status(404).json({ message: 'Receivable Purchase not found' });
    }
    res.status(200).json(updatedReceivablePurchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { ReceivablePurchaseCreate, AllReceivablePurchase, deleteReceivablePurchase, UpdateReceivablePurchase };
