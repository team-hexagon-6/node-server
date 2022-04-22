const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router
    .post('/register', authController.handleNewUser)
    .post('/login', authController.handleLogin)
    .get('/logout', authController.handleLogout)
    .get('/new-token', authController.handleNewAccessToken);


module.exports = router;
