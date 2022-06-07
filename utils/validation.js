// import DateExtension from '@joi/date';
// import * as JoiImport from 'joi';
// const Joi = JoiImport.;
const { text } = require('express');
const Joi = require('joi').extend(require('@joi/date'));

const register_vaidation = (data) => {
    const schema = Joi.object({
        user_id: user_id_validation_joi_object(),
        user_type: Joi.string().max(10).required()
            .messages({
                "string.empty": "Field should not be empty!",
                "string.max": `Field should have at most {#limit} characters!`,
                "string.required": "Field is required!"
            }),
    })
    return schema.validate(data, { abortEarly: false });
}


const login_validation = (data) => {
    const schema = Joi.object({
        user_id: user_id_validation_joi_object(),
        password: password_joi_object(),
    })

    return schema.validate(data, { abortEarly: false });
}

const update_user_validation = (data) => {
    const schema = profile_validate_joi_object();
    return schema.validate(data, { abortEarly: false });
}

const update_password_validation = (data) => {
    const schema = Joi.object({
        new_password: password_joi_object(),
        old_password: password_joi_object(),
        user_id: user_id_validation_joi_object(),
    })

    return schema.validate(data, { abortEarly: false });
}

const password_validation = (data) => {
    const schema = Joi.object({
        password: password_joi_object(),
        user_id: user_id_validation_joi_object(),
    })

    return schema.validate(data, { abortEarly: false });
}

const get_user_validation = (data) => {
    const schema = Joi.object({
        user_id: user_id_validation_joi_object(),
    })

    return schema.validate(data, { abortEarly: false });
}

// patient_id, test_id ,image_string,test_type
const do_test_validation = (data) => {
    const schema = Joi.object({
        patient_id: patient_id_validation_joi_object(),
        test_id: test_id_validation_joi_object(),
        image_string: Joi.string().required()
            .messages({
                "string.empty": "Field should not be empty!",
                "string.required": "Field is required!"
            }),
        test_type: Joi.string().required()
            .messages({
                "string.empty": "Field should not be empty!",
                "string.required": "Field is required!"
            })
    })

    return schema.validate(data, { abortEarly: false });
}


const test_id_validation = data => {
    const schema = Joi.object({
        test_id: test_id_validation_joi_object(),
    })

    return schema.validate(data, { abortEarly: false });
}

const skip_take_validation = (data) => {
    const schema = Joi.object({
        skip: Joi.number().required()
            .messages({
                "number.empty": "Field should not be empty!",
                "number.required": "Field is required!"
            }),
        take: Joi.number().required()
            .messages({
                "number.empty": "Field should not be empty!",
                "number.required": "Field is required!"
            })
    })

    return schema.validate(data, { abortEarly: false });
}

const get_test_record_validation = (data) => {
    const schema = Joi.object({
        test_record_id: Joi.number().required()
            .messages({
                "number.empty": "Field should not be empty!",
                "number.required": "Field is required!"
            })
    })

    return schema.validate(data, { abortEarly: false });
}

const new_patient_validation = (data) => {
    const schema = profile_validate_joi_object();
    return schema.validate(data, { abortEarly: false });
}

const patient_id_validation = (data) => {
    const schema = Joi.object({
        patient_id: patient_id_validation_joi_object(),
    })

    return schema.validate(data, { abortEarly: false });
}

const update_patient_validation = (data) => {
    const schema = profile_validate_joi_object();
    return schema.validate(data, { abortEarly: false });
}


const confirm_test_validation = (data) => {
    const schema = Joi.object({
        test_id: test_id_validation_joi_object(),
        patient_id: patient_id_validation_joi_object(),
    })

    return schema.validate(data, { abortEarly: false });
}

const user_id_validation = (data) => {
    const schema = Joi.object({
        user_id: user_id_validation_joi_object(),
    })

    return schema.validate(data, { abortEarly: false });
}


