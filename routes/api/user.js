const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const verifyRoles = require('../../middlewares/verifyRoles');


router
    .get('/get-employees', verifyRoles(process.env.ADMIN_ROLE), userController.getAllEmpoyees)
    .get('/get-employee/:id', verifyRoles(process.env.ADMIN_ROLE), userController.getEmployee)
    .post('/update-profile', verifyRoles(
        process.env.ADMIN_ROLE,
        process.env.DOCTOR_ROLE,
        process.env.EXAMINER_ROLE),
        userController.updateUserByUser);

module.exports = router;    