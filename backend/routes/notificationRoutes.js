const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getNotifications);
router.put("/read-all", auth, markAllAsRead);
router.put("/:id/read", auth, markAsRead);
router.delete("/", auth, deleteAllNotifications);
router.delete("/:id", auth, deleteNotification);

module.exports = router;
