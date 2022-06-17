const bcrypt = require('bcryptjs');
const loginFields = require('../data/fields/login.field.json');
const registerFields = require('../data/fields/register.field.json');
const User = require('../models/user.model');
const devLog = require('../util/debug.util');

exports.postRegister = (req, res) => {
  const {
    body: { confirmPassword, ...rest },
  } = req;
  const bareBody = { ...rest };

  Object.keys(bareBody).forEach(
    (key) => bareBody[key] === '' && delete bareBody[key],
  );

  if (Object.values(bareBody).length < 3) {
    req.flash('error', 'Please fill in all fields!');
    return res.redirect('/register');
  }

  if (rest.password !== confirmPassword) {
    req.flash('error', 'Passwords do not match!');
    return res.redirect('/register');
  }

  return bcrypt
    .hash(rest.password, 12)
    .then((hash) => {
      const user = new User({
        ...rest,
        password: hash,
        cart: [],
      });

      return user.save();
    })
    .then(() => res.redirect('/login'))
    .catch((err) => devLog('log', err));
};

exports.postLogin = (req, res) => {
  const { body, session } = req;

  return User.findOne({ email: body.email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid username or password!');
        res.redirect('/login');
      }

      const isSame = bcrypt.compareSync(body.password, user.password);
      if (!isSame) {
        req.flash('error', 'Invalid username or password!');
        res.redirect('/login');
      }
      session.user = user;
      session.isLoggedIn = true;

      session.save((err) => {
        if (err) {
          req.flash('error', 'Error saving session!');
          res.redirect('/login');
        }

        return res.redirect('/');
      });
    })
    .catch((err) => devLog('log', err));
};

exports.getLogin = (req, res) => res.render('auth/login', {
  docTitle: 'Login',
  path: '/login',
  fields: loginFields,
  formAction: '/login',
  action: 'login',
});

exports.getRegister = (req, res) => res.render('auth/register', {
  docTitle: 'Register',
  path: '/register',
  fields: registerFields,
  formAction: '/register',
  action: 'register',
});

exports.postLogout = ({ session }, res) => session.destroy((err) => {
  if (err) devLog('log', err);

  res.redirect('/');
});
