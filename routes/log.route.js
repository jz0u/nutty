const express = require("express");
const router = express.Router();
const {
  get_logs,
  get_log,
  create_log,
  edit_log,
  delete_log,
} = require("../controllers/log.controller.js");
// api/logs/ (user-scoped)
router.get("/", get_logs); // list current user's logs
router.get("/:id", get_log); // get one current user's log
router.post("/", create_log); // create
router.put("/:id", edit_log); // update
router.delete("/:id", delete_log); // delete

module.exports = router;
