const mongoose = require("mongoose");
const { UserRoles } = require("../constants/constants");

const validateEmail = async function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!re.test(email)) throw new Error("Please enter a valid email address.");
  const user = await this.constructor.findOne({ email });
  if (user)
    throw new Error("A user is already registered with this email address.");
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    minLength: [3, "Must be at least 3 characters."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    validate: validateEmail,
  },
  phone: {
    type: String,
    required: [true, "Phone is required."],
    minLength: [6, "Must be at least 6 characters."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minLength: [8, "Must be at least 8 characters."],
  },
  role: {
    type: String,
    required: [true, "Role is required."],
    enum: Object.values(UserRoles),
    default: UserRoles.USER
  },
  avatar: {
    type: String,
    required: false,
    default: null,
  },
  refreshToken: {
    type: String,
    required: false,
    default: null,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  modifiedAt: {
    type: Date,
    default: new Date(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;