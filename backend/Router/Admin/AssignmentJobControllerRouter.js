const express=require('express');
const { AssignmentCreate, AllAssignJobID, AllAssignJob} = require('../../Controller/Admin/AssignmentJobController');


const router = express.Router()

router.post('/',AssignmentCreate)


router.get('/getbyid/:employeeId',AllAssignJobID)

router.get('/',AllAssignJob)
// router.patch('/:id',UpdateClient)

// router.delete('/:id',deleteClient)

// router.get('/:id',SingleClient)

 module.exports = router 
