// Module imports
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

// Environment variables
require("dotenv").config();
const {PORT, NODE_ENV, DEFAULT_USERID} = process.env;
const port = PORT || 3000;
const isProd = NODE_ENV === "production";

// Route imports
const routes = require("./routes");

// Util imports
const rootDIR = require("./util/path.util");

// Sequelize
const sequelize = require("./util/database.util");
const User = require("./models/user.model");
const Product = require("./models/product.model");
const Cart = require("./models/cart.model");
const CartItem = require("./models/cartItem.model");
const Order = require("./models/order.model");
const OrderItem = require("./models/orderItem.model");

// App
const app = express();

// Template Engine
app.set("view engine", "pug");
app.set("views", "views");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDIR, "public")));

// Routes definition
app.use(routes);

// Sync models
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync({ force: isProd })
  .then(() => User.findByPk(DEFAULT_USERID))
  .then((user) =>
    !user
      ? User.create({
          firstName: "Marly",
          lastName: "Jamine",
          email: "marly@example.com",
          age: 30,
          phoneNumber: "+2348165982367",
        })
      : user
  )
  .then(({dataValues: {id: userId}}) => Cart.findOne({where: {userId}}))
  .then(cart => !cart && Cart.create({userId: DEFAULT_USERID}))
  .then(() =>
    app.listen(port, () => console.log(`Server active on port: ${port}`))
  )
  .catch((err) => console.log(err));
