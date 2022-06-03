const { default: mongoose } = require("mongoose");
const Order = require("../models/order.model");
const User = require("../models/user.model");

exports.postOrder = ({ user }, res) =>
  user
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
    .then(() => res.redirect(`/orders`))
    .catch((err) => console.log(err));

exports.getOrders = (req, res) => {
  Order.find()
    .then((orders) => {
      console.log("orders", orders, orders.map((order) => ({
        ...order,
        products: !orders?.products
          ? []
          : order.products.map(({ product, quantity }) => ({
              quantity,
              ...product,
            })),
      })));
      return res.render("orders", {
        docTitle: "Orders",
        path: `/users/orders/${req.user._id}`,
        orders: orders.map((order) => ({
          ...order?._doc,
          products: !order?._doc?.products
            ? []
            : order.products.map(({ product, quantity }) => ({
                quantity,
                ...product,
              })),
        })),
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteOrder = ({ params: { id } }, res) =>
  Order.findByIdAndDelete(id)
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
