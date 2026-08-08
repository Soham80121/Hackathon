const User = require("../models/User");
const Leave = require("../models/Leave");
const Policy = require("../models/Policy");

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.json({ employees: [], leaves: [], policies: [] });
    }

    const regex = new RegExp(q, "i");

    // 1. Policies (Accessible to everyone)
    const policies = await Policy.find({ title: { $regex: regex } }).limit(5);

    // 2. Find matching user IDs for leave filtering by employee name
    const matchingUsers = await User.find({ name: { $regex: regex } }).select("_id");
    const matchingUserIds = matchingUsers.map(u => u._id);

    // 3. Employees
    let employees = [];
    if (req.user.role === "admin") {
      employees = await User.find({
        $or: [{ name: { $regex: regex } }, { department: { $regex: regex } }],
      })
        .select("-password")
        .limit(5);
    } else if (req.user.role === "hr") {
      employees = await User.find({
        $and: [
          { role: "employee" },
          { $or: [{ name: { $regex: regex } }, { department: { $regex: regex } }] },
        ],
      })
        .select("-password")
        .limit(5);
    }

    // 4. Leaves
    let leaves = [];
    const leaveQueryOr = [
      { leaveType: { $regex: regex } },
      { reason: { $regex: regex } },
      { userId: { $in: matchingUserIds } },
    ];

    if (req.user.role === "admin") {
      leaves = await Leave.find({ $or: leaveQueryOr })
        .populate("userId", "name department")
        .sort({ createdAt: -1 })
        .limit(5);
    } else if (req.user.role === "hr") {
      leaves = await Leave.find({
        $and: [{ applicantRole: "employee" }, { $or: leaveQueryOr }],
      })
        .populate("userId", "name department")
        .sort({ createdAt: -1 })
        .limit(5);
    } else {
      // Employee
      leaves = await Leave.find({
        $and: [{ userId: req.user.id }, { $or: leaveQueryOr }],
      })
        .populate("userId", "name department")
        .sort({ createdAt: -1 })
        .limit(5);
    }

    res.json({ employees, leaves, policies });
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({ message: "Server Error during search" });
  }
};
