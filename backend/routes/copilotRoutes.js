const express = require("express");
const router = express.Router();
const { askCopilot } = require("../controllers/copilotController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected by authMiddleware, controller enforces admin/hr
router.post("/", authMiddleware, askCopilot);

module.exports = router;
