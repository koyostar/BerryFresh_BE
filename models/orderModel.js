const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    guestDetails: {
      name: {
        type: String,
        required: function () {
          return !this.user;
        },
        trim: true,
      },
      email: {
        type: String,
        required: function () {
          return !this.user;
        },
        trim: true,
      },
      address: {
        type: String,
        required: function () {
          return !this.user;
        },
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: function () {
          return !this.user;
        },
        trim: true,
      },
    },
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
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
