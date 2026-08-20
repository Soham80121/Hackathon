const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.generateRecommendation = async (leaveRequest, policyContext) => {
  try {
    const systemPrompt = `You are an AI HR Leave Reviewer. Analyze the leave request using the provided HR policies.
Return your response strictly in the following JSON format:
{
  "recommendation": "Approve" | "Reject" | "Needs Review",
  "reason": "Short explanation based on policy and logic",
  "confidence": <number between 0 and 100>
}

RELEVANT HR POLICIES:
${policyContext}
`;

    const userPrompt = `
Leave Request:
Type: ${leaveRequest.leaveType}
Duration: ${leaveRequest.startDate} to ${leaveRequest.endDate}
Reason: ${leaveRequest.reason}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "qwen/qwen3.6-27b",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Recommendation Agent Error:", error);
    return {
      recommendation: "Needs Review",
      reason: "Error reaching AI Recommendation Agent.",
      confidence: 0
    };
  }
};
