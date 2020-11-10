const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Items Schema
const CartSchema = mongoose.Schema({
  cart: [{ type: ObjectId, ref: "Items" }],
});

module.exports = mongoose.model("Cart", CartSchema);
