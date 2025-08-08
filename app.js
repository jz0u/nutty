const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const env = require("./config/env");
const apiRouter = require("./routes");
const { errorHandler } = require("./middleware/error");

// middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// api routes
app.use("/api", apiRouter);

// pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/homepage/homepage.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/loginpage/loginpage.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/registerpage/registerpage.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboardpage/dashboardpage.html"));
});

// error handler
app.use(errorHandler);

mongoose
  .connect(env.mongodbUri)
  .then(() => {
    console.log("\nconnected to atlas\n");
    app.listen(env.port, () =>
      console.log(`\nserver running on http://localhost:${env.port}\n`)
    );
  })
  .catch(() => {
    console.log("\nerror connecting to atlas\n");
  });
