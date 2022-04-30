const Product = require("../models/product.model");

exports.postCart = ({ body: { id: productId }, user }, res) => {
  let newQuantity = 1;
  let fetchedCart;

  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product = products.length && products[0];

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity += oldQuantity;

        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) =>
      fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      })
    )
    .then(() => res.redirect(`/cart`))
    .catch(() => res.redirect("/"));
};

exports.getCart = (req, res) =>
  req.user
    .getCart()
    .then((cart) =>
      cart
        .getProducts()
        .then((products) =>
          res.render("cart", {
            docTitle: "Cart",
            path: `/cart`,
            products,
            cart,
          })
        )
        .catch((err) => console.log(err))
    )
    .catch(() => res.redirect("/"));

exports.postCartDeleteProduct = ({ body: { id: productID }, user }, res) =>
  user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: productID } }))
    .then((products) => {
      const product = products.length && products[0];

      if (product) return product.cartItem.destroy();
    })
    .then(() => res.redirect("/cart"));
