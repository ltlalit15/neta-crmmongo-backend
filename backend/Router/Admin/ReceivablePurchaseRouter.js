const express=require('express');
const { ReceivablePurchaseCreate, AllReceivablePurchase, deleteReceivablePurchase, UpdateReceivablePurchase } = require('../../Controller/Admin/ReceivablePurchaseController');


const router = express.Router()

router.post('/',ReceivablePurchaseCreate)

router.get('/',AllReceivablePurchase)

router.delete('/:id',deleteReceivablePurchase)

router.patch('/:id',UpdateReceivablePurchase)

// router.get('/:id',SingleJob)

 module.exports = router 
