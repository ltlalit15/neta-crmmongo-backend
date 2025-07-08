const express=require('express');
const { RemoveAssignedJob } = require('../../Controller/Admin/removeAssignController');

const router = express.Router()

router.delete('/', RemoveAssignedJob);

 module.exports = router 
