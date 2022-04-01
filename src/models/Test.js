const mongoose = require('mongoose')


const TestSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    testdata: Array
}, {collection: "Test"})


module.exports = mongoose.model('Test', TestSchema)