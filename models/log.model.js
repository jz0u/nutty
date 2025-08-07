const mongoose = require("mongoose");

const LogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"]
    },
    name: {
      type: String,
      required: [true, "food name is required"],
      trim: true
    },
    calorie: {
      type: Number,
      required: [true, "calorie count is required"],
      min: [0, "calories cannot be negative"]
    },
    serving_size: {
      type: Number,
      required: [true, "serving size is required"],
      min: [0, "serving size cannot be negative"]
    },
    time: {
      type: String,
      required: [true, "time is required"]
    },
    date: {
      type: String,
      required: [true, "date is required"]
    }
  },
  {
    timestamps: true
  }
);

const Log = mongoose.model("Log", LogSchema);
module.exports = Log;
