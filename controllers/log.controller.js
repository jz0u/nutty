const Log = require("../models/log.model.js");

// Regular user: get only own logs
const get_logs = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user.id });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Regular user: get a specific log only if owned
const get_log = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findOne({ _id: id, user: req.user.id });
    if (!log) {
      return res.status(404).json({ message: "entry not found" });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create_log = async (req, res) => {
  try {
    const log = await Log.create({...req.body, user: req.user.id});
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const edit_log = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { new: true });
    if (!log) {
      return res.status(404).json({ message: "entry not found" });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const delete_log = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findOneAndDelete({ _id: id, user: req.user.id });
    if (!log) {
      return res.status(404).json({ message: "entry not found" });
    }
    res.status(200).json("entry deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: get all logs
const admin_get_logs = async (req, res) => {
  try {
    const logs = await Log.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: get any log by id
const admin_get_log = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findById(id);
    if (!log) {
      return res.status(404).json({ message: "entry not found" });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  get_logs,
  get_log,
  create_log,
  edit_log,
  delete_log,
  admin_get_logs,
  admin_get_log,
};
