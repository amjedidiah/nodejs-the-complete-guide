// Module imports
const express = require("express");
const router = new express.Router();

// Controller imports
const { getLogin, postLogin, getRegister, postRegister, postLogout } = require("../controllers/auth.controller");
const {isUnAuth, isAuth} = require("../middlewares/auth.middleware");

// Routes
router.get("/login", isUnAuth, getLogin);
router.post("/login", isUnAuth, postLogin);
router.get("/register", isUnAuth, getRegister);
router.post("/register", isUnAuth, postRegister);
router.post("/logout", isAuth, postLogout);

module.exports = router;
