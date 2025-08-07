const express = require("express");
const router = express.Router();

const { get_users } = require("../controllers/user.controller");
const { admin_get_logs, admin_get_log } = require("../controllers/log.controller");

// Admin: manage users
router.get("/users", get_users);

// Admin: manage logs
router.get("/logs", admin_get_logs);
router.get("/logs/:id", admin_get_log);

module.exports = router;


