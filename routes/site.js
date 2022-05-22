const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router
    .route('/')
    .get(siteController.handleHomeImages);


module.exports = router;    