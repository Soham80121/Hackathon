const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  leaveType: {
    type: String,
    enum: ["Casual Leave", "Sick Leave", "Earned Leave", "Maternity Leave", "Paternity Leave"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  aiRecommendation: {
    type: String,
    enum: ["Approve", "Reject", "Needs Review", "Pending"],
    default: "Pending",
  },
  aiReason: {
    type: String,
    default: "",
  },
  aiConfidence: {
    type: Number,
    default: null,
  },
  aiReviewedAt: {
    type: Date,
    default: null,
  },
  policyEvidence: {
    type: String,
    default: "",
  },
  workloadRisk: {
    type: String,
    enum: ["Safe", "Risk", "High Risk", "Unknown"],
    default: "Unknown",
  },
  workloadReason: {
    type: String,
    default: "",
  },
  applicantRole: {
    type: String,
    enum: ["employee", "hr", "admin"],
    default: "employee",
  },
  hrReviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  hrReviewedByName: {
    type: String,
    default: "",
  },
  hrReviewedAt: {
    type: Date,
    default: null,
  },
  hrRemarks: {
    type: String,
    default: "",
  },
  adminReviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  adminReviewedByName: {
    type: String,
    default: "",
  },
  adminReviewedAt: {
    type: Date,
    default: null,
  },
  adminRemarks: {
    type: String,
    default: "",
  }
}, { timestamps: true });

module.exports = mongoose.model("Leave", leaveSchema);
