const mongoose = require("mongoose");


const ClientManagementSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  industry: { type: String, required: true },
  website: { type: String, required: true },
  clientAddress: { type: String, required: true },
  TaxID_VATNumber: { type: String, required: true },
  CSRCode: { type: String, required: true },
  Status: { type: String, required: true },

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
    currency: {
      type: String,
     required: true
    },
    preferredPaymentMethod: {
      type: String,
      required: true
    },
    _id:false
  }],

  shippingInformation: [{
    shippingAddress: { type: String, required: true },
    shippingContactName: { type: String, required: true },
    shippingEmail: { type: String, required: true },
    shippingPhone: { type: String, required: true },
    preferredShippingMethod:{ type: String, required: true },
    specialInstructions: { type: String, required: true },
    _id:false
  }],

  financialInformation: [{
    annualRevenue: { type: Number, required: true },
    creditRating: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    fiscalYearEnd: { type: Date, required: true },
    financialContact: { type: String, required: true },
    _id:false
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
