const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { getReports } = require("../controllers/reportController");

// Only Admin can access these reports
router.get("/", auth, restrictTo("admin"), getReports);

module.exports = router;
