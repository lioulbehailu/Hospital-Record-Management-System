const mongoose = require("mongoose");

// User Schema
const PatientsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  grandFatherName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  dayOfBirth: {
    type: String,
    required: true,
  },
  monthOfBirth: {
    type: String,
    required: true,
  },
  yearOfBirth: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  history: [
    {
      date: { type: String },
      test: { type: String },
      description: { type: String },
    },
  ],
});

module.exports = mongoose.model("Patients", PatientsSchema);
