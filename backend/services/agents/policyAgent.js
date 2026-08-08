const { Groq } = require("groq-sdk");
const Policy = require("../../models/Policy");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.analyzePolicy = async (leaveRequest) => {
  try {
    const policies = await Policy.find();
    if (!policies || policies.length === 0) return "No policies available.";

    const policyContext = policies.map((p) => `Title: ${p.title}\nContent:\n${p.textContent}`).join("\n\n---\n\n");

    const systemPrompt = `You are an expert HR Policy Assistant. Given the following company HR policies and an employee's leave request, extract and summarize ONLY the specific clauses or rules that are relevant to this leave request. Do not make a decision, just provide the relevant policy text/summary.

HR POLICIES:
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
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    return chatCompletion.choices[0]?.message?.content || "Could not retrieve policy data.";
  } catch (error) {
    console.error("Policy Agent Error:", error);
    return "Error analyzing policy.";
  }
};
