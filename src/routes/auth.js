const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')

//Routes
router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch(error) {
        res.json({message: error})
    } 
})

router.post("/register", async (req, res) => {
    //Validate registration data
    const { error } = registerValidation(req.body)
    if(error != null) return res.status(400).send(error.details[0].message)
    //Check for duplicates
    const doesExist = await User.findOne({username: req.body.username})
    if(doesExist != null) return res.status(400).send('Username has been taken.')
    
    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        username: req.body.username,
        password: hashedPassword 
    })

    try {
        const savedUser = await user.save()
        res.json({
            registered: true,
            _id: user._id    
        })
    } catch(error) {
        res.status(400).send(error)
    }    
})

router.post("/login", async (req, res) => {
    //Validate login data
    const { error } = loginValidation(req.body)
    if(error != null) return res.status(400).send(error.details[0].message)

    //Check for valid username
    const user = await User.findOne({username: req.body.username})
    if(!user) return res.status(400).send({error: 'Invalid username'})

    //Check if password is valid
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid password')

    //Creat jtw token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})


module.exports = router