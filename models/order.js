const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    count: Number,
    description: String,
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

const OrderSchema = new mongoose.Schema(
  {
    products: [CartItemSchema],
    amount: { type: Number },

    status: {
      type: String,
      default: "Received",
      enum: ["Received", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: { type: String },
      phone: { type: String },
      address: { type: String },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, CartItem };
