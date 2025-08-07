const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const get_users = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create_user = async (req, res) => {
  try {
    // basic validation
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash, role: "user" });
    const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
    res.status(201).json(safeUser);
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
      const access_token = jwt.sign(payload, env.accessTokenSecret, { expiresIn: "15m" });
      const refresh_token = jwt.sign(payload, env.refreshTokenSecret, { expiresIn: "7d" });
      res.json({ access_token: access_token, refresh_token: refresh_token });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(401).json({ message: "refresh token is required" });
    }

    // verify refresh token
    jwt.verify(refresh_token, env.refreshTokenSecret, (error, user) => {
      if (error) {
        return res.status(403).json({ message: "invalid refresh token" });
      }
      
      // generate new access token
      const payload = { id: user.id, name: user.name };
      const new_access_token = jwt.sign(payload, env.accessTokenSecret, { expiresIn: "15m" });
      
      res.json({ access_token: new_access_token });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  get_users,
  create_user,
  login,
  refresh,
  get_me,
};
