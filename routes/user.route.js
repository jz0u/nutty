const express = require("express");
const User = require("../models/user.model.js");
const router = express.Router();
const { get_users } = require("../controllers/user.controller.js");

router.get("/", get_users);

module.exports = router;
