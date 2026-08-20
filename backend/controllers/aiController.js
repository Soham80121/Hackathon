const Policy = require("../models/Policy");
const Stat = require("../models/Stat");
const AIQuery = require("../models/AIQuery");
const Notification = require("../models/Notification");
const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Fetch all policies
    const policies = await Policy.find();
    const policyContext = policies.map((p) => `Title: ${p.title}\nContent:\n${p.textContent}`).join("\n\n---\n\n");

    const systemPrompt = `You are a helpful HR assistant. Your job is to answer employee questions based ONLY on the provided HR policies below. 
If the answer is not found in the policies, you MUST reply with exactly: "This information is not available in the uploaded HR policies." 
Do not use any outside knowledge. Be concise and polite.

HR POLICIES:
${policyContext || "No policies uploaded yet."}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      model: "qwen/qwen3.6-27b",
      temperature: 0.2,
      max_tokens: 1024,
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content || "Sorry, I could not generate a response.";

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
      title: "AI Assistant Used",
      message: `You asked: "${message.substring(0, 30)}${message.length > 30 ? "..." : ""}"`,
      type: "info"
    });

    res.json({ message: aiMessage });
  } catch (error) {
    console.error("Groq API Error:", error.message || error);
    if (error.error?.code === "model_not_found" || error.message?.includes("does not exist")) {
      return res.status(404).json({ message: "AI Model not found or unavailable." });
    } else if (error.status === 401 || error.message?.includes("API key")) {
      return res.status(401).json({ message: "Invalid or missing API key." });
    } else if (error.status === 429) {
      return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
    }
    res.status(500).json({ message: "Failed to communicate with AI Assistant: " + (error.message || "Unknown error") });
  }
};

exports.getRecentQueries = async (req, res) => {
  try {
    const queries = await AIQuery.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(3)
      .select("question timestamp");
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent queries" });
  }
};
