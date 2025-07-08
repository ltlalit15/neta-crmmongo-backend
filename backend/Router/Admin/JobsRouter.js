const express=require('express');
const { jobCreate, AllJob, deleteJob, UpdateJob, SingleJob, UpdateJobAssign, AllJobID, filter } = require('../../Controller/Admin/JobsController');


const router = express.Router()

router.post('/',jobCreate)

router.get('/:projectId', AllJobID);

router.get('/filter/:Status',filter)

router.get('/',AllJob)

router.delete('/:id',deleteJob)

router.patch('/:id',UpdateJob)

router.get('/:id',SingleJob)

router.put('/:id',UpdateJobAssign)

 module.exports = router 
