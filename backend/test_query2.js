require('dotenv').config(); 
const mongoose = require('mongoose'); 
mongoose.connect(process.env.MONGO_URI).then(async () => { 
  const Leave = require('./models/Leave'); 
  const User = require('./models/User'); 
  
  const adminLeaves = await Leave.find({ 
    workloadRisk: 'High Risk', 
    status: 'Pending', 
    applicantRole: { $in: ['employee', 'hr'] } 
  }).populate('userId', 'name department role').select('startDate endDate workloadReason applicantRole'); 
  
  const employeeUsers = await User.find({ role: "employee" }).select("_id");
  const employeeIds = employeeUsers.map(u => u._id);

  const hrLeaves = await Leave.find({ 
    workloadRisk: "High Risk", 
    status: "Pending",
    $or: [
      { applicantRole: "employee" },
      { userId: { $in: employeeIds } }
    ]
  }).populate("userId", "name department role").select("startDate endDate workloadReason applicantRole");

  console.log("Admin:", adminLeaves.length);
  console.log("HR:", hrLeaves.length);
  process.exit(0); 
});
