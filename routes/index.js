// Module imports
const path = require("path");
const express = require("express");
const router = new express.Router();

// Util imports
const rootDir = require("../util/path.util");

// Routes
router.use("/users", require("./users.route"));
router.use(require("./home.route"));
router.use((req, res) =>
  res.status(404).sendFile(path.join(rootDir, "views", "users.html"))
);

module.exports = router;
