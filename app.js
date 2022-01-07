// Module imports
const express = require("express"); // ! Task 1
const homeRoute = require("./routes/home.route");
const usersRoute = require("./routes/users.route");

// App
const app = express();

app.use("/", (req, res, next) => {
  console.log("Middleware 1");
  next();
});

app.use("/", (req, res, next) => {
  console.log("Middleware 2");
  // res.send("<h1>Hello world</h1>");
  next();
});

app.use("/", (req, res, next) => {
  homeRoute(req, res);
  next();
})
app.use("/users", (req, res, next) => {
  usersRoute.list(req, res);
  next();
})
app.use("/create-user", usersRoute.create)

app.listen(3000, () => console.log(`Server active on port: 3000`));
