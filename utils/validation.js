const Joi = require('joi');

const register_vaidation = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().min(5).max(25).required(),
        password: Joi.string().required().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')),
        user_type: Joi.string().valid('doctor', 'examiner').required()
    })

    return schema.validate(data, { abortEarly: false });
}


const login_validation = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().min(5).max(25).required(),
        password: Joi.string().required().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
    })

    return schema.validate(data, { abortEarly: false });
}

const update_user_validation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().min(5).max(25).required(),
        lastname: Joi.string().min(5).max(25).required(),
        nic: Joi.string().required(),
        contact_no: Joi.string().required(),
        email: Joi.string().email().required(),
        birthday: Joi.date().required()
    })

    return schema.validate(data, { abortEarly: false });
}

module.exports = {
    register_vaidation,
    login_validation,
    update_user_validation
}