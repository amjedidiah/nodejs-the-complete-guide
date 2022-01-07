const homeRoute = require("./home.route");
const usersRoute = require("./users.route");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "text/html");

  // ! Task 2: Handle two routes: "/" and "/users"
  if (req.url === "/") homeRoute(req, res);
  if (req.url === "/users") usersRoute.list(req, res);
  if(req.url === "/create-user") usersRoute.create(req,res)

  res.end();
};