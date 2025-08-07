const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const userRouter = require("./user.route");
const logRouter = require("./log.route");

const router = express.Router();

// Public routes
router.use("/users", userRouter);

// Protected routes
router.use("/logs", authenticateToken, logRouter);

module.exports = router;


