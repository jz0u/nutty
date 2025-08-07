const mongoose = require("mongoose");

const LogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: [true, "name is a string"],
    },

    calorie: {
      type: Number,
      required: [true, "calorie is a number"],
    },

    serving_size: {
      type: Number,
      required: [true, "serving_size is a number"],
    },

    time: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", LogSchema);
module.exports = Log;
