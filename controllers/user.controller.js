const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
require("dotenv");
const jwt = require("jsonwebtoken");

const get_users = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create_user = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const password = req.body.password;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ ...req.body, password: hash });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    //authentication
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.status(400).send("cannot find user");
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {//authenticated
      console.log(user);
      const payload = { id: user._id, name: user.name };
      const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
      console.log(access_token)
      res.json({access_token});
    } else {
      res.status(401).send("login failed");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  get_users,
  create_user,
  login,
};
