// Module imports
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrfProtection = require('csurf');
const flash = require('connect-flash');

// Environment variables
require("dotenv").config();
const { PORT, NODE_ENV, MONGODB_STRING } = process.env;
const port = PORT || 3000;
const isProd = NODE_ENV === "production";

// Route imports
const routes = require("./routes");

// Util imports
const rootDIR = require("./util/path.util");

// App
const app = express();

// Template Engine
app.set("view engine", "pug");
app.set("views", "views");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDIR, "public")));
app.use(
  session({
    secret: "node-js-course",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
    },
    store: new MongoDBStore({
      uri: MONGODB_STRING,
      collection: "sessions",
    })
  })
)
app.use(csrfProtection());
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.errorMessage = req.flash("error");
  next();
});

// Routes definition
app.use(routes);

// Sync models
mongoose
  .connect(MONGODB_STRING)
  .then(() =>
    app.listen(port, () => console.log(`Server active on port: ${port}`))
  )
  .catch((err) => console.log(err));
