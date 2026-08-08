const Leave = require("../models/Leave");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { analyzePolicy } = require("../services/agents/policyAgent");
const { generateRecommendation } = require("../services/agents/recommendationAgent");
const { analyzeWorkload } = require("../services/agents/workloadAgent");
const { generateEmail } = require("../services/agents/emailAgent");

const deduplicateLeaves = (leaves) => {
  try {
    if (!Array.isArray(leaves)) return leaves;
    const seen = new Set();
    return leaves.filter(leave => {
      if (!leave) return false;
      let uid = 'unknown';
      if (leave.userId) {
        if (leave.userId._id) uid = leave.userId._id.toString();
        else uid = leave.userId.toString();
      }
      
      const start = leave.startDate ? new Date(leave.startDate).getTime() : 0;
      const end = leave.endDate ? new Date(leave.endDate).getTime() : 0;
      const type = leave.leaveType || 'unknown';
      const reason = leave.reason || 'none';
      
      const key = `${uid}-${type}-${start}-${end}-${reason}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  } catch (err) {
    console.error("Deduplication failed:", err);
    return leaves;
  }
};

exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // 0. Duplicate Protection
    const duplicateLeave = await Leave.findOne({
      userId: req.user.id,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "Pending"
    });

    if (duplicateLeave) {
      return res.status(409).json({ message: "A leave request with the same details is already pending." });
    }

    const leaveRequest = { leaveType, startDate, endDate, reason };

    // 1. Policy Agent
    const policyContext = await analyzePolicy(leaveRequest);

    // 2. Recommendation Agent
    const recommendation = await generateRecommendation(leaveRequest, policyContext);

    // 3. Workload Agent
    const user = await User.findById(req.user.id);
    const departmentSize = await User.countDocuments({ department: user.department });
    // Find overlapping leaves in same department
    const overlappingLeaves = await Leave.find({
      status: "Approved",
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    }).populate("userId");
    
    const departmentOverlaps = overlappingLeaves.filter(l => l.userId && l.userId.department === user.department).length;
    
    const workload = await analyzeWorkload(leaveRequest, departmentOverlaps, departmentSize, user.department);

    // 4. Create the Leave
    const confidenceValue = (typeof recommendation.confidence !== 'undefined') ? recommendation.confidence : (typeof recommendation.confidenceScore !== 'undefined' ? recommendation.confidenceScore : null);

    const newLeave = await Leave.create({
      userId: req.user.id,
      leaveType,
      startDate,
      endDate,
      reason,
      aiRecommendation: recommendation.recommendation || "Needs Review",
      aiReason: recommendation.reason || "",
      aiConfidence: confidenceValue,
      aiReviewedAt: confidenceValue !== null ? new Date() : null,
      policyEvidence: policyContext || "",
      workloadRisk: workload.workloadRisk || "Unknown",
      workloadReason: workload.workloadReason || "",
      applicantRole: req.user.role
    });

    // Notify appropriate users
    const notifyRole = req.user.role === 'employee' ? 'hr' : 'admin';
    const targetUsers = await User.find({ role: notifyRole }).select("_id");
    
    if (targetUsers.length > 0) {
      const notifications = targetUsers.map((u) => ({
        userId: u._id,
        title: "New Leave Request Submitted",
        message: `A new ${leaveType} request was submitted by ${user.name} (${req.user.role}). Risk: ${workload.workloadRisk}`,
        type: "info"
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json(newLeave);
  } catch (error) {
    console.error("Apply Leave Error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database connection is down. Please check your network or MongoDB Atlas." });
    }

    if (req.user.role === "admin") {
      const leaves = await Leave.find().populate("userId", "name email department role").sort({ createdAt: -1 });
      return res.json(deduplicateLeaves(leaves));
    } else if (req.user.role === "hr") {
      const employeeUsers = await User.find({ role: "employee" }).select("_id");
      const employeeIds = employeeUsers.map(u => u._id);

      const leaves = await Leave.find({
        $or: [
          { userId: req.user.id }, // Own leaves
          { applicantRole: "employee" }, // Employee leaves
          { userId: { $in: employeeIds } } // Fallback for older leaves missing applicantRole
        ]
      }).populate("userId", "name email department role").sort({ createdAt: -1 });
      return res.json(deduplicateLeaves(leaves));
    } else {
      // Exclude internal AI and workload fields for employees
      const leaves = await Leave.find({ userId: req.user.id })
        .populate("userId", "name email department role")
        .sort({ createdAt: -1 })
        .select('-aiRecommendation -aiReason -aiConfidence -workloadRisk -workloadReason -policyEvidence -aiReviewedAt');
      return res.json(deduplicateLeaves(leaves));
    }
  } catch (error) {
    console.error(error); res.status(500).json({ message: error.message, stack: error.stack });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(req.params.id).populate("userId", "name email role");

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    // Self-approval guard
    if (leave.userId?._id?.toString() === req.user.id) {
      return res.status(403).json({ message: "You cannot approve or reject your own leave." });
    }

    // HR guard
    const applicantRole = leave.applicantRole || leave.userId?.role;
    if (req.user.role === "hr" && applicantRole !== "employee") {
      return res.status(403).json({ message: "HR can only approve employee leaves." });
    }

    leave.status = status;

    if (req.user.role === "hr") {
      leave.hrReviewedBy = req.user.id;
      leave.hrReviewedByName = req.user.name;
      leave.hrReviewedAt = new Date();
    } else if (req.user.role === "admin") {
      leave.adminReviewedBy = req.user.id;
      leave.adminReviewedByName = req.user.name;
      leave.adminReviewedAt = new Date();
    }

    await leave.save();

    // Notify the employee
    if (leave.userId?._id) {
      await Notification.create({
        userId: leave.userId._id,
        title: `Leave ${status}`,
        message: `Your request for ${leave.leaveType} has been ${status.toLowerCase()}.`,
        type: status === "Approved" ? "success" : "error"
      });
    }

    // Use Email Agent
    if (leave.userId?.email) {
      await generateEmail("Leave Status Update", {
        recipientEmail: leave.userId.email,
        recipientId: leave.userId._id,
        leaveType: leave.leaveType,
        status: status
      });
    }

    res.json(leave);
  } catch (error) {
    console.error(error); res.status(500).json({ message: error.message, stack: error.stack });
  }
};

exports.getHighWorkloadRiskLeaves = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const leaves = await Leave.find({ workloadRisk: "High Risk", status: "Pending" })
        .populate("userId", "name department role")
        .select("startDate endDate workloadReason applicantRole");
      return res.json(deduplicateLeaves(leaves));
    } 
    
    if (req.user.role === "hr") {
      const employeeUsers = await User.find({ role: "employee" }).select("_id");
      const employeeIds = employeeUsers.map(u => u._id);

      const leaves = await Leave.find({ 
        workloadRisk: "High Risk", 
        status: "Pending",
        $or: [
          { applicantRole: "employee" },
          { userId: { $in: employeeIds } }
        ]
      })
      .populate("userId", "name department role")
      .select("startDate endDate workloadReason applicantRole");
      
      return res.json(deduplicateLeaves(leaves));
    }
    
    // Fallback (employee role is already blocked by restrictTo middleware, but just in case)
    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error(error); res.status(500).json({ message: error.message, stack: error.stack });
  }
};

exports.rerunAIForLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (leave.status !== "Pending") {
      return res.status(400).json({ message: "Can only re-run AI for pending leaves" });
    }

    const leaveRequest = {
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
    };

    // Policy + Recommendation + Workload
    const policyContext = await analyzePolicy(leaveRequest);
    const recommendation = await generateRecommendation(leaveRequest, policyContext);

    const user = await User.findById(leave.userId);
    const departmentSize = await User.countDocuments({ department: user.department });
    const overlappingLeaves = await Leave.find({
      status: "Approved",
      $or: [
        { startDate: { $lte: leave.endDate }, endDate: { $gte: leave.startDate } }
      ]
    }).populate("userId");

    const departmentOverlaps = overlappingLeaves.filter(l => l.userId && l.userId.department === user.department).length;
    const workload = await analyzeWorkload(leaveRequest, departmentOverlaps, departmentSize, user.department);

    const confidenceValue = (typeof recommendation.confidence !== 'undefined') ? recommendation.confidence : (typeof recommendation.confidenceScore !== 'undefined' ? recommendation.confidenceScore : null);

    leave.aiRecommendation = recommendation.recommendation || "Needs Review";
    leave.aiReason = recommendation.reason || "";
    leave.aiConfidence = confidenceValue;
    leave.aiReviewedAt = confidenceValue !== null ? new Date() : leave.aiReviewedAt;
    leave.policyEvidence = policyContext || leave.policyEvidence;
    leave.workloadRisk = workload.workloadRisk || leave.workloadRisk;
    leave.workloadReason = workload.workloadReason || leave.workloadReason;

    await leave.save();

    return res.json(leave);
  } catch (error) {
    console.error("Rerun AI Error:", error);
    return console.error(error); res.status(500).json({ message: error.message, stack: error.stack });
  }
};

exports.deduplicateLeaves = deduplicateLeaves;
