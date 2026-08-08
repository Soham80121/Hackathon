const { handleCopilotQuery } = require("../services/agents/hrCopilotAgent");
const Stat = require("../models/Stat");
const AIQuery = require("../models/AIQuery");
const Notification = require("../models/Notification");

exports.askCopilot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Must be admin or hr
    if (req.user.role !== "admin" && req.user.role !== "hr") {
      return res.status(403).json({ message: "Unauthorized. Copilot is for Admin/HR only." });
    }

    const aiMessage = await handleCopilotQuery(message);

    // Track analytics (increment AI queries)
    let stat = await Stat.findOne();
    if (!stat) {
      stat = await Stat.create({});
    }
    stat.aiQueries += 1;
    await stat.save();

    await AIQuery.create({
      userId: req.user.id,
      question: message
    });

    await Notification.create({
      userId: req.user.id,
      title: "HR Copilot Used",
      message: `You asked: "${message.substring(0, 30)}${message.length > 30 ? "..." : ""}"`,
      type: "info"
    });

    res.json({ message: aiMessage });
  } catch (error) {
    console.error("Copilot Error:", error);
    res.status(500).json({ message: "Failed to communicate with HR Copilot" });
  }
};
