const loginFields = require("../data/fields/login.field.json");
const User = require("../models/user.model");

exports.authPost = ({ body, session }, res) =>
  !session.isLoggedIn
    ? User.findOne({ email: body.email })
        .then((user) => {
          if (!user)
            return res.status(400).json({ message: "User not found!" });

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
        })
    : res.redirect("/");

exports.authGet = ({ session: { isLoggedIn } }, res) =>
  !isLoggedIn
    ? res.render("auth/login", {
        docTitle: `Login`,
        path: "/login",
        fields: loginFields,
        formAction: "/login",
        action: "login",
      })
    : res.redirect("/");

exports.getLogout = ({ session }, res) =>
  session.isLoggedIn
    ? session.destroy((err) => {
        if (err)
          return res.status(500).json({ message: "Error destroying session!" });

        return res.redirect("/");
      })
    : res.redirect("/");
