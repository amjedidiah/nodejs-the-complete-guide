// Module imports
const express = require("express");
const router = new express.Router();

// Controller imports
const {
  productAdd,
  productCreate,
  productGetAll,
  productDeleteOne,
  productGetOne,
  productEdit,
} = require("../controllers/product.controller");

// Routes
router.get("/add", productAdd);
router.post("/create", productCreate);
router.get("/", productGetAll);
router.get("/:id", productGetOne);
router.get("/:id/edit", productEdit);
router.post("/:id/delete", productDeleteOne);

module.exports = router;
