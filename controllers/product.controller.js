const Product = require("../models/product.model");
const User = require("../models/user.model");
const productFields = require("../data/fields/product.field.json");

exports.productAdd = ({ session: {isLoggedIn: isAuthenticated} }, res) =>
  isAuthenticated ?
  res.render("add", {
    docTitle: "Add a Product",
    fields: productFields,
    action: "add",
    item: "product",
    isAuthenticated
  }) : res.redirect("/products");

exports.productCreate = ({ body, session: { user, isLoggedIn } }, res) => {
  let bareBody = { ...body };

  Object.keys(bareBody).forEach(
    (key) => bareBody[key] === "" && delete bareBody[key]
  );

  if (Object.values(bareBody).length >= 2 && isLoggedIn) {
    if (bareBody.id) {
      Product.findByIdAndUpdate(bareBody.id, bareBody)
        .then(() => res.redirect("/products"))
        .catch((err) => {
          console.log(err);
          res.redirect("/products/add");
        });
    } else {
      const product = new Product({ ...bareBody, userId: user._id });
      product
        .save()
        .then(() => res.redirect("/products"))
        .catch((err) => {
          console.log(err);
          res.redirect("/products/add");
        });
    }
  } else res.redirect("/products/add");
};

exports.productGetAll = ({ session: { isLoggedIn: isAuthenticated } }, res) =>
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name -_id')
    .then((products) =>
      res.render("products", {
        docTitle: "Products",
        path: "/products",
        products,
        isAuthenticated,
      })
    )
    .catch((err) => {
      console.log(err)
      res.redirect("/");
    });

exports.productGetOne = (
  { params: { id }, session: { isLoggedIn: isAuthenticated } },
  res
) =>
  Product.findById(id).then(
    (product) =>
      product &&
      res.render("product", {
        docTitle: `${product.name}`,
        path: "/product",
        product,
        isAuthenticated,
      })
  ).catch((err) => {
    console.log(err);
    res.redirect("/products");
  });

exports.productEdit = ({ params: { id }, session: { isLoggedIn: isAuthenticated } }, res) =>
isAuthenticated ?
  Product.findById(id).then(
    (product) =>
      product &&
      res.render("edit", {
        docTitle: `Edit ${product.name}`,
        data: product,
        fields: productFields,
        action: "update",
        item: "product",
        isAuthenticated
      })
  )
  .catch((err) => {
    console.log(err);
    res.redirect("/products");
  }) : res.redirect("/products");

exports.productDeleteOne = (
  { params: { id }, session: { isLoggedIn }, user },
  res
) =>
  isLoggedIn ? 
  Product.findByIdAndDelete(id)
    .then(() => user.removeFromCart(id))
    .catch((err) => console.log(err))
    .finally(() => res.redirect("/products")): res.redirect("/products");
