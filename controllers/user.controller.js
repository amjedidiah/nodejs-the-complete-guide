const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const userFields = require("../data/fields/user.field.json");
const { Types } = require("mongoose");

exports.userCreate = ({ body, user: authUser }, res) => {
  let bareBody = { ...body };

  if (Object.values(bareBody).length >= 1) {
    if (bareBody.id) {
      User.findByIdAndUpdate(bareBody.id, bareBody)
        .then(() => res.redirect("/users"))
        .catch((err) => {
          console.log(err);
          res.redirect("/users/add");
        });
    } else {
      res.redirect("/users/add");
    }
  } else res.redirect("/users/add");
};

exports.userGetAll = ({ user: authUser }, res) =>
  User.find()
    .then((users) =>
      res.render("users", {
        docTitle: "Users",
        path: "/users",
        users,
        authUserIsAdmin: authUser?.type == "admin",
      })
    )
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });

exports.userGetOne = ({ params: { id }, user: authUser }, res) =>
  User.findById(id)
    .then(
      (user) =>
        user &&
        res.render("user", {
          docTitle: `${user.firstName}'s Profile`,
          user,
          authUserIsAdmin: authUser?.type == "admin",
          isMine: authUser?._id == id,
        })
    )
    .catch((err) => {
      console.log(err);
      res.redirect("/users");
    });

exports.userEdit = ({ params: { id }, user: authUser }, res) =>
  User.findById(id)
    .then((user) =>
      res.render("edit", {
        docTitle: `Edit ${user.firstName}'s Profile`,
        data: user,
        fields: userFields,
        action: "update",
        item: "user",
      })
    )
    .catch((err) => {
      console.log(err);
      res.redirect("/users");
    });

exports.userDeleteOne = ({ params: { id } }, res) =>
  User.findById({ _id: id })
    .then(({ products: pIDs }) => pIDs)
    .then((pIDs) => User.updateMany(
        {},
        { $pull: { cart: { productId: { $in: pIDs } } } }
      )
    )
    .then(() => User.findByIdAndDelete(id))
    .then(() => Product.deleteMany({ userId: id }))
    .then(() => Order.deleteMany({ userId: id }))
    .catch((err) => console.log(err))
    .finally(() => res.redirect("/users"));
