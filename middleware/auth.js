const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config/env");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; 
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, accessTokenSecret, (error, user) => {
    if (error) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };


