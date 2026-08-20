const { Groq } = require("groq-sdk");
const User = require("../../models/User");
const Leave = require("../../models/Leave");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.handleCopilotQuery = async (query) => {
  try {
    // Fetch summary data to feed the LLM
    const users = await User.find({}, "-password -tempPassword");
    const leaves = await Leave.find().populate("userId", "name department");

    const systemPrompt = `You are an HR Copilot AI. You have access to the company's employee data and leave data.
Answer the user's question based strictly on this data. Format your response cleanly using Markdown (e.g. lists, bold text). If the user asks for a specific list, provide it clearly.

EMPLOYEE DATA:
${JSON.stringify(users)}

LEAVE DATA:
${JSON.stringify(leaves)}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      model: "qwen/qwen3.6-27b",
      temperature: 0.1,
    });

    return chatCompletion.choices[0]?.message?.content || "Could not process request.";
  } catch (error) {
    throw error;
  }
};
