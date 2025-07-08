const express=require('express');
const { ReportsAnalyticsController } = require('../../Controller/Admin/ReportsAnalyticsController');

const router = express.Router()

router.get('/',ReportsAnalyticsController)

 module.exports = router 
