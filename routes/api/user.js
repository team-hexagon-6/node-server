const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const verifyRoles = require('../../middlewares/verifyRoles');


router
    .get('/employees', verifyRoles(process.env.ADMIN_ROLE), userController.getAllEmpoyees)
    .get('/employee/:id', verifyRoles(process.env.ADMIN_ROLE), userController.getEmployee)
    .post('/update-profile', userController.updateUserByUser)
    .post('/update-password-by-admin', verifyRoles(process.env.ADMIN_ROLE), userController.updatePasswordByAdmin)
    .post('/update-password-by-user', userController.updatePasswordByUser)
    .get('/user', userController.getUser);

module.exports = router;    