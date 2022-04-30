// Module imports
const express = require("express");
const router = new express.Router();

// Controller imports
const {
  getCart,
  postCart,
  postCartDeleteProduct
} = require("../controllers/cart.controller");

// Routes
router.post("/add", postCart);
router.get("/", getCart);
router.post("/delete", postCartDeleteProduct);

module.exports = router;
