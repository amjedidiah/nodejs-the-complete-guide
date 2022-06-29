/* eslint-disable func-names */
const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: Number,
  phoneNumber: String,
  bio: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  type: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

UserSchema.methods.addToCart = function (pID) {
  const itemIndex = this.cart.findIndex((it) => it.productId.toString() === pID.toString());

  if (itemIndex !== -1) {
    this.cart[itemIndex].quantity += 1;
  } else {
    this.cart.push({ productId: pID, quantity: 1 });
  }

  return this.save();
};

UserSchema.methods.getCart = function () {
  return this.populate('cart.productId').then(({ cart }) => cart.map((it) => ({
    quantity: it?.quantity,
    ...it?.productId._doc,
  })));
};

UserSchema.methods.removeFromCart = function (pID) {
  const filteredItems = this.cart.filter((item) => item.productId.toString() !== pID.toString());
  this.cart = filteredItems;

  return this.save();
};

UserSchema.methods.clearCart = function () {
  this.cart = [];
  return this.save();
};

module.exports = model('User', UserSchema);
