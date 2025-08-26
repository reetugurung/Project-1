const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analyticsController");
const auth = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole"); // correct name

// Only accessible by authenticated admin users
router.get("/", auth, authorizeRole("admin"), getAnalytics);

module.exports = router;
