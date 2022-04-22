const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router
    .get('/get-employees', userController.getAllEmpoyees)
    .get('/get-employee/:id', userController.getEmployee)
    .post('/update-profile', userController.updateUserByUser);

module.exports = router;    