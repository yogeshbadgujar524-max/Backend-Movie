const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const UserdbModel = require('./models/Userdb')
const ContactdbModel = require('./models/Contactdb')
const BookingdbModel = require('./models/Bookingdb')
const PaymentModel = require('./models/Payment')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())


let isConnected = false;

async function connectToMongoDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);

    isConnected = true;

    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error in connection", err);
  }
}


app.use(async (req, res, next) => {
  await connectToMongoDB();
  next();
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  UserdbModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json(user); // send full user
        } else {
          res.json("password is incorrect");
        }
      } else {
        res.json("No record existed");
      }
    });
});

app.post('/register' , (req,res)=>{
    UserdbModel.create(req.body)
    .then(users => res.json(users))
    .catch(error => res.json(error))
})

app.get("/register", async (req, res) => {
  try {
    const users = await UserdbModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post('/contact',(req,res)=>{
    ContactdbModel.create(req.body)
    .then(contacts => res.json(contacts))
    .catch(error => res.json(error))
})

app.get("/contact", async (req, res) => {
  try {
    const contact = await ContactdbModel.find();
    res.json(contact);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/Payment',(req,res)=>{
    PaymentModel.create(req.body)
    .then(payment => res.json(payment))
    .catch(error => res.json(error))
})

app.post('/booking',(req,res)=>{
    BookingdbModel.create(req.body)
    .then(bookings => res.json(bookings))
    .catch(error => res.json(error))
})

app.get("/booking", async (req, res) => {
  try {
    const booking = await BookingdbModel.find();
    res.json(booking);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete movie by ID
app.delete("/booking/:bookingId", async (req, res) => {
  try {
    const deletedBooking = await BookingdbModel.findOneAndDelete({ bookingId: req.params.bookingId });
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/booking/user/:email", async (req, res) => {
  try {
    const bookings = await BookingdbModel.find({ email: req.params.email });
    res.json(bookings);
  } catch (error) {
    res.status(500).json(error);
  }
});




// Update user by ID
app.put("/register/:id", async (req, res) => {
  try {
    const updatedUser = await UserdbModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user by ID
app.delete("/register/:id", async (req, res) => {
  try {
    await UserdbModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.listen(3001,()=>{
//     console.log("Server is running");
// })

module.exports = app