const { Groq } = require("groq-sdk");
const Leave = require("../../models/Leave");
const Notification = require("../../models/Notification");
const { generateEmail } = require("./emailAgent");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.runReminderCheck = async () => {
  try {
    console.log("[Reminder Agent] Running automated checks...");

    // Check for pending leaves older than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const oldPendingLeaves = await Leave.find({ status: "Pending", createdAt: { $lte: twentyFourHoursAgo } });

    if (oldPendingLeaves.length > 0) {
      console.log(`[Reminder Agent] Found ${oldPendingLeaves.length} leaves pending for > 24 hours.`);
      
      const adminNotification = await Notification.create({
        userId: oldPendingLeaves[0].userId, // Ideally notify Admin, just storing it here
        title: "Reminder: Pending Leaves",
        message: `There are ${oldPendingLeaves.length} leave requests that have been pending for over 24 hours.`,
        type: "info"
      });

      // Draft reminder email
      await generateEmail("Leave Reminder", {
        details: `There are ${oldPendingLeaves.length} pending leaves requiring HR attention.`,
      });
    }

    // Additional logic like probation checking can be added here
    
    console.log("[Reminder Agent] Check complete.");
  } catch (error) {
    console.error("Reminder Agent Error:", error);
  }
};
