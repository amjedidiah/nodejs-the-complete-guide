const { default: mongoose } = require("mongoose");
const Order = require("../models/order.model");
const User = require("../models/user.model");

exports.postOrder = ({ session: { isLoggedIn }, user }, res) => {
  if (!isLoggedIn)
    return res
      .status(400)
      .json({ message: "You must be logged in to place an order!" });

  return user
    .getCart()
    .then((products) => {
      const order = new Order({
        products: products.map(({ quantity, ...rest }) => ({
          product: rest,
          quantity,
        })),
        userId: user,
      });

      return order.save();
    })
    .then(() => user.clearCart())
    .catch((err) => console.log(err))
    .finally(() => res.redirect(`/orders`));
};

exports.getOrders = ({ session: { user, isLoggedIn: isAuthenticated } }, res) =>
  isAuthenticated
    ? Order.find(({ userId: { _id: user._id } }))
        .then((orders) =>
          res.render("orders", {
            docTitle: "Orders",
            path: `/users/orders/${user._id}`,
            orders: orders.map((order) => ({
              ...order?._doc,
              products: !order?._doc?.products
                ? []
                : order.products.map(({ product, quantity }) => ({
                    quantity,
                    ...product,
                  })),
            })),
            isAuthenticated,
          })
        )
        .catch((err) => {
          console.log(err);
          return res.redirect("/");
        })
    : res.redirect("/");

exports.deleteOrder = ({ params: { id }, session: { isLoggedIn } }, res) =>
  isLoggedIn
    ? Order.findByIdAndDelete(id)
        .catch((err) => console.log(err))
        .finally(() => res.redirect("/orders"))
    : res.redirect("/");