const profile_validate_joi_object=() =>{
    return Joi.object({firstname: Joi.string().required().pattern(new RegExp('^[A-Z][a-z0-9_-]{2,}$'))
                .messages({
                    "string.empty": "Field should not be empty!",
                    "string.required": "Field is required!",
                    "string.pattern.base": "First letter must be a Capital"
                }),
            lastname: Joi.string().required().pattern(new RegExp('^[A-Z][a-z0-9_-]{2,}$'))
                .messages({
                    "string.empty": "Field should not be empty!",
                    "string.required": "Field is required!",
                    "string.pattern.base": "First letter must be a Capital"
                }),
            nic: Joi.string().alphanum().required().pattern(new RegExp('^([0-9]{9}[X|V]|[0-9]{12})$'))
                .messages({
                    "string.empty": "Field should not be empty!",
                    "string.required": "Field is required!",
                    "string.pattern.base": "Invalid format",
                    "string.alphanum": "Field should only consist of letters and numbers"
                }),
            contact_no: Joi.string().required().pattern(new RegExp('^(?:7|0|(?:\\+94))[0-9]{9,10}$'))
                .messages({
                    "string.empty": "Field should not be empty!",
                    "string.required": "Field is required!",
                    "string.pattern.base": "Invalid format"
                }),
            email: Joi.string().email({minDomainSegments: 2,tlds: { allow: ["com", "net"]}}).required()
                .messages({
                    "string.empty": "Field should not be empty!",
                    "string.required": "Field is required!",
                    "string.email": "Enter a valid email address!"
                }),

            birthday: Joi.date().format('MM-DD-YYYY').required().max('now').min('01-01-1900')
                .messages({
                    "date.format": "Date format should be MM-DD-YYYY",
                    "date.required": "Field is required!",
                    "date.max": "Date cannot be greater that current date",
                    "date.min": "Date should be greater than 01-01-1990"
                }),
    })
}

const user_id_validation_joi_object=() => {
    return Joi.string().length(10).required().pattern(new RegExp('^[0-9]{9}[A-Z]$'))
            .messages({
                "string.empty": "ID should not be empty!",
                "string.length": `ID should be exactly {#limit} characters!`,
                "string.required": "ID is required!",
                "string.pattern.base": "ID form invalid... Ex:- 123456789D"
            })
}

const patient_id_validation_joi_object=() => {
    return Joi.string().min(5).max(25).required()
        .messages({
            "string.empty": "Field should not be empty!",
            "string.min": `Field should have at least {#limit} characters!`,
            "string.max": `Field should have at most {#limit} characters!`,
            "string.required": "Field is required!"
        })
}

const test_id_validation_joi_object=() => {
    return Joi.string().min(5).max(192).required()
        .messages({
            "string.empty": "Field should not be empty!",
            "string.min": `Field should have at least {#limit} characters!`,
            "string.max": `Field should have at most {#limit} characters!`,
            "string.required": "Field is required!"
        })
}

const password_joi_object = () => {

    return Joi.string()
        .required()
        .min(8)
        .max(25)
        .custom(custom_password)
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.min": `Field should have at least {#limit} characters!`,
            "string.max": `Field should have at most {#limit} characters!`,
        });
}

const custom_password = (value, helper) => {
    if (value.search(/[A-Z]/) < 0) {
        return helper.message("Password must contain at least one uppercase letter")
    } else if (value.search(/[a-z]/) < 0) {
        return helper.message("Password must contain at least one lowercase letter")
    } else if (value.search(/[0-9]/i) < 0) {
        return helper.message("Password must contain at least one number")
    } else if (value.search(/[#?!@$%^&*-]/i) < 0) {
        return helper.message("Password must contain at least one special character")
    } else {
        return true
    }
}


module.exports = {
    register_vaidation,
    login_validation,
    update_user_validation,
    update_password_validation,
    password_validation,
    get_user_validation,
    do_test_validation,
    test_id_validation,
    skip_take_validation,
    get_test_record_validation,
    new_patient_validation,
    patient_id_validation,
    confirm_test_validation,
    user_id_validation,
    update_patient_validation

}