const Joi = require('joi');

const register_vaidation = (data) => {

    const schema = Joi.object({
        user_id: Joi.string().min(5).max(25).required(),
        password: Joi.string().required().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')),
        user_type: Joi.string().valid('doctor', 'examiner').required()
    })

    return schema.validate(data, { abortEarly: false });
}


module.exports = {
    register_vaidation
}