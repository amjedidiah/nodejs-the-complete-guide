const { body } = require('express-validator');
const User = require('./models/user.model');

const emailValidator = (isRegister) => {
  let result = body('email')
    .isEmail()
    .withMessage('Please enter a valid email');

  if (isRegister) {
    result = result.custom((value) => User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject(new Error('Email already exists'));
      }
      return true;
    }));
  }

  return result;
};

const passwordValidator = () => body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long')
  .matches(/\d/)
  .withMessage('Password must contain a number')
  .matches(/[A-Z]/)
  .withMessage('Password must contain an uppercase letter');

const confirmPasswordValidator = () => body('confirmPassword').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Passwords do not match');
  }
  return true;
});

const registerValidator = [
  emailValidator(true),
  passwordValidator(),
  confirmPasswordValidator(),
];

module.exports = {
  registerValidator,
};
