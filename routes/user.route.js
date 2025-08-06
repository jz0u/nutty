const express = require("express");
const User = require("../models/user.model.js");
const router = express.Router();
const { get_users,create_user,login } = require("../controllers/user.controller.js");

router.get("/", get_users);//get all user 
router.post("/",create_user);//create new user
router.post("/login",login);//login

module.exports = router;
