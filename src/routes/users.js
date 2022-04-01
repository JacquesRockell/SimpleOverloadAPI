const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/User')
const WorkoutPlan = require('../models/WorkoutPlan')
const { registerValidation, loginValidation, workoutPlanValidation } = require('../validation')
const privateRoute = require('./privateRoutes')


//Get logged in users info
router.get("/profile", async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
    } catch(error) {
        res.json({message: error})
    } 
})

//Ceate new workout plan
router.post("/createPlan", async (req, res) => {
    try {
        //Validate registration data
        const { error } = workoutPlanValidation(req.body)
        if(error != null) return res.status(400).send(error.details[0].message)

        const plan = new WorkoutPlan({
            title: req.body.title
        })
 
        //Add plan and add to Users workout plan array
        const user = await User.findByIdAndUpdate( 
            req.user._id, 
            { "$push": { "workoutPlans": plan }},
            { "new": true, "upsert": true },
        ) 

        res.send('Success')
    } catch(error) {
        res.status(400).send(error)
    }    
})


//Add Workout plan to users list
router.post("/addPlan/:planId", async (req, res) => {
    try {
        //Check if plan id is in a valid format
        if(mongoose.Types.ObjectId.isValid(req.params.planId) == false) return res.status(400).send('Invalid Id')
        //Check if the plan exists
        const workoutPlan = await WorkoutPlan.findOne({_id: req.params.planId})
        if(!workoutPlan) return res.status(400).send('Invalid Workout Plan')
        //Copy plan and add to Users workout plan array
        const user = await User.findByIdAndUpdate( 
            req.user._id, 
            { "$push": { "workoutPlans": {
                _id: new mongoose.Types.ObjectId(),
                title: workoutPlan.title,
                days: workoutPlan.days
            }}},
            { "new": true, "upsert": true },
        )    
        res.send('Success')
    } catch(error) {
        res.json({message: error})
    } 
})

 //Check for duplicates
// let error = false
// const userPlans = await User.findById(req.user._id)   
// userPlans.workoutPlans.forEach(planId => {
//     if(planId == req.params.planId) error = 'Plan already added'
// })     
// if(error) return res.status(400).send(error)

// const user = await User.findByIdAndUpdate( 
//     req.user._id, 
//     { "$push": { "workoutPlans": req.params.planId } },
//     { "new": true, "upsert": true },
// )

module.exports = router