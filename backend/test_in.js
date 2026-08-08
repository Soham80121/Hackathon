require('dotenv').config(); 
const mongoose = require('mongoose'); 
mongoose.connect(process.env.MONGO_URI).then(async () => { 
  const Leave = require('./models/Leave'); 
  const l = await Leave.find({ _id: '6a76cc81ff6e6fb5a0b805f0', applicantRole: { $in: ['employee', 'hr'] } }); 
  console.log('Match with $in:', l.length); 
  process.exit(0); 
});
