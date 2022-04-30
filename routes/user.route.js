// Module imports
const express = require("express");
const router = new express.Router();

// Controller imports
const {
  userAdd,
  userCreate,
  userGetAll,
  userDeleteOne,
  userGetOne,
  userEdit
} = require("../controllers/user.controller");

// Routes
router.get("/add", userAdd);
router.post("/create", userCreate);
router.get("/", userGetAll);
router.get("/:id", userGetOne);
router.get("/:id/edit", userEdit);
router.post("/:id/delete", userDeleteOne);

module.exports = router;
