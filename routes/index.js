// Module imports
const express = require("express");
const router = new express.Router();

const User = require("../models/user.model");
const [{email}] = require("../data/users")

// Routes
const homeRoute = require("./home.route");
const userRoute = require("./user.route");
const productRoute = require("./product.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");
const notFoundRoute = (req, res) =>
  res.status(404).render("404", { docTitle: "Not Found", path: "/404" });

router.use((req, res, next) =>
  User.findOne({email})
    .then((user) => {
      console.log(`Setting default user as `, user)
      req.user = user;
      next();
    })
    .catch((err) => console.log(err))
);
router.use("/cart", cartRoute);
router.use("/orders", orderRoute);
router.use("/products", productRoute);
router.use("/users", userRoute);
router.get("/", homeRoute);
router.use("/", notFoundRoute);

module.exports = router;
