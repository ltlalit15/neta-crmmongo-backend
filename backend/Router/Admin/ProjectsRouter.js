const express=require('express');
const { createProjects, getAllProjects, UpdateProject, deleteProjects, SingleProjects } = require('../../Controller/Admin/ProjectsController');


const router = express.Router()

router.post('/',createProjects)

router.get('/',getAllProjects)

router.patch('/:id',UpdateProject)

router.delete('/:id',deleteProjects)

router.get('/:id',SingleProjects)
 module.exports = router 
