const Log = require("../models/log.model.js");

const get_logs = async (req, res) => {
  try {
    const logs = await Log.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_log = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findById(id);
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create_log = async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const edit_log = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findByIdAndUpdate(id, req.body);
    if (!log) {
      return res.status(404).json({ message: "entry not found" });
    }
    const updated = await Log.findById(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const delete_log = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findByIdAndDelete(id);
    if (!log) {
      return res.status(404).json({ message: "entry not found" });
    }

    res.status(200).json("entry deleted successfully");
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
};
