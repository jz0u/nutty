const express = require("express");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const userRouter = require("./user.route");
const logRouter = require("./log.route");
const adminRouter = require("./admin.route");

const router = express.Router();

// Public routes
router.use("/users", userRouter);

// Protected routes
router.use("/logs", authenticateToken, logRouter);

// Admin routes
router.use("/admin", authenticateToken, requireAdmin, adminRouter);

module.exports = router;


