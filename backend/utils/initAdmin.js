const User = require("../models/User");
const bcrypt = require("bcryptjs");

const initAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        console.warn("Startup Warning: ADMIN_EMAIL or ADMIN_PASSWORD environment variables are missing.");
        console.warn("Cannot create the initial Admin account.");
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

      const adminUser = new User({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        designation: "System Administrator",
        status: "Active",
        mustChangePassword: false,
        firstLogin: false,
      });

      await adminUser.save();
      console.log("Initial Admin account created successfully.");
    } else {
      console.log("Admin account already exists.");
    }
  } catch (error) {
    console.error("Failed to initialize Admin:", error);
  }
};

module.exports = initAdmin;
