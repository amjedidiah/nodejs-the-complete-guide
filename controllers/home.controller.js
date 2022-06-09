module.exports = ({ session: { isLoggedIn: isAuthenticated } }, res) =>
  res.render("home", { docTitle: "Home", path: "/", isAuthenticated });
