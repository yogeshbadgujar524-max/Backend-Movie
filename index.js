const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const UserdbModel = require("./models/Userdb");
const ContactdbModel = require("./models/Contactdb");
const BookingdbModel = require("./models/Bookingdb");
const PaymentModel = require("./models/Payment");


const app = express();

app.use(express.json());
app.use(cors());

// --------------------
// MongoDB Connection
// --------------------
let isConnected = false;

console.log(process.env.MONGO_URL);
async function connectToMongoDB() {
  try {
    if (mongoose.connection.readyState === 1) return;

    await mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("MongoDB Connected Successfully");

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
  }
}
// Connect ONCE (important for Vercel)
connectToMongoDB();

// --------------------
// ROUTES
// --------------------

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// -------------------- LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserdbModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Wrong password" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- REGISTER
app.post("/register", async (req, res) => {
  try {
    console.log(req.body); //  debug incoming data

    const user = await UserdbModel.create(req.body);
    res.json(user);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/register", async (req, res) => {
  try {
    const users = await UserdbModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- CONTACT
app.post("/contact", async (req, res) => {
  try {
    const contact = await ContactdbModel.create(req.body);
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/contact", async (req, res) => {
  try {
    const contacts = await ContactdbModel.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- PAYMENT
app.post("/payment", async (req, res) => {
  try {
    const payment = await PaymentModel.create(req.body);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- BOOKING
app.post("/booking", async (req, res) => {
  try {
    const booking = await BookingdbModel.create(req.body);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/booking", async (req, res) => {
  try {
    const bookings = await BookingdbModel.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get booking by user email
app.get("/booking/user/:email", async (req, res) => {
  try {
    const bookings = await BookingdbModel.find({
      email: req.params.email,
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete booking
app.delete("/booking/:bookingId", async (req, res) => {
  try {
    const deleted = await BookingdbModel.findOneAndDelete({
      bookingId: req.params.bookingId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- USER UPDATE / DELETE
app.put("/register/:id", async (req, res) => {
  try {
    const updated = await UserdbModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/register/:id", async (req, res) => {
  try {
    await UserdbModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- EXPORT (Vercel required)
module.exports = app;