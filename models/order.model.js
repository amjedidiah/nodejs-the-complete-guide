const {Schema, model}  = require("mongoose");

const OrderSchema = new Schema({
    products: [{
        product: {
            type: Object,
            required: true
        }, 
        quantity: {
            type: Number,
            required: true
        }
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Order', OrderSchema);