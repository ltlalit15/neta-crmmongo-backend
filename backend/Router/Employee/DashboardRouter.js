const express=require('express');
const { getEmployeeDashboard } = require('../../Controller/Employee/DashboardController');


const router = express.Router()

router.get('/:id',getEmployeeDashboard)

module.exports = router 
