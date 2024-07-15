const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
    enum: ["S", "M", "L", "XL"],
  },
  color: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
