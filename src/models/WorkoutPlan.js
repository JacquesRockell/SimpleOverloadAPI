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
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    order: {
        type: Number,
        required: true
    },
    sets: [[setSchema]]

}, {collection: "Users"})

const workoutPlanSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    days: [[daySchema]]
}, {collection: "Workout_Plans"})



const Day = mongoose.model('Day', daySchema)
const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema)
module.exports = { Day, WorkoutPlan }