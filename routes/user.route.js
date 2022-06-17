// Module imports
const express = require('express');

const router = new express.Router();

// Controller imports
const {
  userCreate,
  userGetAll,
  userDeleteOne,
  userGetOne,
  userEdit,
} = require('../controllers/user.controller');
const { isAuth } = require('../middlewares/auth.middleware');
const { isAdmin, isMine } = require('../middlewares/user.middleware');

// Routes
router.post('/create', isAuth, isMine, userCreate);
router.get('/', userGetAll);
router.get('/:id', userGetOne);
router.get('/:id/edit', isAuth, isMine, userEdit);
router.post('/:id/delete', isAuth, isAdmin, userDeleteOne);

module.exports = router;
