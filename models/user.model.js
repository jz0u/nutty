const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name is a string"],
    },
    email: {
      type: String,
      require: [true, "email is a string"],
    },
    password: {
      type: String,
      require: [true, "password is a string"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User",UserSchema);
module.exports = User;
