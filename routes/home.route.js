// Module imports
// const path = require("path");
const express = require("express");
const router = new express.Router();

// Util imports
// const rootDir = require("../util/path.util");

router.use("/", (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "home.html"))
  res.render("home", { docTitle: "Home", path: "/" });
});

module.exports = router;
