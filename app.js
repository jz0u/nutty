const express = require("express");
const app = express();
app.use(express.json());
const Log = require("./models/log.model.js");
const PORT = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const DB_URI = process.env.mongodb_uri;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/logs", async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/log/:id", async (req,res) => {
  try {
    const {id} = req.params;
    const log = await Log.findById(id);
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
