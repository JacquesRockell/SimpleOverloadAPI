//Express
const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')
const privateRoute = require('./routes/privateRoutes')


//Middleware
app.use(cors())
app.use(bodyParser.json())

//Import Local Routes
const authRoute = require('./routes/auth')
app.use('/api/auth', authRoute)

const workoutPlansRoute = require('./routes/workoutPlans')
app.use('/api/workoutPlans', workoutPlansRoute)

const usersRoute = require('./routes/users')
app.use('/api/user', privateRoute, usersRoute)
 
//Import Server Routes
// const authRoute = require('./routes/auth')
// app.use('/.netlify/functions/api/auth', authRoute)

// const workoutPlansRoute = require('./routes/workoutPlans')
// app.use('/.netlify/functions/api/workoutPlans', workoutPlansRoute)

// const usersRoute = require('./routes/users')
// app.use('/.netlify/functions/api/user', privateRoute, usersRoute)

//Connect
try {
    mongoose.connect(process.env.DB_CONNECTION, () => console.log("DB Connected"))
} catch(error) {
    console.log(error)
}

app.listen(8080)


//module.exports.handler = serverless(app)