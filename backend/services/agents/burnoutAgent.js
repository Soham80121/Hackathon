const { Groq } = require("groq-sdk");
const User = require("../../models/User");
const Leave = require("../../models/Leave");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.analyzeBurnout = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Get leaves taken by the user in the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentLeaves = await Leave.find({ 
      userId: userId, 
      status: "Approved", 
      startDate: { $gte: sixMonthsAgo } 
    });

    const totalLeaveDays = recentLeaves.reduce((acc, leave) => {
      const diffTime = Math.abs(new Date(leave.endDate) - new Date(leave.startDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return acc + diffDays;
    }, 0);

    const joiningDateStr = user.joiningDate ? new Date(user.joiningDate).toDateString() : "Unknown";

    const systemPrompt = `You are an AI HR Burnout Predictor. Analyze the employee's data to predict their burnout risk.
Return your response strictly in the following JSON format:
{
  "burnoutScore": "Low" | "Medium" | "High",
  "burnoutReason": "Short explanation based on the data"
}
`;

    const userPrompt = `
Employee Department: ${user.department}
Employee Designation: ${user.designation}
Joined Company On: ${joiningDateStr}
Total Approved Leave Days taken in the last 6 months: ${totalLeaveDays}
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

    const response = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
    
    if (response.burnoutScore) {
      user.burnoutScore = response.burnoutScore;
      user.burnoutReason = response.burnoutReason || "";
      await user.save();
    }
    
    return response;
  } catch (error) {
    console.error("Burnout Agent Error:", error);
    return null;
  }
};
