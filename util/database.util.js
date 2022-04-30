// Module imports
const mysql = require('mysql2');
const Sequelize = require("sequelize");

// Environment variables
require("dotenv").config();

const {
  MYSQL_HOST: host,
  MYSQL_USER: user,
  MYSQL_PASSWORD: password,
  MYSQL_DATABASE,
} = process.env;

// Open the connection to MySQL server
const connection = mysql.createConnection({
  host,
  user,
  password,
});

// Run create database statement
connection.query(
  `CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}`,
  function (err, results) {
    if(err) console.log(err);
  }
);

// Close the connection
connection.end();

const sequelize = new Sequelize(MYSQL_DATABASE, user, password, {
  host,
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
