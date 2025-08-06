const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
require('dotenv').config();
const DB_URI = process.env.mongodb_uri;

mongoose.connect(DB_URI)
    .then(()=>{
        console.log("\nconnected to atlas\n");
        app.listen(
        PORT, () => console.log(`\nserver running on http://localhost:${PORT}\n`));
    })
    .catch(()=>{
        console.log("\nerror connecting to atlas\n");
    });

app.get('/', (req, res) => {
  res.send('Hello World!');
});
