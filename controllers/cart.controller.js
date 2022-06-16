const User = require("../models/user.model");
exports.postCart = (
  { body: { id: productID }, user },
  res
) => user
    .addToCart(productID)
    .then(() => res.redirect(`/cart`))
    .catch(() => res.redirect("/products"));

exports.getCart = (
  { user },
  res
) => user
    .getCart()
    .then((products) =>
      res.render("cart", {
        docTitle: "Cart",
        path: `/cart`,
        products,
      })
    )
    .catch(() => res.redirect("/"));

exports.postCartDeleteProduct = (
  { body: { id: productID }, user },
  res
) => user
    .removeFromCart(productID)
    .catch((err) => console.log(err))
    .finally(() => res.redirect("/cart"))
