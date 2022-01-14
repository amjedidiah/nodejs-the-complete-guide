// Module imports
const express = require("express");
const router = new express.Router();

// Routes
router.use("/users", require("./users.route").routes);
router.get("/", require("./home.route"));
router.use("/", (req, res) =>
  res.status(404).render("404", { docTitle: "Not Found", path: "/404" })
);

module.exports = router;
