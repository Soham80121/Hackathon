require('dotenv').config(); 
const mongoose = require('mongoose'); 
mongoose.connect(process.env.MONGO_URI).then(async () => { 
  const Leave = require('./models/Leave'); 
  const leaves = await Leave.find({ 
    workloadRisk: 'High Risk', 
    status: 'Pending', 
    applicantRole: { $in: ['employee', 'hr'] } 
  }).populate('userId', 'name department role').select('startDate endDate workloadReason applicantRole'); 
  
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
        console.log("Dedupe Key:", key);
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

  console.log(JSON.stringify(deduplicateLeaves(leaves), null, 2)); 
  process.exit(0); 
});
