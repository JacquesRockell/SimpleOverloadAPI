const mongoose = require('mongoose')


const setSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    order: {
        type: Number,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    rpe: {
        type: Number,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    repRange: {
        type: Array,
        required: true,
        minLength: 2,
        maxLength: 2,
    }
})

const daySchema = mongoose.Schema({
    day: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    order: Number,
    sets: [[setSchema]]

})

const workoutPlanSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    days: [[daySchema]]
}, {collection: "Workout_Plans"})





module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema)