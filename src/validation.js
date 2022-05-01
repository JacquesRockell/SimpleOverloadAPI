const Joi = require('@hapi/joi')

//Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(data)
}

const workoutPlanValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(1).required()
    })

    return schema.validate(data)
}

const dayValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required()
    })

    return schema.validate(data)
}

const setValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        rpe: Joi.number().max(10),
        repRange: Joi.array().min(2).required(),
        weight: Joi.number().max(5000),
    })

    return schema.validate(data)
}

module.exports.setValidation = setValidation
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.workoutPlanValidation = workoutPlanValidation
module.exports.dayValidation = dayValidation