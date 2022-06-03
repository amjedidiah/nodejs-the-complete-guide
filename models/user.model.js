const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bio: String,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

UserSchema.methods.addToCart = function (pID) {
  const { items } = this.cart;
  const itemIndex = items.findIndex((it) => it.productId == pID);

  if (itemIndex !== -1) {
    this.cart.items[itemIndex].quantity += 1;
  } else {
    this.cart.items.push({ productId: pID, quantity: 1 });
  }

  return this.save();
};

UserSchema.methods.getCart = function () {
  return this.cart.populate("items.productId").then((cart) =>
    cart.items.map((it) => ({
      quantity: it?.quantity,
      ...it?.productId._doc,
    }))
  );
};

UserSchema.methods.removeFromCart = function (pID) {
  const items = this.cart.items;
  const filteredItems = items.filter((item) => item.productId != pID);
  this.cart.items = filteredItems;

  return this.save();
};

UserSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("User", UserSchema);
