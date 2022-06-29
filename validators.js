/* eslint-disable max-len */
const { body } = require('express-validator');
const Product = require('./models/product.model');
const User = require('./models/user.model');

const emailValidator = (isRegister) => {
  let result = body('email').isEmail().withMessage('Please enter a valid email');

  if (isRegister) {
    result = result.custom((value) => User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject(new Error('Email already exists'));
      }
      return true;
    }));
  }

  return result.normalizeEmail();
};

const passwordValidator = () => body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long')
  .matches(/\d/)
  .withMessage('Password must contain a number')
  .matches(/[A-Z]/)
  .withMessage('Password must contain an uppercase letter')
  .trim();

const confirmPasswordValidator = () => body('confirmPassword')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
  .trim();

const nameValidator = () => body('name', 'Name must be a string between 3 to 70 characters long')
  .isString()
  .isLength({ min: 3, max: 70 })
  .trim();

const imageURLValidator = () => body('imageURL', 'Image URL must be a valid URL').isURL();

const priceValidator = () => body('price', 'Price must be a number greater than 0')
  .isFloat()
  .custom((value) => {
    if (value < 0) {
      throw new Error('Price must be greater than 0');
    }
    return true;
  });

const descriptionValidator = () => body('description', 'Description must be a string between 10 to 400 characters long')
  .isString()
  .custom((value) => {
    if (value && (value.length < 10 || value.length > 400)) {
      throw new Error('Description must be between 10 and 400 characters long');
    }
    return true;
  })
  .trim();

const duplicateNameValidator = (Model, type) => body('name', 'Name already exists').custom((value, { req }) => Model.findOne({ name: value, userId: req.user._id }).then((item) => {
  if (item) {
    return Promise.reject(new Error(`A ${type} with this name already exists`));
  }
  return true;
}));

const duplicateImageURLValidator = (Model, type) => body('imageURL', 'ImageURL already exists').custom((value, { req }) => Model.findOne({ imageURL: value, userId: req.user._id }).then((item) => {
  if (item) {
    return Promise.reject(new Error(`A ${type} with this imageURL already exists`));
  }
  return true;
}));

const productExistsValidator = () => body('id', 'Product does not exist').custom((value) => Product.findById(value).then((product) => {
  if (!product) {
    return Promise.reject(new Error('Product does not exist'));
  }
  return true;
}));

const registerValidator = [emailValidator(true), passwordValidator(), confirmPasswordValidator()];

const productAddValidator = [
  nameValidator(),
  imageURLValidator(),
  priceValidator(),
  descriptionValidator(),
  duplicateNameValidator(Product, 'product'),
  duplicateImageURLValidator(Product, 'product'),
];

const productEditValidator = [...productAddValidator.slice(0, 4), productExistsValidator()];

module.exports = {
  registerValidator,
  productAddValidator,
  productEditValidator,
};
