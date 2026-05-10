const mongoose = require('mongoose')

const BookingdbSchema = new mongoose.Schema({
    bookingId: String,
    title: String,
    selectedSeats: String,
    totalPrice: String,
    selectedDate: String,
    selectedTime: String,
    selectedMode: String,
    email:String,
    image:String
    // seats,totalPrice,selectedDate,selectedTime,selectedMode
})

 const BookingdbModel = mongoose.model("bookings",BookingdbSchema)
 module.exports = BookingdbModel