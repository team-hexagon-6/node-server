// helpers
const bcrypt = require('bcrypt');
const prisma = require('../config/client');
const validate = require('../utils/validation');
const token = require('../utils/token');


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


        const [newAuth, newUser] = await prisma.$transaction([
            prisma.Auth.create({
                data: {
                    id: user_id,
                    password: hashedPwd,
                    user_type_id: userType.id
                },
            }),
            prisma.user.create({
                data: {
                    user_id: user_id,
                }
            })
        ])


        // const newUser = await prisma.Auth.create({
        //     data: {
        //         id: user_id,
        //         password: hashedPwd,
        //         user_type_id: userType.id
        //     },

        // })




        // const user = await prisma.Auth.create({
        //     data: {
        //         id: user_id,
        //         password: hashedPwd,

        //     },
        // });

        console.log("new auth", newAuth);
        console.log("new user", newUser);

        res.status(201).json({ 'message': `new user ${user_id} created ...!` });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "message": "Internal server error" });
    }
}

const handleLogin = async (req, res) => {
    const { user_id, password } = req.body;

    const validation = validate.login_validation({ user_id, password });

    if (validation.error) {
        return res.status(400).json({
            "message": validation.error.details
        });
    }

    const auth = await prisma.Auth.findUnique({
        where: {
            id: user_id
        }
    })

    if (!auth) {
        return res.status(404).json({ "message": `User :${user_id} does not exist...` });
    }

    if (!auth.active) {
        return res.status(400).json({ "message": `User :${user_id} is not active...` });
    }

    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
        return res.status(400).json({ "message": `User :${user_id} password is incorrect...` });
    }


    // console.log(foundUser)
    // if(foundUser.active)

    const authObject = await getAuthObject(auth);

    const access_token = token.getAccessToken(authObject);
    const refresh_token = token.getRefreshToken(authObject);

    const result = await prisma.Auth.update({
        where: {
            id: user_id
        },
        data: {
            refresh_token,
        }
    });

    console.log(result)

    res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    return res.status(200).json({
        "message": "Login successful",
        "access_token": access_token,
    });

}

const handleNewAccessToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(401).json({ "message": "Invalid token" });
    }

    const refresh_token = cookies.jwt;

    const auth = await prisma.Auth.findUnique({
        where: {
            refresh_token
        }
    });

    if (!auth) {
        return res.status(403).json({ "message": "Invalid token" });
    }

    const authObject = await getAuthObject(auth);

    jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log('decoded ', decoded);
            console.log('auth ', auth);
            if (err || auth.user_id !== decoded.user_id) {
                return res.status(403).json({ "message": "Invalid token" });
            }

            const access_token = token.getAccessToken(authObject);
            return res.status(200).json({
                "message": "Refresh token successful",
                "access_token": access_token,

            });
        })
}

const handleLogout = async (req, res) => {
    // const { user_id } = req.body;
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(204).json({ "message": "No token found" });
    }

    const refresh_token = cookies.jwt;

    const auth = await prisma.Auth.findUnique({
        where: {
            refresh_token
        }
    })

    if (!auth) {
        return res.status(404).json({ "message": `User does not exist...` });
    }

    const result = await prisma.Auth.update({
        where: {
            refresh_token
        },
        data: {
            refresh_token: null,
        }
    });

    console.log(result)

    res.clearCookie('jwt');
    return res.status(200).json({
        "message": "Logout successful",
    });
}

const getAuthObject = async (auth) => {
    const userType = await prisma.userType.findUnique({
        where: {
            id: auth.user_type_id
        }
    });

    return {
        id: auth.id,
        user_type: userType.name,
        active: auth.active,
        logged_at: auth.logged_at,
        complete_profile: auth.complete_profile,
    }
}


module.exports = {
    handleNewUser,
    handleLogin,
    handleLogout,
    handleNewAccessToken
}

