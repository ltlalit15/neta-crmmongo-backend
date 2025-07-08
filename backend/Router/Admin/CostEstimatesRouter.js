const express=require('express');
const { costEstimatesCreate, AllCostEstimates, deleteCostEstimate, UpdateCostEstimate, SingleCostEstimate } = require('../../Controller/Admin/CostEstimatesController');


const router = express.Router()

router.post('/',costEstimatesCreate)

router.get('/',AllCostEstimates)

router.delete('/:id',deleteCostEstimate);

router.patch('/:id',UpdateCostEstimate)

router.get('/:id',SingleCostEstimate)

module.exports = router