// Module imports
const express = require('express');

const router = new express.Router();

// Controller imports
const {
  getCart,
  postCart,
  postCartDeleteProduct,
} = require('../controllers/cart.controller');
const { isAuth } = require('../middlewares/auth.middleware');

// Routes
router.post('/add', isAuth, postCart);
router.get('/', isAuth, getCart);
router.post('/delete', isAuth, postCartDeleteProduct);

module.exports = router;
