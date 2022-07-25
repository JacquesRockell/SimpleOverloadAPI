const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/User')
const { Set, Day, WorkoutPlan } = require('../models/WorkoutPlan')
const { setValidation, workoutPlanValidation, dayValidation } = require('../validation')
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
router.post("/plans", async (req, res) => { 
    try {
        //Validate Workout Plan data
        const { error } = workoutPlanValidation(req.body)
        if(error != null) return res.status(400).send(error.details)
        
        const plan = new WorkoutPlan({
            title: req.body.title
        })

        const user = await User.findById(req.user._id)  
        user.workoutPlans.push(plan)

        user.markModified('workoutPlans')
        await user.save()

        res.status(200).send('Successfully added plan!')
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
router.delete("/plans/:planIndex", async (req, res) => {
    try {         
        const user = await User.findById(req.user._id)  

        user.workoutPlans.splice(req.params.planIndex, 1)

        await user.save()
        res.status(200).send('Successfully deleted plan!')
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
router.post("/plans/:planIndex/days", async (req, res) => {
    try {
        //Validate registration data
        const { error } = dayValidation(req.body)
        if(error != null) return res.status(400).send(error.details)
        
        const day = new Day({
            name: req.body.name,
        })

        const user = await User.findById(req.user._id)  
        user.workoutPlans[req.params.planIndex].days.push(day)

        user.markModified('workoutPlans')
        await user.save()

        res.status(200).send('Successfully added day!')
    } catch(error) {
        res.status(400).send(error)
    }    
})

//Rename Day via id
router.put("/plans/:planIndex/days/:id", async (req, res) => {
    try {         
        //Find User and day array
        const user = await User.findById(req.user._id)  
        const dayArr = user.workoutPlans[req.params.planIndex].days
        
        let dayIndex = dayArr.findIndex(ob => { return ob._id == req.params.id })
        if(dayIndex == -1) return res.status(400).send('Day not found!')

        user.workoutPlans[req.params.planIndex].days[dayIndex].name = req.body.name

        user.markModified('workoutPlans')
        await user.save()

        res.status(200).send('Successfully renamed day!')
    } catch(error) {
        res.status(400).send(error)
    }    
})

//Delete Day via id
router.delete("/plans/:planIndex/days/:id", async (req, res) => {
    try {         
        //Find User and day array
        const user = await User.findById(req.user._id)  
        const dayArr = user.workoutPlans[req.params.planIndex].days

        let dayIndex = dayArr.findIndex(ob => { return ob._id == req.params.id })
        if(dayIndex == -1) return res.status(400).send('Day not found!')

        user.workoutPlans[req.params.planIndex].days.splice(dayIndex, 1)

        user.markModified('workoutPlans')
        await user.save()

        res.status(200).send('Successfully deleted day!')
    } catch(error) {
        res.status(400).send(error)
    }    
})

//Add Set via index
router.post("/plans/:planIndex/days/:dayIndex/add/:amount", async (req, res) => {
    try {
        //Validate set data
        const { error } = setValidation(req.body)
        if(error != null) return res.status(400).send(error.details)
        //Find user and sets array
        const user = await User.findById(req.user._id)  
        const setsArr = user.workoutPlans[req.params.planIndex].days[req.params.dayIndex].sets

        let order = 0
        for(i = req.params.amount; i > 0; i--){
            setsArr.forEach(set => {
                if(set.order >= order) order = set.order + 1
            })

            const set = new Set({
                name: req.body.name,
                order: order,
                rpe: req.body.rpe,
                repRange: req.body.repRange,
                weight: req.body.weight
            })    
        
            user.workoutPlans[req.params.planIndex].days[req.params.dayIndex].sets.push(set)
        }

        user.markModified('workoutPlans')
        await user.save()

        res.status(200).send('Successfully added set!')
    } catch(error) {
        res.status(400).send(error)
    }    
})


//Delete set via id
router.delete("/plans/:planIndex/days/:dayIndex/sets/:id", async (req, res) => {
    try {
        //Check if set id is in a valid format
        if(mongoose.Types.ObjectId.isValid(req.params.id) == false) return res.status(400).send('Invalid Id')
        //Find user and sets array
        const user = await User.findById(req.user._id)  
        const setsArr = user.workoutPlans[req.params.planIndex].days[req.params.dayIndex].sets
        //Find index of set with id
        let setIndex = setsArr.findIndex(ob => { return ob._id == req.params.id })
        if(setIndex === -1) return res.status(400).send('Set not found')

        user.workoutPlans[req.params.planIndex].days[req.params.dayIndex].sets.splice(setIndex, 1)
        user.markModified('workoutPlans')
        await user.save()

        res.status(200).send('Successfully deleted set!')
    } catch(error) {
        res.status(400).send(error)
    }    
})

//Edit set order via index
router.put("/plans/:planIndex/days/:dayIndex/reorderSets", async (req, res) => {
    try {
        //Find user and sets array
        const user = await User.findById(req.user._id)  
        const setsArr = user.workoutPlans[req.params.planIndex].days[req.params.dayIndex].sets

        const movedSet = setsArr[req.body.sourceIndex]
        user.workoutPlans[req.params.planIndex].days[req.params.dayIndex].sets.splice(req.body.sourceIndex, 1)
        user.workoutPlans[req.params.planIndex].days[req.params.dayIndex].sets.splice(req.body.destinationIndex, 0, movedSet)
        
        user.markModified('workoutPlans')
        await user.save()
        res.status(200).send('Successfully reordered sets!')
    } catch(error) {
        res.status(400).send(error)
    }    
})

//Edit Set via id
router.put("/plans/:planIndex/days/:dayIndex/sets/:setId", async (req, res) => {
    try {
        //Check if id is in a valid format
        if(mongoose.Types.ObjectId.isValid(req.params.setId) == false) return res.status(400).send('Invalid Id')
        //Find user and sets array
        const user = await User.findById(req.user._id)  
        const setsArr = user.workoutPlans[req.params.planIndex].days[req.params.dayIndex].sets

        let setIndex = setsArr.findIndex(set => { return set._id == req.params.setId})
        let set = setsArr[setIndex]
        set.rpe = req.body.rpe
        set.repRange = req.body.repRange
        set.weight = req.body.weight
        user.workoutPlans[req.params.planIndex].days[req.params.dayIndex].sets.splice(setIndex, 1, set)

        user.markModified('workoutPlans')
        await user.save()
        res.status(200).send('Successfully edited set!')
    } catch(error) {
        res.status(400).send(error)
    }    
})

module.exports = router