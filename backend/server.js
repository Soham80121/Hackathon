require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const policyRoutes = require("./routes/policyRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const copilotRoutes = require("./routes/copilotRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const reportRoutes = require("./routes/reportRoutes");
const searchRoutes = require("./routes/searchRoutes");
const initCronJobs = require("./cron/jobs");

const app = express();
const auth = require("./middleware/authMiddleware");
const helmet = require("helmet");
const initAdmin = require("./utils/initAdmin");

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/assistant", aiRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/search", searchRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Kyuka AI Backend Running...");
});
app.get("/dashboard", auth, (req, res) => {

  res.json({
    message: "Welcome",
    user: req.user,
  });

});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    
    await initAdmin();
    initCronJobs();
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err.message);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});