require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to MongoDB");
  await User.updateMany({ role: "Employee" }, { $set: { role: "employee" } });
  await User.updateMany({ role: "Admin" }, { $set: { role: "admin" } });
  console.log("Updated roles");
  process.exit(0);
}).catch(console.error);
