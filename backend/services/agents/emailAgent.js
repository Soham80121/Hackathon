const { Groq } = require("groq-sdk");
const Notification = require("../../models/Notification");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.generateEmail = async (type, data) => {
  try {
    const systemPrompt = `You are an AI HR Email Generator. Generate a professional email subject and body based on the event provided.
Return your response strictly in the following JSON format:
{
  "subject": "Email Subject",
  "body": "Email Body (use plain text with newlines)"
}
`;

    const userPrompt = `
Event Type: ${type}
Details: ${JSON.stringify(data)}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "qwen/qwen3.6-27b",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const emailContent = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    if (emailContent.subject && emailContent.body) {
      console.log(`\n=== MOCK EMAIL SENT to ${data.recipientEmail || "Unknown"} ===\nSubject: ${emailContent.subject}\n\n${emailContent.body}\n====================================\n`);
      
      // Store as notification so it's not totally lost
      if (data.recipientId) {
        await Notification.create({
          userId: data.recipientId,
          title: `EMAIL SENT: ${emailContent.subject}`,
          message: emailContent.body,
          type: "info"
        });
      }
    }
    
    return emailContent;
  } catch (error) {
    console.error("Email Agent Error:", error);
    return null;
  }
};
