const mongoose = require('mongoose')

const UserdbSchema = new mongoose.Schema({
    userid: String,
    fname: String,
    lname: String,
    email: String,
    phone: String,
    password: String
})

const UserdbModel = mongoose.model("users",UserdbSchema)
module.exports = UserdbModel