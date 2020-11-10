const mongoose = require("mongoose");

// User Schema
const UserSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  purchasedList: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
