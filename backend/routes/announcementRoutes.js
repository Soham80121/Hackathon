const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
} = require("../controllers/announcementController");

// Accessible to all authenticated users
router.get("/", auth, getAnnouncements);

// Restricted to admin
router.post("/", auth, restrictTo("admin"), createAnnouncement);
router.put("/:id", auth, restrictTo("admin"), updateAnnouncement);
router.delete("/:id", auth, restrictTo("admin"), deleteAnnouncement);

module.exports = router;
