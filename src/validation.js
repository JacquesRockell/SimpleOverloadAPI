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

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.workoutPlanValidation = workoutPlanValidation