const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    transactionId: String,
    Payment: String, 
    totalPrice: String,
    email:String
})

const PaymentModel = mongoose.model("payment",PaymentSchema)
module.exports = PaymentModel