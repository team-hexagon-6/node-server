const jwt = require('jsonwebtoken');


const getAccessToken = (auth) => {
    console.log("auth : ", auth)
    return jwt.sign(
        {
            "user_id": auth.id,
            "user_type": auth.user_type,
            "logged_at": auth.logged_at,
            "active": auth.active,
            "profile_complete": auth.complete_profile,
            "role": auth.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
    )
}

const getRefreshToken = (auth) => {
    return jwt.sign(
        { "user_id": auth.user_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
}

module.exports = {
    getAccessToken,
    getRefreshToken
}