// helpers
const bcrypt = require('bcrypt');
const prisma = require('../database/client');
const validate = require('../utils/validation');


// functions 
const getAllEmpoyees = async (req, res) => {
    try {
        const userTypesIDs = await prisma.userType.findMany({
            where: {
                name: {
                    in: ['examiner', 'doctor']
                }
            },
            select: {
                id: true
            }
        });
        // console.log(userTypesIDs)
        // console.log()
        const employees = await prisma.User.findMany({
            where: {
                auth: {
                    user_type_id: {
                        in: userTypesIDs.map(userType => userType.id)
                    }
                }
            },
        });
        // console.log(employees)
        return res.status(200).json({
            status: 'success',
            data: employees
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const getEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.User.findUnique({
            where: {
                user_id: id
            },
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: `User with id: ${id} not found`
            })
        }

        return res.status(200).json({
            status: 'success',
            data: user
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
    getAllEmpoyees,
    getEmployee
}