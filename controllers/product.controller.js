const Product = require("../models/product.model");
const User = require("../models/user.model");
const productFields = require("../data/fields/product.field.json");

exports.productAdd = (req, res) =>
  res.render("add", {
    docTitle: "Add a Product",
    fields: productFields,
    action: "add",
    item: "product",
  });

exports.productCreate = ({ body, user }, res) => {
  let bareBody = { ...body };

  if (Object.values(bareBody).length >= 2) {
    if (bareBody.id) {
      Product.findByIdAndUpdate(bareBody.id, bareBody)
        .then(() => res.redirect("/products"))
        .catch((err) => {
          console.log(err);
          res.redirect("/products/add");
        });
    } else {
      const product = new Product({ ...bareBody, userId: user });
      product
        .save()
        .then(({ _id, userId }) =>
          User.findByIdAndUpdate(userId, { $push: { products: _id } })
        )
        .then(() => res.redirect("/products"))
        .catch((err) => {
          console.log(err);
          res.redirect("/products/add");
        });
    }
  } else res.redirect("/products/add");
};

exports.productGetAll = ({ user: authUser }, res) =>
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name -_id')
    .then((products) =>
      res.render("products", {
        docTitle: "Products",
        path: "/products",
        products,
        authUserIsAdmin: authUser?.type == "admin",
        authUser,
      })
    )
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });

exports.productGetOne = ({ params: { id }, user: authUser }, res) =>
  Product.findById(id)
    .populate("userId", "firstName lastName")
    .then(
      (product) =>
        product &&
        res.render("product", {
          docTitle: `${product.name}`,
          path: "/product",
          product,
          authUserIsAdmin: authUser?.type == "admin",
          authUser,
          isMine: product.userId?._id.toString() == authUser?._id.toString(),
        })
    )
    .catch((err) => {
      console.log(err);
      res.redirect("/products");
    });

exports.productEdit = ({ params: { id }, user }, res) =>
  Product.findById(id)
    .then(
      (product) =>
        product &&
        res.render("edit", {
          docTitle: `Edit ${product.name}`,
          data: product,
          fields: productFields,
          action: "update",
          item: "product",
        })
    )
    .catch((err) => {
      console.log(err);
      res.redirect("/products");
    });

exports.productDeleteOne = ({ params: { id }, user }, res) =>
  Product.findByIdAndDelete(id)
    .then(() =>
      User.updateOne(
        { _id: user?._id },
        { $pull: { products: id } }
      )
    )
    .then(() => User.updateMany(
      {},
      { $pull : { cart : { productId: id } } }
    ))
    .catch((err) => console.log(err))
    .finally(() => res.redirect("/products"));
