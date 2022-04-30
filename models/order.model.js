const { INTEGER } = require("sequelize");
const sequelize = require("../util/database.util");
const Order = sequelize.define(
  "order",
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Order;
