const express=require('express');
const { ClientCreate, getAllClient, deleteClient, UpdateClient, SingleClient } = require('../../Controller/Admin/ClientManagementController');


const router = express.Router()

router.post('/',ClientCreate)


router.get('/',getAllClient)

router.patch('/:id',UpdateClient)

router.delete('/:id',deleteClient)

router.get('/:id',SingleClient)

 module.exports = router 
