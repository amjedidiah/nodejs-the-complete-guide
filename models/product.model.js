const {INTEGER, STRING} = require("sequelize");
const sequelize = require("../util/database.util");
const Product = sequelize.define("product", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  price: {
    type: INTEGER,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: true,
    defaultValue: ""
  },
});

module.exports = Product;
