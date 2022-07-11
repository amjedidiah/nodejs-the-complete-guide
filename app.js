/* eslint-disable no-unused-vars */
// Module imports
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrfProtection = require('csurf');
const flash = require('connect-flash');
const multerConfig = require('./config/multer.config');

// Environment variables
require('dotenv').config();

const { PORT, NODE_ENV, MONGODB_STRING } = process.env;
const port = PORT || 3000;
const isProd = NODE_ENV === 'production';

// Route imports
const routes = require('./routes');

// Util imports
const rootDIR = require('./util/path.util');
const devLog = require('./util/debug.util');

// App
const app = express();

// Template Engine
app.set('view engine', 'pug');
app.set('views', 'views');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multerConfig);
app.use(express.static(path.join(rootDIR, 'public')));
app.use('/images', express.static(path.join(rootDIR, 'images')));
app.use(
  session({
    secret: 'node-js-course',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
    },
    store: new MongoDBStore({
      uri: MONGODB_STRING,
      collection: 'sessions',
    }),
  }),
);
app.use(csrfProtection());
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  next();
});

// Routes definition
app.use(routes);
app.use((error, req, res, next) => {
  res.status(error.httpStatusCode).render(`error/${error.httpStatusCode}`, {
    docTitle: 'Internal Server Error',
    path: '/500',
  });
});

// Sync models
mongoose
  .connect(MONGODB_STRING)
  .then(() => app.listen(port, () => devLog('log', `Server active on port: ${port}`)))
  .catch((err) => devLog('log', err));
