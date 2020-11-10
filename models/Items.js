const mongoose = require("mongoose");

// Items Schema
const ItemsSchema = mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Items", ItemsSchema);
