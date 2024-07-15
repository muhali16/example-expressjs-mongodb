const mongoose = require("mongoose");
const Product = require("./models/product");

const products = [
  { name: "Kaos Polos", price: 50000, size: "S", color: "Merah" },
  { name: "Kemeja Flanel", price: 150000, size: "M", color: "Biru" },
  { name: "Jaket Hoodie", price: 250000, size: "L", color: "Hitam" },
  { name: "Celana Jeans", price: 200000, size: "XL", color: "Biru" },
  { name: "Sweater Rajut", price: 175000, size: "S", color: "Abu-abu" },
  { name: "Blazer Formal", price: 300000, size: "M", color: "Hitam" },
  { name: "Kaos Raglan", price: 60000, size: "L", color: "Putih" },
  { name: "Kemeja Batik", price: 180000, size: "XL", color: "Coklat" },
  { name: "Jaket Bomber", price: 275000, size: "S", color: "Hijau" },
  { name: "Celana Chino", price: 150000, size: "M", color: "Krem" },
  { name: "Sweater Hoodie", price: 220000, size: "L", color: "Merah" },
  { name: "Blazer Casual", price: 320000, size: "XL", color: "Biru" },
  { name: "Kaos V-neck", price: 55000, size: "S", color: "Hitam" },
  { name: "Kemeja Denim", price: 160000, size: "M", color: "Biru" },
  { name: "Jaket Parka", price: 280000, size: "L", color: "Hijau" },
  { name: "Celana Pendek", price: 120000, size: "XL", color: "Abu-abu" },
  { name: "Sweater Polos", price: 170000, size: "S", color: "Putih" },
  { name: "Blazer Slim Fit", price: 350000, size: "M", color: "Hitam" },
  { name: "Kaos Lengan Panjang", price: 70000, size: "L", color: "Merah" },
  { name: "Kemeja Kotak-kotak", price: 140000, size: "XL", color: "Biru" },
];

mongoose
  .connect("mongodb://127.0.0.1:27017/shop_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

Product.insertMany(products)
  .then((result) => {
    console.log("Success:", result);
  })
  .catch((err) => {
    console.log(err);
  });
