const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative."],
    },
    initialStock: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Initial stock must be an integer.",
      },
      min: [0, "Stock cannot be negative."],
    },
    currentStock: {
      type: Number,
      default: function () {
        return this.initialStock;
      },
      validate: {
        validator: Number.isInteger,
        message: "Current stock must be an integer.",
      },
      min: [0, "Current stock cannot be negative."],
    },
    image: { type: String, required: true },
    origin: { type: String, required: true },
    category: { type: String, required: true, enum: ["Daily", "Seasonal"] },
    status: {
      type: String,
      default: function () {
        return this.currentStock > 0 ? "In Stock" : "Sold Out";
      },
      enum: ["In Stock", "Running Low", "Sold Out", "Archived"],
      required: true,
    },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.currentStock === 0) {
    this.status = "Sold Out";
  } else if (this.currentStock < 10) {
    this.status = "Running Low";
  } else {
    this.status = "In Stock";
  }
  next();
});

productSchema.methods.updateStock = async function (quantity) {
  this.currentStock = Math.max(0, this.currentStock - quantity);
  this.status =
    this.currentStock === 0
      ? "Sold Out"
      : this.currentStock < 10
      ? "Running Low"
      : "In Stock";
  return await this.save();
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
