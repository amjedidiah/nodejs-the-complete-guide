const User = require("../models/user.model");
exports.postCart = (
  { body: { id: productID }, session: { isLoggedIn }, user },
  res
) => {
  if (!isLoggedIn)
    return res
      .status(400)
      .json({ message: "You must be logged in to add to cart!" });

  return user
    .addToCart(productID)
    .then(() => res.redirect(`/cart`))
    .catch(() => res.redirect("/products"));
};

exports.getCart = (
  { session: { isLoggedIn: isAuthenticated }, user },
  res
) => {
  if (!isAuthenticated) return res.redirect("/");

  return user
    .getCart()
    .then((products) =>
      res.render("cart", {
        docTitle: "Cart",
        path: `/cart`,
        products,
        isAuthenticated,
      })
    )
    .catch(() => res.redirect("/"));
};

exports.postCartDeleteProduct = (
  { body: { id: productID }, session: { isLoggedIn }, user },
  res
) => {
  if (!isLoggedIn)
    return res
      .status(400)
      .json({ message: "You must be logged in to delete from cart!" });

  return user
    .removeFromCart(productID)
    .catch((err) => console.log(err))
    .then(() => res.redirect("/cart"))
};
