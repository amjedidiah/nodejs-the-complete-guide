const { validationResult } = require('express-validator');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const productFields = require('../data/fields/product.field.json');
const devLog = require('../util/debug.util');
const { deleteUploadFromStorage } = require('../util/controller.util');

exports.productAdd = (req, res) => res.render('add', {
  docTitle: 'Add a Product',
  fields: productFields,
  action: 'add',
  item: 'product',
});

exports.productCreate = (req, res) => {
  const { body, user } = req;
  const bareBody = { ...body };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render(bareBody.id ? 'edit' : 'add', {
      docTitle: bareBody.id ? `Edit ${bareBody?.name}` : 'Add a Product',
      fields: productFields,
      action: bareBody.id ? 'update' : 'add',
      item: 'product',
      errorMessage: errors.array()[0].msg,
      data: bareBody,
    });
  }

  if (req.file) bareBody.imageURL = `/${req.file.path}`;

  if (bareBody.id) {
    if (bareBody.imageURL) {
      Product.findById(bareBody.id)
        .then((product) => {
          if (product.imageURL) {
            deleteUploadFromStorage(product.imageURL);
          }
        })
        .catch((err) => devLog('log', err));
    }
    return Product.findByIdAndUpdate(bareBody.id, bareBody)
      .then(() => res.redirect('/products'))
      .catch((err) => {
        devLog('log', err);
        res.redirect(req?.originalUrl || req?.url);
      });
  }
  const product = new Product({ ...bareBody, userId: user });
  return product
    .save()
    .then(({ _id, userId }) => User.findByIdAndUpdate(userId, { $push: { products: _id } }))
    .then(() => res.redirect('/products'))
    .catch((err) => {
      devLog('log', err);
      res.redirect('/products/add');
    });
};

exports.productGetAll = ({ user: authUser }, res) => Product.find()
// .select('title price -_id')
// .populate('userId', 'name -_id')
  .then((products) => res.render('products', {
    docTitle: 'Products',
    path: '/products',
    products,
    authUserIsAdmin: authUser?.type === 'admin',
    authUser,
  }))
  .catch((err) => {
    devLog('log', err);
    res.redirect('/');
  });

exports.productGetOne = ({ params: { id }, user: authUser }, res) => Product.findById(id)
  .populate('userId', 'firstName lastName')
  .then(
    (product) => product
        && res.render('product', {
          docTitle: `${product.name}`,
          path: '/product',
          product,
          authUserIsAdmin: authUser?.type === 'admin',
          authUser,
          isMine: product.userId?._id.toString() === authUser?._id.toString(),
        }),
  )
  .catch((err) => {
    devLog('log', err);
    res.redirect('/products');
  });

exports.productEdit = ({ params: { id } }, res) => (id ? Product.findById(id)
  .then(
    (product) => product
        && res.render('edit', {
          docTitle: `Edit ${product.name}`,
          data: product,
          fields: productFields,
          action: 'update',
          item: 'product',
        }),
  )
  .catch((err) => {
    devLog('log', err);
    res.redirect('/products');
  }) : res.redirect('/products'));

exports.productDeleteOne = ({ params: { id }, user }, res) => {
  let imageURL = '';

  return Product.findByIdAndDelete(id)
    .then((product) => {
      imageURL = product.imageURL;
      return User.updateOne({ _id: user?._id }, { $pull: { products: id } });
    })
    .then(() => User.updateMany({}, { $pull: { cart: { productId: id } } }))
    .then(() => deleteUploadFromStorage(imageURL))
    .catch((err) => devLog('log', err))
    .finally(() => res.redirect('/products'));
};
