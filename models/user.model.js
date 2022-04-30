const {INTEGER, STRING} = require("sequelize");
const sequelize = require("../util/database.util");
const User = sequelize.define("user", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: STRING,
    allowNull: false,
  },
  lastName: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
  },
  age: {
    type: INTEGER,
    allowNull: false,
  },
  phoneNumber: {
    type: STRING,
    allowNull: false,
  },
});

module.exports = User;
