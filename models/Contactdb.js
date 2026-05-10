const mongoose = require('mongoose')

const ContactdbSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    issue: String,
    msg: String,
})

const ContactdbModel = mongoose.model("contacts",ContactdbSchema)
module.exports = ContactdbModel