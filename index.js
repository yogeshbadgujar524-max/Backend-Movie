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
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["https://frontend-movie-xeyb.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


// --------------------
// MongoDB Connection
// --------------------
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToMongoDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URL).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

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
    await connectToMongoDB();
    
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
    await connectToMongoDB(); 

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
    await connectToMongoDB();

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
    await connectToMongoDB();

    const payment = await PaymentModel.create(req.body);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- BOOKING
app.post("/booking", async (req, res) => {
  try {
    await connectToMongoDB();

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