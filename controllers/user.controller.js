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
  try {
    // basic validation
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const password = req.body.password;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ ...req.body, password: hash });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    // basic validation
    if (!req.body.name || !req.body.password) {
      return res.status(400).json({ message: "name and password are required" });
    }

    // authentication
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      // authenticated
      const payload = { id: user._id, name: user.name };
      const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
      res.json({ access_token });
    } else {
      res.status(401).json({ message: "invalid credentials" });
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
