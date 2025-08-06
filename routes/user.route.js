const express = require("express");
const User = require("../models/user.model.js");
const router = express.Router();
const { get_users,create_user } = require("../controllers/user.controller.js");

router.get("/", get_users);
router.post("/",create_user);

module.exports = router;
