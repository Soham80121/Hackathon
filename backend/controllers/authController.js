const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Password entered:", password);

    const user = await User.findOne({ email });

    console.log("User from DB:", user);

    if (!user) {
      return res.status(404).json({
        message: "Account not found. Please contact your HR Administrator.",
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        message: "Account disabled. Please contact your HR Administrator.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

 

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }



    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

const { password: _, ...safeUser } = user.toObject();

// Create a login notification
await Notification.create({
  userId: user._id,
  title: "New Login",
  message: "Your account was recently logged into.",
  type: "info"
});

res.json({
  message: "Login successful",
  token,
  user: safeUser,
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};