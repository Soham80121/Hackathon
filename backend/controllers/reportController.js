const User = require("../models/User");
const Leave = require("../models/Leave");
const { deduplicateLeaves } = require("./leaveController");

exports.getReports = async (req, res) => {
  try {
    // 1. Total Employees (Admin sees both HR and Employee as employees)
    const totalEmployees = await User.countDocuments({ role: { $in: ["hr", "employee"] } });

    // 2. Leave statistics (Total, Pending, Approved, Rejected)
    let rawLeaves = await Leave.find().populate("userId", "department").sort({ createdAt: -1 });
    const leaves = deduplicateLeaves(rawLeaves);
    
    let totalLeaves = 0;
    let pendingLeaves = 0;
    let approvedLeaves = 0;
    let rejectedLeaves = 0;
    
    const leavesByType = {};
    const leavesByDepartment = {};
    const monthlyTrends = {};

    leaves.forEach((leave) => {
      totalLeaves++;
      
      // Status breakdown
      if (leave.status === "Pending") pendingLeaves++;
      if (leave.status === "Approved") approvedLeaves++;
      if (leave.status === "Rejected") rejectedLeaves++;

      // Type breakdown
      const type = leave.leaveType || "Unknown";
      leavesByType[type] = (leavesByType[type] || 0) + 1;

      // Department breakdown
      const department = leave.userId?.department || "Unknown";
      leavesByDepartment[department] = (leavesByDepartment[department] || 0) + 1;

      // Monthly trends
      const date = new Date(leave.startDate);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyTrends[monthYear] = (monthlyTrends[monthYear] || 0) + 1;
    });

    res.json({
      totalEmployees,
      totalLeaves,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      leavesByType,
      leavesByDepartment,
      monthlyTrends
    });
  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({ message: "Failed to generate reports", error: error.message });
  }
};
