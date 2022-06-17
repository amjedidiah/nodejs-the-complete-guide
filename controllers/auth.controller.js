/* eslint-disable no-param-reassign */
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailer = require('../config/mailer.config');
const loginFields = require('../data/fields/login.field.json');
const registerFields = require('../data/fields/register.field.json');
const resetFields = require('../data/fields/reset.field.json');
const newPasswordFields = require('../data/fields/new-password.field.json');
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
    .then(() => {
      res.redirect('/login');
      return mailer.sendMail({
        to: rest.email,
        from: 'welcome@mystore.com',
        subject: 'Welcome to My Store',
        html: `<div>
                <h1>Welcome to My Store!</h1>
                <p>You have successfully registered!</p>
              </div>`,
      });
    })
    .catch((err) => devLog('log', err));
};

exports.postLogin = (req, res) => {
  const { body, session } = req;

  return User.findOne({ email: body.email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid username or password!');
        return res.redirect('/login');
      }

      const isSame = bcrypt.compareSync(body.password, user.password);
      if (!isSame) {
        req.flash('error', 'Invalid username or password!');
        return res.redirect('/login');
      }
      session.user = user;
      session.isLoggedIn = true;

      return session.save((err) => {
        if (err) {
          req.flash('error', 'Error saving session!');
          return res.redirect('/login');
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

exports.getReset = (req, res) => res.render('auth/reset', {
  docTitle: 'Reset Password',
  path: '/reset',
  fields: resetFields,
  formAction: '/reset',
  action: 'Reset',
});

exports.postReset = (req, res) => {
  const {
    body: { email },
  } = req;

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email!');
        return res.redirect('/reset');
      }

      const token = crypto.randomBytes(32).toString('hex');
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;

      return user.save().then(() => {
        const resetLink = `${process.env.FRONTEND_URL}/reset/${token}`;
        req.flash(
          'success',
          'An email has been sent to you with a link to reset your password!',
        );
        res.redirect('/login');
        mailer.sendMail({
          to: email,
          from: 'support@mystore.com',
          subject: 'Password Reset',
          html: `<div>
                  <h1>Password Reset</h1>
                  <p>You have requested a password reset.</p>
                  <p>Click the following link to reset your password:</p>
                  <p><a href="${resetLink}">Reset Password</a></p>
                
                  <p>Or copy and paste the following link into your browser:</p>
                  <p>${resetLink}</p>
  
                  <p>If you did not request a password reset, please ignore this email.</p>
                </div>`,
        });
      });
    })
    .catch((err) => devLog('log', err));
};

exports.getNewPassword = (req, res) => {
  const {
    params: { token },
  } = req;

  return User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid token!');
        return res.redirect('/reset');
      }

      return res.render('auth/new-password', {
        docTitle: 'New Password',
        path: '/new-password',
        fields: newPasswordFields,
        formAction: '/new-password',
        action: 'Save',
        userId: user?._id,
        token,
      });
    })
    .catch((err) => devLog('log', err));
};

exports.postNewPassword = (req, res) => {
  const {
    body: {
      password, confirmPassword, token, userId,
    },
  } = req;

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match!');
    return res.redirect(`/reset/${token}`);
  }

  return User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid token!');
        return res.redirect('/reset');
      }

      user.password = bcrypt.hashSync(password, 12);
      user.resetToken = null;
      user.resetTokenExpiration = null;

      return user.save().then(() => {
        req.flash('success', 'Password changed successfully!');
        res.redirect('/login');
        return mailer.sendMail({
          to: user.email,
          from: 'support@mystore.com',
          subject: 'Password Changed',
          html: `<div>
                <h1>Password Changed</h1>
                <p>You have successfully changed your password!</p>

                <p>If you did not change your password, please contact <a href="mailto:support@mystore.com">support</a>.</p>
              </div>`,
        });
      });
    })
    .catch((err) => devLog('log', err));
};
