const Order = require('../models/order.model');
const devLog = require('../util/debug.util');

exports.postOrder = ({ user }, res) => user
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
  .catch((err) => devLog('log', err))
  .finally(() => res.redirect('/orders'));

exports.getOrders = ({ user }, res) => Order.find({ userId: { _id: user._id } })
  .then((orders) => res.render('orders', {
    docTitle: 'Orders',
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
  }))
  .catch((err) => {
    devLog('log', err);
    return res.redirect('/');
  });

exports.deleteOrder = ({ params: { id } }, res) => Order.findByIdAndDelete(id)
  .catch((err) => devLog('log', err))
  .finally(() => res.redirect('/orders'));
