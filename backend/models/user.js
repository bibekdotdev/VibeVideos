const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
