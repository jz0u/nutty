const express = require("express");
const app = express();
const PORT = 3000;
const log_route = require("./routes/log.route.js")
const Log = require("./models/log.model.js");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();
const DB_URI = process.env.mongodb_uri;

// middleware
app.use(express.json());

// routes
app.use("/api/logs",log_route);

//pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/homepage/homepage.html"));
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
