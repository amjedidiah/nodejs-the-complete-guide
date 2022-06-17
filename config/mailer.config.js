const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

// Environment variables
require('dotenv').config();

const { SENDGRID_API_KEY } = process.env;

const options = {
  auth: {
    api_key: SENDGRID_API_KEY,
  },
};

const mailer = nodemailer.createTransport(sgTransport(options));

module.exports = mailer;
