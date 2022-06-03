const Product = require("../models/product.model");
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

  Object.keys(bareBody).forEach(
    (key) => bareBody[key] === "" && delete bareBody[key]
  );

  if (Object.values(bareBody).length >= 2) {
    if (bareBody.id) {
      Product.findByIdAndUpdate(bareBody.id, bareBody)
        .then(() => res.redirect("/products"))
        .catch((err) => {
          console.log(err);
          res.redirect("/products/add");
        });
    } else {
      const product = new Product({...bareBody, userId: user._id});
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

exports.productGetAll = (req, res) =>
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name -_id')
    .then((products) =>
      res.render("products", {
        docTitle: "Products",
        path: "/products",
        products,
      })
    )
    .catch((err) => console.log(err));

exports.productGetOne = ({ params: { id } }, res) =>
  Product.findById(id).then(
    (product) =>
      product &&
      res.render("product", {
        docTitle: `${product.name}`,
        path: "/product",
        product,
      })
  );

exports.productEdit = ({ params: { id } }, res) =>
  Product.findById(id).then(
    (product) =>
      product &&
      res.render("edit", {
        docTitle: `Edit ${product.name}`,
        data: product,
        fields: productFields,
        action: "edit",
        item: "product",
      })
  );

exports.productDeleteOne = ({ params: { id } }, res) =>
  Product.findByIdAndDelete(id)
    .then(() => res.redirect("/products"))
    .catch((err) => console.log(err));
