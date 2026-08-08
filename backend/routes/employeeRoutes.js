const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

router.get("/", auth, restrictTo("admin", "hr"), getEmployees);
router.post("/", auth, restrictTo("admin", "hr"), createEmployee);
router.put("/:id", auth, restrictTo("admin", "hr"), updateEmployee);
router.delete("/:id", auth, restrictTo("admin", "hr"), deleteEmployee);

module.exports = router;
