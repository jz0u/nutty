const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is a string"],
    },
    email: {
      type: String,
      required: [true, "email is a string"],
    },
    password: {
      type: String,
      required: [true, "password is a string"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User",UserSchema);
module.exports = User;
