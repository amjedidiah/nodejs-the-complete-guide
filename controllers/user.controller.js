const User = require("../models/user.model");
const userFields = require("../data/fields/user.field.json");

exports.userAdd = (req, res) =>
  res.render("add", {
    docTitle: "Add a User",
    fields: userFields,
    action: "add",
    item: "user",
  });

exports.userCreate = ({ body }, res) => {
  let bareBody = { ...body };

  Object.keys(bareBody).forEach(
    (key) => bareBody[key] === "" && delete bareBody[key]
  );

  if (Object.values(bareBody).length >= 5) {
    if (bareBody.id) {
      User.findByIdAndUpdate(bareBody.id, bareBody)
        .then(() => res.redirect("/users"))
        .catch(() => res.redirect("/users/add"));
    } else {
      const user = new User(bareBody);
      user
        .save()
        .then(() => res.redirect("/users"))
        .catch((err) => console.log(err));
    }
  } else res.redirect("/users/add");
};

exports.userGetAll = (req, res) =>
  User.find()
    .then((users) =>
      res.render("users", {
        docTitle: "Users",
        path: "/users",
        users,
      })
    )
    .catch((err) => console.log(err));

exports.userGetOne = ({ params: { id } }, res) =>
  User.findById(id).then(
    (user) =>
      user &&
      res.render("user", {
        docTitle: `${user.firstName}'s Profile`,
        user,
      })
  );

exports.userEdit = ({ params: { id } }, res) =>
  User.findById(id).then(
    (user) =>
      user &&
      res.render("edit", {
        docTitle: `Edit ${user.firstName}'s Profile`,
        data: user,
        fields: userFields,
        action: "edit",
        item: "user",
      })
  );

exports.userDeleteOne = ({ params: { id } }, res) =>
  User.findByIdAndDelete(id)
    .then(() => res.redirect("/users"))
    .catch((err) => console.log(err));
