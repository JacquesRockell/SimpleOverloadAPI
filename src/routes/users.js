const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/User')
const { Day, WorkoutPlan } = require('../models/WorkoutPlan')
const { registerValidation, loginValidation, workoutPlanValidation, dayValidation } = require('../validation')
const privateRoute = require('./privateRoutes')


//Get logged in users info
router.get("/profile", async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.send(user)
    } catch(error) {
        res.json({message: error})
    } 
})

//Ceate new workout plan
router.post("/createPlan", async (req, res) => {
    try {
        //Validate Workout Plan data
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

//Rename Plan via index
router.post("/renamePlan/:index", async (req, res) => {
    try {         
        const user = await User.findById(req.user._id)  
        user.workoutPlans[req.params.index].title = req.body.title
        user.markModified('workoutPlans')
        await user.save()
        res.status(200).send('Success')
    } catch(error) {
        res.status(400).send(error)
    }    
})

//Delete Plan via index
router.post("/deletePlan/:index", async (req, res) => {
    try {         
        const user = await User.findById(req.user._id)  
        user.workoutPlans.splice(req.params.index, 1)
        const savedUser = await user.save()
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

//Add day to plan
router.post("/plan/:index/addDay", async (req, res) => {
    try {
        //Validate registration data
        const { error } = dayValidation(req.body)
        if(error != null) return res.status(400).send(error.details)

        const user = await User.findById(req.user._id)  
        const daysArr = user.workoutPlans[req.params.index].days
        
        let order = 0
        daysArr.forEach(day => {
            if(day.order >= order) order = day.order + 1
        })

        const day = new Day({
            name: req.body.name,
            order: order
        })    

        user.workoutPlans[req.params.index].days.push(day)
        user.markModified('workoutPlans')

        await user.save()

        res.status(200).send('Success')
    } catch(error) {
        res.status(400).send(error)
    }    
})

//Rename Day via index
router.post("/plan/:PI/renameDay/:DI", async (req, res) => {
    try {         
        const user = await User.findById(req.user._id)  
        user.workoutPlans[req.params.PI].days[req.params.DI].name = req.body.name
        user.markModified('workoutPlans')
        await user.save()
        res.status(200).send('Success')
    } catch(error) {
        res.status(400).send(error)
    }    
})

//Delete Day via index
router.post("/plan/:PI/deleteDay/:DI", async (req, res) => {
    try {         
        const user = await User.findById(req.user._id)  
        user.workoutPlans[req.params.PI].days.splice(req.params.DI, 1)
        user.markModified('workoutPlans')
        await user.save()
        res.status(200).send('Success')
    } catch(error) {
        res.status(400).send(error)
    }    
})

module.exports = router