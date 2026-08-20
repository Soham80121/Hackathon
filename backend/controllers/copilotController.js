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
    console.error("Copilot Error:", error.message || error);
    if (error.error?.code === "model_not_found" || error.message?.includes("does not exist")) {
      return res.status(404).json({ message: "AI Model not found or unavailable." });
    } else if (error.status === 401 || error.message?.includes("API key")) {
      return res.status(401).json({ message: "Invalid or missing API key." });
    } else if (error.status === 429) {
      return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
    }
    res.status(500).json({ message: "Failed to communicate with HR Copilot: " + (error.message || "Unknown error") });
  }
};
