const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "hr", "employee"],
    default: "employee",
  },
  department: {
    type: String,
    default: "",
  },
  designation: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  joiningDate: {
    type: Date,
    default: null,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdByName: {
    type: String,
    default: "",
  },
  createdByRole: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Active", "Pending", "Inactive"],
    default: "Pending",
  },
  mustChangePassword: {
    type: Boolean,
    default: true,
  },
  firstLogin: {
    type: Boolean,
    default: true,
  },
  burnoutScore: {
    type: String,
    enum: ["Low", "Medium", "High", "Unknown"],
    default: "Unknown",
  },
  burnoutReason: {
    type: String,
    default: "",
  },
  companyName: {
    type: String,
    default: "Acme Corp",
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);