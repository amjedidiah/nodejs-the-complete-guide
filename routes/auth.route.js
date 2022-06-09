// Module imports
const express = require("express");
const router = new express.Router();

// Controller imports
const { authGet, authPost, getLogout } = require("../controllers/auth.controller");

// Routes
router.get("/login", authGet);
router.post("/login", authPost);
router.get("/logout", getLogout);

module.exports = router;
