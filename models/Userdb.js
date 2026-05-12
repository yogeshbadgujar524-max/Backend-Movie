const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userid: String,
  fname: String,
  lname: String,
  email: String,
  phone: String,
  password: String
});

module.exports = mongoose.model("User", UserSchema);