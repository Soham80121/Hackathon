const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "On Leave", "Inactive"],
    default: "Active",
  },
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
