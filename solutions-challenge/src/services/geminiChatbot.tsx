export default class GeminiChatbotService {
    private static API_KEY = import.meta.env.VITE_GEMINI_CHATBOT_API_KEY;

    static async getResponse(userMessage: string, promptTitle: string, level: string): Promise<string> {
        if (!this.API_KEY) {
            console.error("API key is missing! Please check your .env file.");
            return "⚠️ **Configuration error**. Please try again later.";
        }

        try {
            console.log("Sending message to Gemini API:", userMessage);

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: `Context: User asks about "${promptTitle}" at "${level}" level. Provide a brief, clear response.
                                        User: ${userMessage}`,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();
            console.log("Full API Response:", data);

            // Extract bot response correctly
            const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ **I couldn't process your request.**";
            console.log("Extracted Bot Response:", botResponse);

            return botResponse;
        } catch (error) {
            console.error("Error fetching Gemini response:", error);
            return "❌ **Something went wrong.** Please try again.";
        }
    }
}
