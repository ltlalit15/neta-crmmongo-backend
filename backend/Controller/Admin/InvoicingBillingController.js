const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const InvoicingBilling = require('../../Model/Admin/InvoicingBillingModel');
const Projects = require("../../Model/Admin/ProjectsModel");
const ClientManagement = require("../../Model/Admin/ClientManagementModel");
const cloudinary = require('../../Config/cloudinary');
const { generateInvoicingNo } = require('../../middlewares/generateEstimateRef');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

// 🔵 POST: Create Invoicing Billing
const InvoicingBillingCreate = asyncHandler(async (req, res) => {
  const {
    projectsId,
    clientId,
    CostEstimatesId,
    ReceivablePurchaseId,
    date,
    status,
    currency,
    document,
    output,
    lineItems,
  } = req.body;

  try {
    if (!Array.isArray(projectsId) || projectsId.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ success: false, message: "Invalid Project ID(s)" });
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ success: false, message: "Invalid Client ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(CostEstimatesId)) {
      return res.status(400).json({ success: false, message: "Invalid CostEstimatesId" });
    }

    if (!mongoose.Types.ObjectId.isValid(ReceivablePurchaseId)) {
      return res.status(400).json({ success: false, message: "Invalid ReceivablePurchaseId" });
    }

    const projects = await Projects.find({ '_id': { $in: projectsId } });
    if (projects.length !== projectsId.length) {
      return res.status(404).json({ success: false, message: "One or more projects not found" });
    }

    const client = await ClientManagement.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
const InvoiceNo = await generateInvoicingNo();
    const newInvoice = new InvoicingBilling({
      InvoiceNo,
      projectId: projectsId,
      clientId,
      CostEstimatesId,
      ReceivablePurchaseId,
      date,
      status,
      currency,
      document,
      output,
      lineItems,
    });

    await newInvoice.save();

    res.status(201).json({
      success: true,
      message: "Invoicing record created successfully",
      invoicingBilling: newInvoice,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the invoice",
      error: error.message,
    });
  }
});


// GET All Cost Estimates with project and client info
const AllInvoicingBilling = asyncHandler(async (req, res) => {
  try {
    const allInvoicingBilling = await InvoicingBilling.find()
      .populate({ path: 'projectId', select: '_id projectName' })
     .populate({path: 'clientId',select: '_id clientName contactPersons.email'})
      .populate({ path: 'CostEstimatesId', select: '_id estimateRefName totalCost' })
      .populate({ path: 'ReceivablePurchaseId', select: '_id purchaseRefNo purchaseDate' });

    if (!allInvoicingBilling.length) {
      return res.status(404).json({ success: false, message: "No invoicing records found" });
    }
    const mapped = allInvoicingBilling.map(item => {
      const obj = item.toObject();

      return {
        ...obj,
        projects: Array.isArray(item.projectId)
          ? item.projectId.map(p => ({ projectId: p._id, projectName: p.projectName }))
          : [],
        clients: item.clientId
          ? [{ clientId: item.clientId._id, clientName: item.clientId.clientName, clientEmail:item.clientId.contactPersons.email }]
          : [],
        costEstimate: item.CostEstimatesId
          ? {
              estimateId: item.CostEstimatesId._id,
              estimateRefName: item.CostEstimatesId.estimateRefName,
              totalCost: item.CostEstimatesId.totalCost
            }
          : null,
        receivablePurchase: item.ReceivablePurchaseId
          ? {
              purchaseId: item.ReceivablePurchaseId._id,
              purchaseRefNo: item.ReceivablePurchaseId.purchaseRefNo,
              purchaseDate: item.ReceivablePurchaseId.purchaseDate
            }
          : null
      };
    });

    res.status(200).json({ success: true, InvoicingBilling: mapped });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching invoicing records",
      error: error.message,
    });
  }
});



//GET SINGLE DeleteProjects
//METHOD:DELETE
const deleteInvoicingBilling = async (req, res) => {
  let deleteInvoicingBillingID = req.params.id
  if (deleteInvoicingBillingID) {
    const deleteInvoicingBilling = await InvoicingBilling.findByIdAndDelete(deleteInvoicingBillingID, req.body);
    res.status(200).json("Delete Invoicing Billing Successfully")
  } else {
    res.status(400).json({ message: "Not Delete Cost Estimate" })
  }
}


//GET SINGLE ProjectsUpdate
//METHOD:PUT
const UpdateInvoicingBilling = async (req, res) => {
  try {
    const id = req.body.id || req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Missing Invoicing Billing ID' });
    }

    const allowedFields = [
      'projects',
      'clientId',
    'date',
    'status',
    'currency',
    'document',
    'output',
    'lineItems',
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

    console.log("Updating ID:", id);
    const updatedInvoicingBilling = await InvoicingBilling.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedInvoicingBilling) {
      return res.status(404).json({ message: 'Invoicing Billing not found' });
    }

    res.status(200).json(updatedInvoicingBilling);
  } catch (error) {
    console.error("Error updating invoicing billing:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


//METHOD:Single
//TYPE:PUBLIC
const SingleInvoicingBilling = async (req, res) => {
  try {
    const SingleCostEstimate = await InvoicingBilling.findById(req.params.id);
    res.status(200).json(SingleCostEstimate)
  } catch (error) {
    res.status(404).json({ msg: "Can t Find Cost Estimate" })
  }
}

module.exports = { InvoicingBillingCreate, AllInvoicingBilling, deleteInvoicingBilling, UpdateInvoicingBilling, SingleInvoicingBilling }