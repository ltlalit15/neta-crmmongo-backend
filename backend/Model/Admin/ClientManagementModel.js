const mongoose = require("mongoose");


const ClientManagementSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
   website: { type: String, required: true },
  clientAddress: { type: String, required: true },

  contactPersons: [{
    contactName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    salesRepresentative: { type: String, required: true },
    _id:false
  }],

  billingInformation: [{
    billingAddress: { type: String, required: true },
    billingContactName: { type: String, required: true },
    billingEmail: { type: String, required: true },
    billingPhone: { type: String, required: true },

  }],

  ledgerInformation: [{
    accountCode: { type: String, required: true },
    accountType: {
      type: String,
     required: true 
    },
    openingBalance: { type: Number, required: true },
    balanceDate: { type: Date, required: true },
    taxCategory: { type: String, required: true },
    costCenter: { type: String, required: true },
    _id:false
  }],

  additionalInformation: {
    paymentTerms: { type: String, required: true },
    creditLimit: { type: Number, required: true },
    notes: { type: String, required: true },
  }

}, {
  timestamps: true,
});

module.exports = mongoose.model('ClientManagement', ClientManagementSchema);
