// Module imports
const path = require("path");
const express = require("express");
const router = new express.Router();

// Util imports
const rootDir = require("../util/path.util");

router.post("/create", ({ body }, res) => {
  console.log(body);
  res.redirect("/");
});

router.get("/", (req, res) =>
  res.sendFile(path.join(rootDir, "views", "users.html"))
);

module.exports = router;