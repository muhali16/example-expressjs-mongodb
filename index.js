const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

// models
const Product = require("./models/product");

// create mongodb connection
mongoose
  .connect("mongodb://127.0.0.1:27017/shop_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

// home page
app.get("/", (req, res) => {
  res.send("Hello World");
});

// show all products
app.get(
  "/products",
  wrapAsync(async (req, res) => {
    const { size } = req.query;
    let products = await Product.find();
    if (size) {
      products = await Product.find({ size });
    }

    if (size == "all") {
      products = await Product.find();
    }
    res.render("products/index", { products, size: size });
  })
);

// create product page
app.get("/products/create", (req, res) => {
  res.render("products/create");
});

// create product
app.post(
  "/products",
  wrapAsync(async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/products/${product._id}`);
  })
);

// show product
app.get(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/show", { product });
  })
);

// edit product page
app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
  })
);

// update product
app.put(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    res.redirect(`/products/${product._id}`);
  })
);

// delete product
app.delete(
  "/products/:id",
  wrapAsync(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  })
);

app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    err.status = 404;
    err.message = "Product not found";
  }
  if (err.name === "ValidationError") {
    err.status = 400;
    err.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong :(" } = err;
  res.status(status).send(message);
});

app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
