/* eslint-disable max-len */
const { body } = require('express-validator');
const fs = require('fs');
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

const imageNotExistsValidator = () => body('image', 'An image is required').custom(
  (value, { req }) => req.file && req.file.mimetype.startsWith('image/'),
);

const imageValidator = () => body('image').custom((value, { req }) => {
  if (req.file) {
    if (
      !req.file.mimetype.endsWith('png')
        && !req.file.mimetype.endsWith('jpg')
        && !req.file.mimetype.endsWith('jpeg')
    ) {
      throw new Error('Image must be .png or .jpg');
    }
    if (!(req.file.size <= 1000000 && req.file.size > 0)) {
      throw new Error('Image must be less than 1MB');
    }
  }
  return true;
});

// eslint-disable-next-line no-unused-vars
const imageExistsValidator = () => body('image', 'This image already exists').custom((value, { req, res, next }) => {
  if (req.file) {
    const files = fs.readdirSync('images/uploads');
    const fileName = req.file.filename;
    if (files.includes(fileName)) {
      return Promise.reject(new Error('This image already exists'));
    }
    return true;
  }
  return true;
});

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

const productExistsValidator = () => body('id', 'Product does not exist').custom((value) => Product.findById(value).then((product) => {
  if (!product) {
    return Promise.reject(new Error('Product does not exist'));
  }
  return true;
}));

const registerValidator = [emailValidator(true), passwordValidator(), confirmPasswordValidator()];

const productAddValidator = [
  nameValidator(),
  imageNotExistsValidator(),
  imageValidator(),
  imageExistsValidator(),
  priceValidator(),
  descriptionValidator(),
  duplicateNameValidator(Product, 'product'),
];

const productEditValidator = [
  ...productAddValidator.slice(0, 1),
  ...productAddValidator.slice(2, 6),
  productExistsValidator(),
];

module.exports = {
  registerValidator,
  productAddValidator,
  productEditValidator,
};
