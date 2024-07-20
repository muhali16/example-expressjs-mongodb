const mongoose = require("mongoose");

const Product = require("./product");

const garmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama tidak boleh kosong"],
    unique: true,
  },
  contact: {
    type: String,
    required: [true, "Contact tidak boleh kosong"],
  },
  location: {
    type: String,
    required: [true, "Lokasi tidak boleh kosong"],
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

garmentSchema.post("findOneAndDelete", async function (garment) {
  if (garment.products.length) {
    await Product.deleteMany({ _id: { $in: garment.products } });
  }
});

const Garment = mongoose.model("Garment", garmentSchema);

module.exports = Garment;
