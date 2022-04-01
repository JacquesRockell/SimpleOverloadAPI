const express = require('express')
const router = express.Router()
const WorkoutPlan = require('../models/WorkoutPlan')
const { workoutPlanValidation } = require('../validation')
const privateRoute = require('./privateRoutes')

//Get all workout plans
router.get('/', async (req, res) => {
    const plans = await WorkoutPlan.find()
    res.send(plans)
}) 

router.post("/create", privateRoute, async (req, res) => {
    //Validate registration data
    const { error } = workoutPlanValidation(req.body)
    if(error != null) return res.status(400).send(error.details[0].message)

    const plan = new WorkoutPlan({
        title: req.body.title
    })

    try {
        const savedPlan = await plan.save()
        res.json(savedPlan)
    } catch(error) {
        res.status(400).send(error)
    }    
})


module.exports = router