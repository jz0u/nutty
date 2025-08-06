const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const DB_URI = process.env.mongodb_uri;



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/logs", (req, res) => {
  console.log(req.body);
  res.send(req.body);
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
