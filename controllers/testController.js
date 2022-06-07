// helpers 
const prisma = require('../config/client');
const validate = require('../utils/validation');
const axios = require('axios');
const FormData = require('form-data');



// functions
const handleNewTest = async (req, res) => {
    const { patient_id } = req.body;

    const validation = validate.patient_id_validation({ patient_id });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const patient = await prisma.Patient.findUnique({
        where: {
            id: patient_id
        }
    });

    if (!patient) {
        return res.status(400).json({
            "message": `Patient :${patient_id} does not exist...`
        });
    }

    try {
        const newTest = await prisma.Test.create({
            data: {
                patient_id: patient_id,
            }
        });

        return res.status(201).json({
            "message": `Test created for patient :${patient_id}`,
            "test_id": newTest.id
        });
    } catch (err) {
        return res.status(500).json({
            "message": `Internal server error...`
        });
    }
}


const doTest = async (req, res) => {
    const { patient_id, test_id, image_string, test_type } = req.body;

    const validation = validate.do_test_validation({ patient_id, test_id, image_string, test_type });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const testType = await prisma.TestType.findUnique({
        where: {
            slug: test_type
        }
    });

    if (!testType) {
        return res.status(400).json({
            "message": `Test type does not exist...`
        });
    }

    try {
        Buffer.from(image_string, 'base64');
    }
    catch (err) {
        console.log("Image is not base64 :", err.message);
        return res.status(400).json({
            "message": `Image is not base64 :${err.message}`
        });
    }

    // patient validation

    const patient = await prisma.Patient.findUnique({
        where: {
            id: patient_id
        }
    });

    if (!patient) {
        return res.status(400).json({
            "message": `Patient :${patient_id} does not exist...`
        });
    }

    // test validation
    const testFound = await prisma.Test.findUnique({
        where: {
            id: test_id
        }
    });

    if (!testFound) {
        return res.status(400).json({
            "message": `Test :${test_id} does not exist...`
        });
    };

    const formData = new FormData();
    formData.append('image', image_string);
    formData.append('type', testType.name);


    const apiEndPoint = `${process.env.ML_DOMAIN}/api?user_id=${process.env.ML_USER_ID}&access_token=${process.env.ML_ACCESS_TOKEN}`;
    console.log("apiEndPoint :", apiEndPoint);
    try {
        const result = await axios.post(
            apiEndPoint,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

        console.log(result.data)

        // create new test record
        const newTestRecord = await handlenNewTestRecord(result.data, test_id, req.user_id, patient_id, testType);

        console.log(newTestRecord);

        return res.status(200).json({
            "message": 'success',
            data: newTestRecord
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            "message": 'Internal server error...'
        });
    }
}

const handlenNewTestRecord = async (data, test_id, examiner_id, patient_id, testType) => {
    const testResult = await prisma.TestResult.findUnique({
        where: {
            name: data.disease
        }
    });


    // create new test record
    const newTestRecord = await prisma.TestRecord.create({
        data: {
            test_type_id: testType.id,
            test_result_id: testResult.id,
            test_id: test_id,
            examiner_id: examiner_id
        }
    });

    return {
        test_id: test_id,
        test_type: testType.name,
        test_result: testResult.name,
        test_record_id: newTestRecord.id,
        patient_id
    }
}

const getTest = async (req, res) => {
    // console.log("params : ", req.params)
    const { test_id } = req.params;

    const validation = validate.test_id_validation({ test_id });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const totalItems = await prisma.Test.count({
        where: {
            id: test_id
        }
    });


    const test = await prisma.Test.findUnique({
        where: {
            id: test_id
        },
        include: {
            testrecord: {
                select: {
                    id: true,
                    examiner: {
                        select: {
                            user_id: true,
                            firstname: true,
                            lastname: true,
                            email: true,
                            contact_no: true,
                        }
                    },
                    test_result: {
                        select: {
                            name: true
                        }
                    },
                    test_type: {
                        select: {
                            name: true
                        }
                    },
                },
                orderBy: {
                    id: 'desc'
                }
            }
        },
    });

    if (!test) {
        return res.status(400).json({
            "message": `Test :${test_id} does not exist...`
        });
    }

    return res.status(200).json({
        "message": 'success',
        "test": test,
        total_items: totalItems
    });
}

const getAllTestsForPatient = async (req, res) => {
    const { skip, take, patient_id } = req.query;


    const validation = validate.skip_take_validation({ skip, take });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const validation2 = validate.patient_id_validation({ patient_id });
    if (validation2?.error) {
        return res.status(400).json({
            "message": validation2.error.details
        });
    }

    const patient = await prisma.Patient.findUnique({
        where: {
            id: patient_id
        }
    })

    if (!patient) {
        return res.status(400).json({
            "message": `Patient :${patient_id} does not exist...`
        })
    }

    // FIXME: try more efficient way to get count
    const totalItems = await prisma.Test.count({
        where: {
            patient_id: patient_id
        }
    });

    const tests = await prisma.Test.findMany({
        where: {
            patient_id: patient_id
        },
        orderBy: {
            created_at: 'desc'
        },
        skip: parseInt(skip),
        take: parseInt(take)
    });

    return res.status(200).json({
        "message": 'success',
        "tests": tests,
        total_items: totalItems
    });
}

const getTestRecord = async (req, res) => {
    const { test_record_id } = req.params;

    const validation = validate.get_test_record_validation({ test_record_id });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const testRecord = await prisma.TestRecord.findUnique({
        where: {
            id: parseInt(test_record_id)
        },
        include: {
            test: true,
        }
    });

    if (!testRecord) {
        return res.status(400).json({
            "message": `Test record :${test_record_id} does not exist...`
        });
    }

    const handleTestRecord = await handleViewTestRecords([testRecord]);

    return res.status(200).json({
        "message": 'success',
        "testRecord": handleTestRecord
    });
}

const getAllTestRecords = async (req, res) => {
    const { skip, take } = req.query;

    const validation = validate.skip_take_validation({ skip, take });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const testRecords = await prisma.TestRecord.findMany({
        skip: parseInt(skip),
        take: parseInt(take),
        include: {
            test: true,
        }
    });

    const handledTestRecords = await handleViewTestRecords(testRecords);
    console.log("view test records lenght :", handledTestRecords.length);

    return res.status(200).json({
        "message": 'success',
        "testRecords": handledTestRecords
    });
}

// FIXME:try do it in efficient way 
const handleViewTestRecords = async (test_records) => {
    const testTypes = await prisma.TestType.findMany();
    const testResultTypes = await prisma.TestResult.findMany();

    const mapTestTypes = mappingTypes(testTypes);
    const mapTestResultTypes = mappingTypes(testResultTypes);

    test_records = test_records.map(record => {
        return {
            id: record.id,
            test: record.test,
            examiner_id: record.examiner_id,
            test_result: mapTestResultTypes[record.test_result_id],
            test_type: mapTestTypes[record.test_type_id],
        }
    });
    return test_records;
}

const getTestTypes = async (req, res) => {
    const testTypes = await prisma.TestType.findMany();
    console.log("test_types :", testTypes);

    if (testTypes.length <= 0) {
        return res.status(500).json({
            "message": 'No test types found...'
        });
    }

    return res.status(200).json({
        "message": 'success',
        "testTypes": testTypes
    });
}

const confirmTest = async (req, res) => {
    const { test_id, patient_id } = req.body;

    const validation = validate.confirm_test_validation({ test_id, patient_id });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }


    const foundTest = await prisma.Test.findUnique({
        where: {
            id: test_id,
        }
    });

    if (!foundTest) {
        return res.status(400).json({
            "message": `Test :${test_id} does not exist...`
        });
    }

    if (foundTest.patient_id !== patient_id) {
        return res.status(400).json({
            "message": 'Patient does not match...'
        });
    }

    if (foundTest.confirmed) {
        return res.status(400).json({
            "message": `Test :${test_id} already confirmed...`
        });
    }

    const confirmedTest = await prisma.Test.update({
        where: {
            id: test_id
        },
        data: {
            confirmed: true
        }
    });
    console.log("test confirmation :", confirmedTest);

    return res.status(200).json({
        "message": 'success',
        "test": confirmedTest
    });
}

const mappingTypes = (typesArray) => {
    const mapObject = {};

    typesArray.forEach(type => {
        mapObject[type.id] = type.name;
    })

    return mapObject;
}


module.exports = {
    handleNewTest,
    doTest,
    getTest,
    getAllTestsForPatient,
    getTestRecord,
    getAllTestRecords,
    getTestTypes,
    confirmTest
}