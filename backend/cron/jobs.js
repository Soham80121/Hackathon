const cron = require("node-cron");
const { runReminderCheck } = require("../services/agents/reminderAgent");

// Run every hour
const initCronJobs = () => {
  cron.schedule("0 * * * *", async () => {
    await runReminderCheck();
  });
};

module.exports = initCronJobs;
