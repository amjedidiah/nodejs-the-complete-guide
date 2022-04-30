// Module imports
const express = require("express");
const router = new express.Router();

// Controller imports
const {
  postOrder,
  getOrders,
  deleteOrder
} = require("../controllers/order.controller");

// Routes
router.post("/create", postOrder);
router.get("/", getOrders);
router.post("/:id/delete", deleteOrder);

module.exports = router;
