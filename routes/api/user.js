const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.get('/get-employees', userController.getAllEmpoyees);
router.get('/get-employee/:id', userController.getEmployee);

module.exports = router;    