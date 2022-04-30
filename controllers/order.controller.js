const Order = require("../models/order.model");

exports.postOrder = (req, res) => {
  let products;
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((p) => {
      products = p;
      return req.user.createOrder();
    })
    .then((order) => {
      return order.addProducts(
        products.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        })
      );
    })
    .then(() => fetchedCart.setProducts(null))
    .then(() => res.redirect(`/orders`))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) =>
      res.render("orders", {
        docTitle: "Orders",
        path: `/users/orders/${req.user.id}`,
        orders,
      })
    )
    .catch((err) => console.log(err));
};

exports.deleteOrder = ({ params: { id } }, res) =>
  Order.findByPk(id)
    .then((order) => order.destroy())
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
