const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.analyzeWorkload = async (leaveRequest, overlappingLeavesCount, departmentSize, department) => {
  try {
    const systemPrompt = `You are an AI Workload Risk Analyst for HR. Your job is to analyze the risk to business operations if a requested leave is approved.
Return your response strictly in the following JSON format:
{
  "workloadRisk": "Safe" | "Risk" | "High Risk",
  "workloadReason": "Short explanation of the business impact"
}
`;

    const userPrompt = `
Department: ${department}
Department Size: ${departmentSize}
Employees currently on leave (or overlapping with this request): ${overlappingLeavesCount}
Leave Request Duration: ${leaveRequest.startDate} to ${leaveRequest.endDate}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "qwen/qwen3.6-27b",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Workload Agent Error:", error);
    return {
      workloadRisk: "Unknown",
      workloadReason: "Error reaching Workload Agent."
    };
  }
};
