// Module imports
const express = require('express');

const router = new express.Router();

// Controller imports
const {
  postOrder, getOrders, getOrder, deleteOrder,
} = require('../controllers/order.controller');
const { isAuth } = require('../middlewares/auth.middleware');
const { ownsOrder } = require('../middlewares/order.middleware');

// Routes
router.post('/create', isAuth, postOrder);
router.get('/', isAuth, getOrders);
router.get('/:id', ownsOrder, getOrder);
router.post('/:id/delete', ownsOrder, deleteOrder);

module.exports = router;
