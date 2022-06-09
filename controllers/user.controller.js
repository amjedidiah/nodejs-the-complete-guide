const User = require("../models/user.model");
const userFields = require("../data/fields/user.field.json");

exports.userAdd = ({ session: { isLoggedIn: isAuthenticated } }, res) =>
  isAuthenticated
    ? res.render("add", {
        docTitle: "Add a User",
        fields: userFields,
        action: "add",
        item: "user",
        isAuthenticated,
      })
    : res.redirect("/users");

exports.userCreate = ({ body, session: { isLoggedIn } }, res) => {
  let bareBody = { ...body };

  Object.keys(bareBody).forEach(
    (key) => bareBody[key] === "" && delete bareBody[key]
  );

  if (Object.values(bareBody).length >= 5 && isLoggedIn) {
    if (bareBody.id) {
      User.findByIdAndUpdate(bareBody.id, bareBody)
        .then(() => res.redirect("/users"))
        .catch((err) => {
          console.log(err);
          res.redirect("/users/add");
        });
    } else {
      const user = new User(bareBody);
      user
        .save()
        .then(() => res.redirect("/users"))
        .catch((err) => {
          console.log(err);
          res.redirect("/users/add");
        });
    }
  } else res.redirect("/users/add");
};

exports.userGetAll = ({ session: { isLoggedIn: isAuthenticated } }, res) =>
  User.find()
    .then((users) =>
      res.render("users", {
        docTitle: "Users",
        path: "/users",
        users,
        isAuthenticated,
      })
    )
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });

exports.userGetOne = (
  { params: { id }, session: { isLoggedIn: isAuthenticated } },
  res
) =>
  User.findById(id)
    .then(
      (user) =>
        user &&
        res.render("user", {
          docTitle: `${user.firstName}'s Profile`,
          user,
          isAuthenticated,
        })
    )
    .catch((err) => {
      console.log(err);
      res.redirect("/users");
    });

exports.userEdit = (
  { params: { id }, session: { isLoggedIn: isAuthenticated } },
  res
) =>
  isAuthenticated
    ? User.findById(id)
        .then(
          (user) =>
            user &&
            res.render("edit", {
              docTitle: `Edit ${user.firstName}'s Profile`,
              data: user,
              fields: userFields,
              action: "update",
              item: "user",
              isAuthenticated,
            })
        )
        .catch((err) => {
          console.log(err);
          res.redirect("/users");
        })
    : res.redirect("/users");

exports.userDeleteOne = ({ params: { id }, session: { isLoggedIn } }, res) =>
  isLoggedIn
    ? User.findByIdAndDelete(id)
        .catch((err) => console.log(err))
        .finally(() => res.redirect("/users"))
    : res.redirect("/users");
