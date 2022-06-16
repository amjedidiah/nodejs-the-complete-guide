const loginFields = require("../data/fields/login.field.json");
const registerFields = require("../data/fields/register.field.json");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.postRegister = ({ body: { confirmPassword, ...rest } }, res) => {
  let bareBody = { ...rest };

  Object.keys(bareBody).forEach(
    (key) => bareBody[key] === "" && delete bareBody[key]
  );

  if (Object.values(bareBody).length < 3)
    return res.status(400).json({ message: "All fields are required!" });
    

  if (rest.password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match!" });

  bcrypt
    .hash(rest.password, 12)
    .then((hash) => {
      const user = new User({
        ...rest,
        password: hash,
        cart: [],
      });

      return user.save();
    })
    .then(() => res.redirect("/login"))
    .catch((err) => {
      console.log(err);
      res.redirect("/register");
    });
};

exports.postLogin = ({ body, session }, res) =>
  User.findOne({ email: body.email })
    .then((user) => {
      if (!user) return res.status(400).json({ message: "User not found!" });

      const isSame = bcrypt.compareSync(body.password, user.password);
      if (!isSame) throw({ message: "Invalid password!" });
      session.user = user;
      session.isLoggedIn = true;

      session.save((err) => {
        if (err)
          return res.status(500).json({ message: "Error saving session!" });

        return res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!" });
    });

exports.getLogin = ({ session: { isLoggedIn } }, res) =>
  res.render("auth/login", {
    docTitle: `Login`,
    path: "/login",
    fields: loginFields,
    formAction: "/login",
    action: "login",
  });

exports.getRegister = ({ session: { isLoggedIn } }, res) =>
  res.render("auth/register", {
    docTitle: `Register`,
    path: "/register",
    fields: registerFields,
    formAction: "/register",
    action: "register",
  });

exports.postLogout = ({ session }, res) =>
  session.destroy((err) => {
    if (err)
      return res.status(500).json({ message: "Error destroying session!" });

    return res.redirect("/");
  });
