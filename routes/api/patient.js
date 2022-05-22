const express = require('express');
const router = express.Router();
const patientController = require('../../controllers/patientController');
const verifyRoles = require('../../middlewares/verifyRoles');

router
    .get('/gender-types', verifyRoles(process.env.EXAMINER_ROLE), patientController.getGenderType)
    .post('/add-new-patient', verifyRoles(process.env.EXAMINER_ROLE), patientController.addNewPatient)
    .get('/get-patient/:id', verifyRoles(process.env.EXAMINER_ROLE), patientController.getPatient)

module.exports = router;    