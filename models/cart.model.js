const {INTEGER} = require("sequelize");
const sequelize = require("../util/database.util");
const Cart = sequelize.define("cart", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  }
});

module.exports = Cart;
