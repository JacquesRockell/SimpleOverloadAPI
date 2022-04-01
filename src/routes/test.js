const express = require('express')
const router = express.Router()
const Test = require('../models/Test')

//Routes
///GET
////GET ALL
router.get("/", async (req, res) => {
    try {
        const tests = await Test.find()
        res.json(tests)
    } catch(error) {
        res.json({message: error})
    } 
})
////GET BY ID
router.get("/id/:testId", async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId)
        res.json(test)
    } catch(error) {
        res.json({message: error})
    } 
})
////GET ALL BY NAME
router.get("/user/:username", async (req, res) => {
    try {
        const test = await Test.find({ username: req.params.username})
        res.json(test)
    } catch(error) {
        res.json({message: error})
    } 
})

///POST
router.post("/", async (req, res) => {
    const test = new Test({
        username: req.body.username,
        testdata: req.body.testdata
    })

    try {
        const savedTest = await Test.save()
        res.json(savedTest)
    } catch(error) {
        res.json({message: error})
    } 
})

///UPDATE
router.patch("/update/:testId", async (req, res) => {
    try {
        const updatedTest = await Test.updateOne({_id: req.params.testId}, {
            $set: {
                username: req.body.username,
                testdata: req.body.testdata
            }
        })
        res.json(updatedTest)
    } catch(error) {
        res.json({message: error})
    }
})

///DELETE
router.delete("/delete/:testId", async (req, res) => {
    try {
        const deletedTest = await Test.remove({_id: req.params.testId})
        res.json(deletedTest)
    } catch(error) {
        res.json({message: error})
    } 
})



module.exports = router