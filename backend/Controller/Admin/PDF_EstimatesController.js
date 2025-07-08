const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const PDF_Estimate = require("../../Model/Admin/PDF_EstimatesControllerModel");
const CostEstimates = require("../../Model/Admin/CostEstimatesModel");
const Projects = require("../../Model/Admin/ProjectsModel");
const ClientManagement = require("../../Model/Admin/ClientManagementModel");
const ReceivablePurchase = require("../../Model/Admin/ReceivablePurchaseModel");
const InvoiceBilling = require("../../Model/Admin/InvoicingBillingModel");
const PDFDataGet = asyncHandler(async (req, res) => {
    const { CostEstimatesId } = req.query; // We will take it from URL query


    // Find matching PDF_Estimate records
    const pdfRecords = await CostEstimates.find({
        _id: CostEstimatesId
    })
        .populate('projectId')
        .populate('clientId')
    // .populate('receivablePurchaseId');

    res.status(200).json({
        success: true,
        count: pdfRecords.length,
        data: pdfRecords
    });
});


const invoicePdf = asyncHandler(async (req, res) => {
    const { InvoiceBillingId } = req.query; // We will take it from URL query


    // Find matching PDF_Estimate records
    const pdfRecords = await InvoiceBilling.find({
        _id: InvoiceBillingId
    })
        .populate('projectId')
        .populate('clientId')
        .populate('CostEstimatesId')
        .populate('ReceivablePurchaseId')

    res.status(200).json({
        success: true,
        count: pdfRecords.length,
        data: pdfRecords
    });
});

module.exports = { PDFDataGet, invoicePdf };
