// helpers 
const prisma = require('../config/client');
const validate = require('../utils/validation');
const axios = require('axios');
const FormData = require('form-data');



// functions
const handleNewTest = async (req, res) => {
    const { patient_id } = req.body;

    const validation = validate.new_test_validation({ patient_id });

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


// const uploadImage = (req, res) => {
//     const { patient_id, test_id } = req.body;

//     const validation = validate.upload_image_validation({ patient_id, test_id });
// }

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
        // decode base64 image string into image file 
        // image validation
        Buffer.from(image_string, 'base64');
        // writeFileSync("image.png", image)
    }
    catch (err) {
        console.log("Image is not base64 :", err.message);
        return res.status(400).json({
            "message": `Image is not base64 :${err.message}`
        });
    }

    // patient validation
    // TODO: check if patient exists


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
        const newTestRecord = await handlenNewTestRecord(result.data, test_id, req.user_id, patient_id);

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

const handlenNewTestRecord = async (data, test_id, examiner_id, patient_id) => {

    // get test record types 
    const testType = await prisma.TestType.findUnique({
        where: {
            name: data.typo
        }
    });
    // console.log("test type :", testType);

    const testResult = await prisma.TestResult.findUnique({
        where: {
            name: data.disease
        }
    });

    // FIXME: add patient id to test record
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
    console.log("params : ", req.params)
    const { test_id } = req.params;

    const validation = validate.get_test_validation({ test_id });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const test = await prisma.Test.findUnique({
        where: {
            id: test_id
        }
    });

    if (!test) {
        return res.status(400).json({
            "message": `Test :${test_id} does not exist...`
        });
    }

    return res.status(200).json({
        "message": 'success',
        "test": test
    });
}

const getAllTests = async (req, res) => {
    const { skip, take } = req.query;

    const validation = validate.skip_take_validation({ skip, take });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const tests = await prisma.Test.findMany({
        skip: parseInt(skip),
        take: parseInt(take)
    });

    return res.status(200).json({
        "message": 'success',
        "tests": tests
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
    getAllTests,
    getTestRecord,
    getAllTestRecords,
    getTestTypes
}