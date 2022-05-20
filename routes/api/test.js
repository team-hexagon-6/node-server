const express = require('express');
const router = express.Router();
const testController = require('../../controllers/testController');
const verifyRoles = require('../../middlewares/verifyRoles');

router
    .post('/create-new-test', verifyRoles(process.env.EXAMINER_ROLE), testController.handleNewTest)
    .post('/do-test', verifyRoles(process.env.EXAMINER_ROLE), testController.doTest)
    .get('/get-test/:test_id', verifyRoles(process.env.EXAMINER_ROLE, process.env.DOCTOR_ROLE), testController.getTest)
    .get('/get-tests', verifyRoles(process.env.EXAMINER_ROLE, process.env.DOCTOR_ROLE), testController.getAllTests)
    .get('/get-test-record/:test_record_id', verifyRoles(process.env.EXAMINER_ROLE, process.env.DOCTOR_ROLE), testController.getTestRecord)
    .get('/get-test-records', verifyRoles(process.env.EXAMINER_ROLE, process.env.DOCTOR_ROLE), testController.getAllTestRecords);

module.exports = router;  