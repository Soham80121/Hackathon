const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, priority, expiresAt } = req.body;

    const announcement = new Announcement({
      title,
      message,
      priority: priority || "Normal",
      createdBy: req.user.id,
      createdByName: req.user.name,
      expiresAt: expiresAt || null,
    });

    await announcement.save();

    // Create notifications for HR and Employees
    const targetUsers = await User.find({ role: { $in: ["hr", "employee"] } }).select("_id");
    
    if (targetUsers.length > 0) {
      const notifications = targetUsers.map((user) => ({
        userId: user._id,
        title: "📢 New Announcement",
        message: title,
        type: "info",
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    let query = {};
    
    // Non-admins can only see active announcements that haven't expired
    if (req.user.role !== "admin") {
      query.isActive = true;
      query.$or = [
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } }
      ];
    }

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, message, priority, expiresAt, isActive } = req.body;
    
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    announcement.title = title || announcement.title;
    announcement.message = message || announcement.message;
    announcement.priority = priority || announcement.priority;
    if (expiresAt !== undefined) announcement.expiresAt = expiresAt;
    if (isActive !== undefined) announcement.isActive = isActive;

    await announcement.save();
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    await announcement.deleteOne();
    res.json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
