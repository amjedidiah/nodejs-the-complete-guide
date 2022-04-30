const { INTEGER, STRING } = require("sequelize");
const sequelize = require("../util/database.util");
const OrderItem = sequelize.define("orderItem", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: INTEGER
});

module.exports = OrderItem;
