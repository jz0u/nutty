const express = require("express");
const router = express.Router();
const { create_user, login, refresh, get_me } = require("../controllers/user.controller.js");
const { authenticateToken } = require("../middleware/auth");

// self-profile for authenticated users
router.get("/me", authenticateToken, get_me);
router.post("/", create_user); // create new user
router.post("/login", login); // login
router.post("/refresh", refresh); // refresh token

module.exports = router;
