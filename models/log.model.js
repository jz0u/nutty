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
      require: [true, "name is a string"],
    },

    calorie: {
      type: Number,
      require: [true, "calorie is a number"],
    },

    serving_size: {
      type: Number,
      require: [true, "serving_size is a number"],
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
