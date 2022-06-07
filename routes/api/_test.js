const express = require('express');
const router = express.Router();
const testController = require('../../controllers/testController');
const verifyRoles = require('../../middlewares/verifyRoles');

router
    .post('/create-new-test', verifyRoles(process.env.EXAMINER_ROLE), testController.handleNewTest)
    .post('/do-test', verifyRoles(process.env.EXAMINER_ROLE), testController.doTest)
    .get('/test/:test_id', verifyRoles(process.env.EXAMINER_ROLE, process.env.DOCTOR_ROLE), testController.getTest)
    .get('/tests', verifyRoles(process.env.EXAMINER_ROLE, process.env.DOCTOR_ROLE), testController.getAllTestsForPatient)
    .get('/test-record/:test_record_id', verifyRoles(process.env.EXAMINER_ROLE, process.env.DOCTOR_ROLE), testController.getTestRecord)
    .get('/test-records', verifyRoles(process.env.EXAMINER_ROLE, process.env.DOCTOR_ROLE), testController.getAllTestRecords)
    .get('/test-types', verifyRoles(process.env.EXAMINER_ROLE), testController.getTestTypes)
    .post('/confirm-test', verifyRoles(process.env.EXAMINER_ROLE), testController.confirmTest);

module.exports = router;  