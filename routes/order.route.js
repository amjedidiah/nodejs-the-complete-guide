// Module imports
const express = require('express');

const router = new express.Router();

// Controller imports
const { postOrder, getOrders, deleteOrder } = require('../controllers/order.controller');
const { isAuth } = require('../middlewares/auth.middleware');

// Routes
router.post('/create', isAuth, postOrder);
router.get('/', isAuth, getOrders);
router.post('/:id/delete', isAuth, deleteOrder);

module.exports = router;
