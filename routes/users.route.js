// Module imports
const express = require("express");
const router = new express.Router();

const USERS = [];

router.post("/create", ({ body }, res) => {
  if (body.username) {
    USERS.push({ name: body.username });
    res.redirect("/users");
  } else res.redirect("/");
});

router.get("/", (req, res) => {
  console.log(USERS);
  res.render("users", { docTitle: "Users", path: "/users", users: USERS });
});

exports.routes = router;
exports.USERS = USERS;
