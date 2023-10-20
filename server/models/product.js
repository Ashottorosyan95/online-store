const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    minLength: [3, "Must be at least 3 characters."],
  },
  price: {
    type: Number,
    required: true,
  },
  salaryPrice: {
    type: Number,
    required: false,
  },
  size: {
    type: String,
    required: false,
  },
  SKU: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  categoryId: {
    type: String,
    required: true,
  },
  pictures: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  modifiedAt: {
    type: Date,
    default: new Date(),
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;