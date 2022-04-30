const { INTEGER } = require("sequelize");
const sequelize = require("../util/database.util");
const CartItem = sequelize.define("cartItem", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: INTEGER,
});

module.exports = CartItem;
