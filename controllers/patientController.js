// helpers
const prisma = require('../config/client');
const validate = require('../utils/validation');

const getGenderType = async (req, res) => {
    const genders = await prisma.GenderType.findMany({
        select: {
            name: true,
            slug: true
        }
    });
    console.log(genders)
    if (genders.length <= 0)
        return res.status(500).json({
            "message": "Gender types not found"
        })
    return res.status(200).json({
        "message": `Successfully sent gender types`,
        data: genders
    })
}

const addNewPatient = async (req, res) => {
    const { patient_id, firstname, lastname, nic, contact_no, email, birthday, gender_type } = req.body;
    // const patient_id = req.patient_id;

    const result = validate.new_patient_validation({ firstname, lastname, nic, contact_no, email, birthday });
    if (result?.error) {
        console.log(result.error.details)
        return res.status(400).json({
            "message": result.error.details
        });
    }

    const duplicatePatient = await prisma.Patient.findUnique({
        where: {
            id: patient_id
        }
    });

    try {
        if (duplicatePatient) {
            return res.status(409).json({ "message": `Patient :${patient_id} already exists...` });

        }

        const genderType = await prisma.GenderType.findUnique({
            where: {
                slug: gender_type
            }
        });

        if (!genderType) {
            console.log("gender type not exits")
            return res.status(400).json({ "message": `Gender type :${gender_type} does not exist...` });
        }
        console.log("gender type", gender_type);

        const newPatient = await prisma.Patient.create({
            data: {
                id: patient_id,
                firstname: firstname,
                lastname: lastname,
                nic: nic,
                contact_no: contact_no,
                email: email,
                birthday: new Date(birthday),
                gender_type_id: genderType.id
            }
        })

        console.log("new patient", newPatient);
        res.status(201).json({
            'message': `new patient ${patient_id} added successfully...!`
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "message": "Internal server error" });
    }
}

const getAllPatients = async (req, res) => {
    const { skip, take } = req.query;
    const validation = validate.skip_take_validation({ skip, take });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    try {
        const patients = await prisma.Patient.findMany({
            select: {
                firstname: true,
                lastname: true,
                nic: true,
                contact_no: true,
                email: true,
                birthday: true,
                gender_type: true
            },
            skip: parseInt(skip),
            take: parseInt(take)
        });

        const totalItems = await prisma.Patient.count();

        console.log(patients);
        return res.status(200).json({
            status: 'success',
            data: patients,
            total_items: totalItems
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const getPatient = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await prisma.Patient.findUnique({
            where: {
                id: id
            },
        });

        if (!patient) {
            console.log(`Patient with id: ${id} not found`)
            return res.status(404).json({
                status: 'error',
                message: `Patient with id: ${id} not found`
            })
        }

        return res.status(200).json({
            status: 'success',
            data: patient
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}


module.exports = {
    getGenderType,
    addNewPatient,
    getPatient,
    getAllPatients
}
