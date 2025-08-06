const express = require("express");
const Log = require("../models/log.model.js");
const router = express.Router();
const {
  get_logs,
  get_log,
  create_log,
  edit_log,
  delete_log,
} = require("../controllers/log.controller.js");

router.get("/", get_logs); //get all

router.get("/:id", get_log); //get by id

router.post("/", create_log); //create new entry

router.put("/:id", edit_log); //edit by id

router.delete("/:id", delete_log); //delete by id

module.exports = router;
