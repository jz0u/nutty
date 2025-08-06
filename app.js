const express = require("express");
const app = express();
const PORT = 3000;
const log_route = require("./routes/log.route.js")
const Log = require("./models/log.model.js");
const mongoose = require("mongoose");

require("dotenv").config();
const DB_URI = process.env.mongodb_uri;

// middleware
app.use(express.json());
// routes
app.use("/api/logs",log_route);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("\nconnected to atlas\n");
    app.listen(PORT, () =>
      console.log(`\nserver running on http://localhost:${PORT}\n`)
    );
  })
  .catch(() => {
    console.log("\nerror connecting to atlas\n");
  });
