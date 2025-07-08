const asyncHandler = require('express-async-handler');
const ClientManagement = require("../../Model/Admin/ClientManagementModel");
const cloudinary = require('../../Config/cloudinary');
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const ClientCreate = asyncHandler(async (req, res) => {
  const {
    clientName,
    industry,
    website,
    clientAddress,
    TaxID_VATNumber,
    CSRCode,
    Status,
    contactPersons,
    billingInformation,
    shippingInformation,
    financialInformation,
    ledgerInformation,
    additionalInformation
  } = req.body;

  // Input validation (basic check for required root-level fields)
  if (!clientName || !industry || !website || !clientAddress || !TaxID_VATNumber || !CSRCode || !Status) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required root-level fields"
    });
  }

  try {
    const newClient = new ClientManagement({
      clientName,
      industry,
      website,
      clientAddress,
      TaxID_VATNumber,
      CSRCode,
      Status,
      contactPersons,
      billingInformation,
      shippingInformation,
      financialInformation,
      ledgerInformation,
      additionalInformation
    });

    await newClient.save();

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client: newClient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the client",
      error: error.message,
    });
  }
});

//GET SINGLE AllClient
  //METHOD:GET
  const getAllClient = async (req, res) => {
    try {
      const allClient = await ClientManagement.find();
      const ClientWithVirtuals = allClient.map(project => project.toObject({ virtuals: true }));
      res.status(200).json({
        success: true,
        data: ClientWithVirtuals,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching Client",
        error: error.message,
      });
    }
  };
  
  


       //GET SINGLE DeleteClient
  //METHOD:DELETE
  const deleteClient = async (req, res) => {
    let deleteClientID = req.params.id
    if (deleteClient) {
      const deleteClient = await ClientManagement.findByIdAndDelete(deleteClientID, req.body);
      res.status(200).json("Delete Checklists Successfully")
    } else {
      res.status(400).json({ message: "Not Delete project" })
    }
  }

  
 //GET SINGLE ClientUpdate
  //METHOD:PUT
  const UpdateClient = async (req, res) => {
    try {
      const allowedFields = [
        'clientName',
        'industry',
        'website',
        'clientAddress',
        'TaxID_VATNumber',
        'CSRCode',
        'Status',
        'contactPersons',
        'billingInformation',
        'shippingInformation',
        'financialInformation',
        'ledgerInformation',
        'additionalInformation'
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
      const updatedDiary = await ClientManagement.findByIdAndUpdate(
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
  const SingleClient=async(req,res)=>{
    try {
        const SingleClient= await ClientManagement.findById(req.params.id);
        res.status(200).json(SingleClient)
    } catch (error) {
        res.status(404).json({msg:"Can t Find Diaries"} )
    }
}


module.exports = { ClientCreate ,getAllClient,deleteClient,UpdateClient,SingleClient };
