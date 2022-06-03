// Module imports
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// Environment variables
require("dotenv").config();
const { PORT, NODE_ENV, MONGODB_STRING } = process.env;
const port = PORT || 3000;
const isProd = NODE_ENV === "production";

// Route imports
const routes = require("./routes");

// Util imports
const rootDIR = require("./util/path.util");

// Mongoose Models
const User = require("./models/user.model");
const [userData] = require("./data/users")

// App
const app = express();

// Template Engine
app.set("view engine", "pug");
app.set("views", "views");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDIR, "public")));

// Routes definition
app.use(routes);

// Sync models
mongoose
  .connect(MONGODB_STRING)
  .then(() => User.findOne())
  .then((user) => {
    if(!user) {
      console.log("Creating new user with: ", userData);
      const newUser = new User(userData)
      newUser.save();
    }
  })
  .then(() =>
    app.listen(port, () => console.log(`Server active on port: ${port}`))
  )
  .catch((err) => console.log(err));
