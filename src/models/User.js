const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 1024,
    },
    workoutPlans: Array
}, {collection: "Users"})


module.exports = mongoose.model('User', userSchema)