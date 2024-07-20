const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

// models
const Product = require("./models/product");
const Garment = require("./models/garment");

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

app.get(
  "/garments",
  wrapAsync(async (req, res) => {
    const garments = await Garment.find();
    res.render("garments/index", { garments });
  })
);

app.get("/garments/create", (req, res) => {
  res.render("garments/create");
});

app.post(
  "/garments",
  wrapAsync(async (req, res) => {
    const garment = new Garment(req.body);
    await garment.save();
    res.redirect("/garments");
  })
);

app.get(
  "/garments/:garmentId",
  wrapAsync(async (req, res) => {
    const garment = await Garment.findById(req.params.garmentId).populate(
      "products"
    );
    res.render("garments/show", { garment });
  })
);

// delete garment
app.delete(
  "/garments/:garmentId",
  wrapAsync(async (req, res) => {
    await Garment.findByIdAndDelete(req.params.garmentId);
    res.redirect("/garments");
  })
);

// create product page
app.get("/garments/:garment_id/products/create", async (req, res) => {
  const { garment_id } = req.params;
  res.render("products/create", { garment_id });
});

// create product
app.post(
  "/garments/:garment_id/products",
  wrapAsync(async (req, res) => {
    const product = new Product(req.body);
    const garment = await Garment.findById(req.params.garment_id);
    garment.products.push(product);
    product.garment = garment;
    await garment.save();
    await product.save();
    res.redirect(`/products/${product._id}`);
  })
);

// show product
app.get(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("garment");
    console.log(product);
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
