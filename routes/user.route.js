const express = require("express");
const User = require("../models/user.model.js");
const router = express.Router();
const { get_users, create_user, login, refresh } = require("../controllers/user.controller.js");

router.get("/", get_users); // get all users
router.post("/", create_user); // create new user
router.post("/login", login); // login
router.post("/refresh", refresh); // refresh token

module.exports = router;
