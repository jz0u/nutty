const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters"]
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
