const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config/env");
const User = require("../models/user.model");

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

async function requireAdmin(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.sendStatus(401);
    }
    const user = await User.findById(userId).select("role");
    const role = user && user.role ? user.role : "user";
    if (role !== "admin") {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticateToken, requireAdmin };


