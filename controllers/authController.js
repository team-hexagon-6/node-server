// helpers
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../database/client');
const validate = require('../utils/validation');


// functions 
const handleNewUser = async (req, res) => {
    const { employee_id: user_id, employee_type: user_type, password } = req.body;

    const result = validate.register_vaidation({ user_id, user_type, password });
    if (result?.error) {
        return res.status(400).json({
            "message": result.error.details
        });
    }

    const duplicateUser = await prisma.Auth.findUnique({
        where: {
            id: user_id
        },
    });

    try {

        if (duplicateUser) {
            return res.status(409).json({ "message": `User :${user_id} already exists...` });
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const userType = await prisma.userType.findUnique({
            where: {
                name: user_type
            }
        });

        if (!userType) {
            return res.status(400).json({ "message": `User type :${user_type} does not exist...` });
        }
        // console.log("user type", userType);

        const newUser = await prisma.Auth.create({
            data: {
                id: user_id,
                password: hashedPwd,
                user_type_id: userType.id
            },

        })



        // const user = await prisma.Auth.create({
        //     data: {
        //         id: user_id,
        //         password: hashedPwd,

        //     },
        // });
        console.log("new user", newUser);

        res.status(201).json({ 'message': `new user ${user_id} created ...!` });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "message": "Internal server error" });
    }
}



module.exports = {
    handleNewUser
}