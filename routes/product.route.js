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
const {isAuth} = require("../middlewares/auth.middleware");
const { ownsProduct, canDeleteProduct } = require("../middlewares/product.middleware");

// Routes
router.get("/add", isAuth, productAdd);
router.post("/create", isAuth, ownsProduct, productCreate);
router.get("/", productGetAll);
router.get("/:id", productGetOne);
router.get("/:id/edit", isAuth, ownsProduct, productEdit);
router.post("/:id/delete", isAuth, canDeleteProduct, productDeleteOne);

module.exports = router;
