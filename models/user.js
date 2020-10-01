const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
