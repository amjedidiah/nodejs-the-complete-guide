const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const Order = require('../models/order.model');
const devLog = require('../util/debug.util');
const rootDIR = require('../util/path.util');

const getPDFFileName = (id) => path.join(rootDIR, `assets/invoices/order${id}.pdf`);

exports.postOrder = ({ user }, res) => user
  .getCart()
  .then((products) => {
    // create rando 10 digits order number
    const orderNo = Math.floor(100000000 + Math.random() * 900000000);

    const order = new Order({
      products: products.map(({ quantity, ...rest }) => ({
        product: rest,
        quantity,
      })),
      userId: user,
      orderNo,
    });

    return order.save();
  })
  .then(() => user.clearCart())
  .catch((err) => devLog('log', err))
  .finally(() => res.redirect('/orders'));

exports.getOrder = ({ params: { id } }, res) => Order.findById(id)
  .then((o) => {
    const pdf = new PDFDocument();

    const order = [o].map((or) => ({
      ...or?._doc,
      products: !or?._doc?.products
        ? []
        : or.products.map(({ product, quantity }) => ({
          quantity,
          ...product,
        })),
    }))[0];
    let total = 0;
    const orderId = order.orderNo ?? order._id;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="order.pdf"');

    pdf.pipe(res);
    pdf.pipe(fs.createWriteStream(getPDFFileName(order._id)));

    pdf.fontSize(25).text('Order confirmation');
    pdf.text(`Order number: ${orderId}`);
    pdf.text(`Order date: ${order.createdAt}`);
    pdf.text(`Order status: ${order.status}`);
    pdf.text('Order products:');
    order.products.forEach(({ quantity, ...product }) => {
      pdf.text(`${product.name} - ${quantity} x ${product.price}`);
      total += product.price * quantity;
    });
    pdf.text(`Total: ${total}`);
    pdf.end();
  })
  .catch((err) => devLog('log', err));

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
  .then(() => {
    fs.unlink(getPDFFileName(id), (err) => {
      if (err) devLog('log', err);
    }).catch((err) => devLog('log', err));
  })
  .catch((err) => devLog('log', err))
  .finally(() => res.redirect('/orders'));
