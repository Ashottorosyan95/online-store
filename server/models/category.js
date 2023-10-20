const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    minLength: [3, "Must be at least 3 characters."],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;