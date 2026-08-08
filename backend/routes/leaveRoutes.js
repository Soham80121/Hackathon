const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const { applyLeave, getLeaves, updateLeaveStatus, getHighWorkloadRiskLeaves } = require("../controllers/leaveController");

router.post("/", auth, restrictTo("employee", "hr"), applyLeave);
router.get("/", auth, getLeaves);
router.get("/high-workload-risk", auth, restrictTo("admin", "hr"), getHighWorkloadRiskLeaves);
router.put("/:id/status", auth, restrictTo("admin", "hr"), updateLeaveStatus);
// Re-run AI analysis for a pending leave (admin/hr only)
router.post("/:id/rerun-ai", auth, restrictTo("admin", "hr"), async (req, res) => {
	// delegated to controller for easier testing
	const { rerunAIForLeave } = require("../controllers/leaveController");
	return rerunAIForLeave(req, res);
});

module.exports = router;
