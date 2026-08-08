const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const { getStats, getWeeklyAIQueries, getEmployeeStats, getAlerts } = require("../controllers/dashboardController");

router.get("/stats", auth, restrictTo("admin", "hr"), getStats);
router.get("/employee-stats", auth, getEmployeeStats);
router.get("/weekly-ai-queries", auth, getWeeklyAIQueries);
router.get("/alerts", auth, restrictTo("admin", "hr"), getAlerts);

module.exports = router;
