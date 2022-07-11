const Order = require('../models/order.model');

exports.ownsOrder = async ({ user, params: { id } }, res, next) => {
  const order = await Order.find({ userId: { _id: user._id }, _id: id });

  if (!order) {
    return res.redirect('/');
  }
  return next();
};
