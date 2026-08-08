const User = require("../models/User");
const bcrypt = require("bcryptjs");

const initAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "hr.admin@hrflowai.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("HrAdmin@123", salt);

      const adminUser = new User({
        name: "HR Admin",
        email: "hr.admin@hrflowai.com",
        password: hashedPassword,
        role: "admin",
        designation: "System Administrator",
        status: "Active",
        mustChangePassword: false,
        firstLogin: false,
      });

      await adminUser.save();
      console.log("Default HR Admin account created successfully.");
    } else {
      console.log("HR Admin account already exists.");
    }
  } catch (error) {
    console.error("Failed to initialize HR Admin:", error);
  }
};

module.exports = initAdmin;
