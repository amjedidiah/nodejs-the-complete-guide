// Module imports
const express = require('express');

const router = new express.Router();

const User = require('../models/user.model');

// Routes
const homeRoute = require('./home.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const cartRoute = require('./cart.route');
const orderRoute = require('./order.route');
const authRoute = require('./auth.route');
const devLog = require('../util/debug.util');

// eslint-disable-next-line max-len
const notFoundRoute = (_req, res) => res.status(404).render('error/404', { docTitle: 'Not Found', path: '/404' });

router.use((req, res, next) => {
  if (!req.session?.isLoggedIn) return next();

  return User.findById(req.session?.user?._id)
    .then((user) => {
      if (user) req.user = user;
      next();
    })
    .catch((err) => devLog('error', err, next));
});
router.use('/cart', cartRoute);
router.use('/orders', orderRoute);
router.use('/products', productRoute);
router.use('/users', userRoute);
router.use('/', authRoute);
router.get('/', homeRoute);
router.use('/', notFoundRoute);

module.exports = router;
