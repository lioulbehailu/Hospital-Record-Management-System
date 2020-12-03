const mongoose = require("mongoose");

// Items Schema
const DoctorsSchema = mongoose.Schema({
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
  address: {
    type: String,
    required: true,
  },
  // description: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = mongoose.model("Doctors", DoctorsSchema);
