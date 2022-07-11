// Module imports
const express = require('express');

const router = new express.Router();

const { validationResult } = require('express-validator');
const productFields = require('../data/fields/product.field.json');

// Controller imports
const {
  productAdd,
  productCreate,
  productGetAll,
  productDeleteOne,
  productGetOne,
  productEdit,
} = require('../controllers/product.controller');
const { isAuth } = require('../middlewares/auth.middleware');
const { ownsProduct, canDeleteProduct } = require('../middlewares/product.middleware');
const { productAddValidator, productEditValidator } = require('../validators');

const validate = () => async (req, res, next) => {
  const { body } = req;
  const validations = body?.id ? productEditValidator : productAddValidator;
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  return res.status(422).render(body?.id ? 'edit' : 'add', {
    docTitle: body?.id ? 'Edit a product' : 'Add a Product',
    fields: productFields,
    action: body?.id ? 'update' : 'add',
    item: 'product',
    errorMessage: errors.array()[0].msg,
    data: body,
  });
};

// Routes
router.get('/add', isAuth, productAdd);
router.post('/create', isAuth, ownsProduct, validate(), productCreate);
router.get('/', productGetAll);
router.get('/:id', productGetOne);
router.get('/:id/edit', isAuth, ownsProduct, productEdit);
router.post('/:id/delete', isAuth, canDeleteProduct, productDeleteOne);

module.exports = router;
