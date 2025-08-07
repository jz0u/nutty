const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const path = require("path");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const DB_URI = process.env.mongodb_uri;

// middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// routes
const log_route = require("./routes/log.route.js")
app.use("/api/logs",log_route);

const user_route = require("./routes/user.route.js")
app.use("/api/users",user_route);

//pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/homepage/homepage.html"));
});

app.get("/login",(req,res) => {
  res.sendFile(path.join(__dirname, "public/loginpage/loginpage.html"));
});

app.get("/register", (req,res) => {
  res.sendFile(path.join(__dirname,"public/registerpage/registerpage.html"));
});

app.get("/dashboard",(req,res)=>{
  res.sendFile(path.join(__dirname,"public/dashboard/dashboardpage.html"))
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
