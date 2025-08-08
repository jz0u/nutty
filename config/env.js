const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const environment = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.mongodb_uri || process.env.MONGODB_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
};

module.exports = environment;


