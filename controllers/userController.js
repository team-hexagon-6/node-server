// helpers
const bcrypt = require('bcrypt');
const prisma = require('../config/client');
const validate = require('../utils/validation');


// functions 
const getAllEmpoyees = async (req, res) => {
    const { skip, take } = req.query;
    const validation = validate.skip_take_validation({ skip, take });

    if (validation?.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    try {
        const userTypesIDs = await prisma.UserType.findMany({
            where: {
                name: {
                    in: ['examiner', 'doctor']
                }
            },
            select: {
                id: true
            },
            skip: parseInt(skip),
            take: parseInt(take)
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

const updateUserByUser = async (req, res) => {
    const { firstname, lastname, nic, contact_no, email, birthday } = req.body;

    const user_id = req.user_id;

    const validation = validate.update_user_validation({ firstname, lastname, nic, contact_no, email, birthday });

    if (validation.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const foundAuth = await prisma.Auth.findUnique({
        where: {
            id: user_id
        }
    });

    const foundUser = await prisma.User.findUnique({
        where: {
            user_id: user_id
        }
    });

    if (!foundAuth || !foundUser) {
        return res.status(404).json({
            "message": `User :${user_id} does not exist...`
        });
    }

    try {
        const updateUser = await prisma.User.update({
            where: {
                user_id: user_id
            },
            data: {
                firstname: firstname,
                lastname: lastname,
                nic: nic,
                contact_no: contact_no,
                email: email,
                birthday: new Date(birthday)
            }
        });

        console.log("update user", updateUser)

        // const isProfileComplete = 

        return res.status(200).json({
            status: 'success',
            data: updateUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }

}

const updatePasswordByUser = async (req, res) => {
    const { new_password, old_password } = req.body;
    const user_id = req.user_id;

    const validation = validate.update_password_validation({ new_password, old_password, user_id });

    if (validation.error) {
        return res.status(400).json({
            "message": validation.error.details
        })
    }

    const foundAuth = await prisma.Auth.findUnique({
        where: {
            id: user_id
        }
    });

    if (!foundAuth) {
        return res.status(404).json({
            "message": `User :${user_id} does not exist...`
        })
    }
    const isMatch = await bcrypt.compare(old_password, foundAuth.password);

    if (!isMatch) {
        return res.status(400).json({
            "message": `Old password is incorrect...`
        })
    }

    try {
        const hashedPwd = await bcrypt.hash(new_password, 10);

        const result = await prisma.Auth.update({
            where: {
                id: user_id
            },
            data: {
                password: hashedPwd,
            }
        });

        console.log(result);

        return res.status(200).json({
            status: 'password update successfully',
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'error',
        })
    }

}

const updatePasswordByAdmin = async (req, res) => {
    const { new_password, user_id } = req.body;
    const validation = validate.password_validation({ password: new_password, user_id });

    if (validation.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const foundAuth = await prisma.Auth.findUnique({
        where: {
            id: user_id
        }
    })

    if (!foundAuth) {
        return res.status(404).json({
            "message": `User :${user_id} does not exist...`
        });
    }

    try {
        const hashedPwd = await bcrypt.hash(new_password, 10);

        const result = await prisma.Auth.update({
            where: {
                id: user_id
            },
            data: {
                password: hashedPwd,
            }
        });

        console.log(result);

        return res.status(200).json({
            status: 'password update successfully',
        });
    } catch (error) {
        // console.log(error)
        return res.status(500).json({
            status: 'error',
        });
    }
}

const getUser = async (req, res) => {
    const user_id = req.user_id;

    const validation = validate.get_user_validation({ user_id });

    if (validation.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const foundUser = await prisma.User.findUnique({
        where: {
            user_id: user_id
        }
    });

    if (!foundUser) {
        return res.status(404).json({
            "message": `User :${user_id} does not exist...`
        })
    }

    return res.status(200).json({
        status: 'success',
        data: foundUser
    });
}

module.exports = {
    getAllEmpoyees,
    getEmployee,
    updateUserByUser,
    updatePasswordByUser,
    updatePasswordByAdmin,
    getUser

}