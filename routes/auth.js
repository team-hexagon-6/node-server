const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyRoles = require('../middlewares/verifyRoles');
const verifyJWT = require('../middlewares/verifyJWT');


router
    .post('/register', verifyJWT, verifyRoles(process.env.ADMIN_ROLE), authController.handleNewUser)
    .post('/login', authController.handleLogin)
    .get('/logout', authController.handleLogout)
    .get('/new-token', authController.handleNewAccessToken)
    .get('/user-types', verifyJWT, verifyRoles(process.env.ADMIN_ROLE), authController.getUserTypes);


module.exports = router;
