const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Notification = require("../models/Notification");

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, role, companyName, emailNotifications } = req.body;
    // For simplicity, we update User fields. The frontend has companyName and emailNotifications.
    // We can update the User model to include these, or just update the base fields.
    // Let's assume User has them, or we just ignore fields not in schema for now.
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    if (companyName !== undefined) user.companyName = companyName;
    if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
    
    await user.save();

    await Notification.create({
      userId: req.user.id,
      title: "Profile Updated",
      message: "Your profile information was updated successfully.",
      type: "info"
    });

    const { password: _, ...safeUser } = user.toObject();
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.status = "Active";
    user.mustChangePassword = false;
    user.firstLogin = false;
    await user.save();
    
    await Notification.create({
      userId: req.user.id,
      title: "Password Changed",
      message: "Your account password was recently changed.",
      type: "warning"
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
