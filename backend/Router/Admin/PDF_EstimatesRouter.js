const express=require('express');
const { PDFDataGet ,invoicePdf} = require('../../Controller/Admin/PDF_EstimatesController');


const router = express.Router()
router.post('/',PDFDataGet)
router.get('/invoice', invoicePdf);

 module.exports = router 
