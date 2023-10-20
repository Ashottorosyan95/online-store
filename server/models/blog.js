const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    minLength: [3, "Must be at least 3 characters."],
  },
  description: {
    type: String,
    required: [false, "Description is required."],
  },
  categories: {
    type: String,
    required: true,
  },
  pictures: {
    type: Array,
    required: true,
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;