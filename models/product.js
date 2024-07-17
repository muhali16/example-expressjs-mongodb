const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Masukan nama produk anda."],
  },
  price: {
    type: Number,
    required: [true, "Masukan harga produk anda."],
  },
  size: {
    type: String,
    required: [true, "Masukan ukuran produk anda."],
    enum: ["S", "M", "L", "XL"],
  },
  color: {
    type: String,
    required: [true, "Masukan warna produk anda."],
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
