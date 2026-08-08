const User = require("../models/User");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Get all employees (and HRs)
exports.getEmployees = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "admin") {
      query = { role: { $in: ["hr", "employee"] } };
    } else if (req.user.role === "hr") {
      query = { role: "employee" };
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const employees = await User.find(query).populate("createdBy", "name").select("-password").sort({ createdAt: -1 });
    
    // Ensure createdByName is always populated in the response
    const formattedEmployees = employees.map(emp => {
      const empObj = emp.toObject();
      if (!empObj.createdByName && empObj.createdBy && empObj.createdBy.name) {
        empObj.createdByName = empObj.createdBy.name;
      }
      return empObj;
    });
    
    res.json(formattedEmployees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, designation, phoneNumber, role, joiningDate } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // HR users CANNOT create another Admin
    if (req.user.role === "hr" && role === "admin") {
      return res.status(403).json({ message: "HR cannot create admin accounts" });
    }

    // Generate secure temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex') + "X9#";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      designation,
      phoneNumber,
      joiningDate,
      role: role || "employee",
      status: "Pending",
      mustChangePassword: true,
      firstLogin: true,
      createdBy: req.user.id,
      createdByName: req.user.name,
      createdByRole: req.user.role,
    });

    await Notification.create({
      userId: req.user.id,
      title: "New Employee Added",
      message: `${newUser.name} has been added to the system.`,
      type: "success"
    });

    const userObj = newUser.toObject();
    delete userObj.password;
    userObj.tempPassword = tempPassword; // Return once for the frontend modal
    res.status(201).json(userObj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role === "hr" && targetUser.role === "admin") {
      return res.status(403).json({ message: "HR cannot update admin accounts" });
    }
    
    // Prevent HR from changing someone's role to admin
    if (req.user.role === "hr" && req.body.role === "admin") {
      return res.status(403).json({ message: "HR cannot grant admin roles" });
    }

    // Prevent HR from changing their own role, etc.
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // HR users CANNOT Delete Admin
    if (req.user.role === "hr" && targetUser.role === "admin") {
      return res.status(403).json({ message: "HR cannot delete admin accounts" });
    }

    await User.findByIdAndDelete(req.params.id);

    await Notification.create({
      userId: req.user.id,
      title: "Employee Deleted",
      message: `${targetUser.name} has been removed from the system.`,
      type: "error" // Red theme
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
