const User = require("../models/User");
const Policy = require("../models/Policy");
const Stat = require("../models/Stat");
const AIQuery = require("../models/AIQuery");

exports.getStats = async (req, res) => {
  try {
    let userQuery = {};
    if (req.user.role === "admin") {
      userQuery = { role: { $in: ["hr", "employee"] } };
    } else if (req.user.role === "hr") {
      userQuery = { role: "employee" };
    } else {
      userQuery = { _id: req.user.id }; // Fallback
    }

    const totalEmployees = await User.countDocuments(userQuery);
    const totalPolicies = await Policy.countDocuments();
    
    let stat = await Stat.findOne();
    if (!stat) {
      stat = { aiQueries: 0 };
    }

    let leaveQuery = { status: "Pending" };
    if (req.user.role === "admin") {
      leaveQuery.userId = { $ne: req.user.id };
    } else if (req.user.role === "hr") {
      leaveQuery.applicantRole = "employee";
    }

    const pendingLeaveRequests = await Leave.countDocuments(leaveQuery);

    const recentPolicies = await Policy.find()
      .select("title uploadedAt")
      .sort({ uploadedAt: -1 })
      .limit(5);

    res.json({
      totalEmployees,
      totalPolicies,
      totalAiQueries: stat.aiQueries || 0,
      pendingLeaveRequests,
      recentPolicies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWeeklyAIQueries = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start of 7 days ago

    // Fetch queries from the last 7 days
    const queryFilter = {
      timestamp: {
        $gte: sevenDaysAgo,
        $lte: today
      }
    };
    
    // If not admin, only fetch their own queries
    if (req.user.role !== "admin") {
      queryFilter.userId = req.user.id;
    }

    const queries = await AIQuery.find(queryFilter);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const results = [];

    // Initialize the last 7 days array
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      results.push({
        day: days[d.getDay()],
        queries: 0,
        dateString: d.toISOString().split("T")[0] // Used for matching
      });
    }

    // Populate queries count
    queries.forEach(q => {
      const dateStr = new Date(q.timestamp).toISOString().split("T")[0];
      const resultObj = results.find(r => r.dateString === dateStr);
      if (resultObj) {
        resultObj.queries += 1;
      }
    });

    // Remove the dateString helper field before sending
    const finalResults = results.map(({ day, queries }) => ({ day, queries }));

    res.json(finalResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeStats = async (req, res) => {
  try {
    const totalPolicies = await Policy.countDocuments();
    
    const myQueries = await AIQuery.countDocuments({ userId: req.user.id });

    const recentPolicies = await Policy.find()
      .select("title uploadedAt")
      .sort({ uploadedAt: -1 })
      .limit(5);

    const currentUser = await User.findById(req.user.id).select("burnoutScore burnoutReason");

    res.json({
      totalPolicies,
      totalAiQueries: myQueries,
      recentPolicies,
      burnoutScore: currentUser?.burnoutScore || "Low",
      burnoutReason: currentUser?.burnoutReason || ""
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Leave = require("../models/Leave");

exports.getAlerts = async (req, res) => {
  try {
    const highBurnoutUsers = await User.find({ burnoutScore: "High" }).select("name department burnoutReason");
    
    res.json({
      highBurnoutUsers,
      highRiskLeaves: [] // Frontend handles this separately now
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
