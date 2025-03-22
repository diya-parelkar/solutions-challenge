import { GoogleGenerativeAI } from "@google/generative-ai";

class PromptRefinement {
  private genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
  private model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  async refinePrompt(originalPrompt: string, level: string, contentType: string): Promise<string> {
    try {
      const refinementPrompt = `
        You are a sophisticated website content generator. Your task is to take a simple user prompt for a concept and expand it into a detailed request, considering the user's specified level and content type.

        **User Prompt:** ${originalPrompt}

        **Level:** ${this.getLevelDisplay(level)}

        **Content Type:** ${contentType === "concise" ? "Concise - Quick Reads" : "Long form - Detailed"}

        **Instructions:**
        1. Identify the key aspects of "${originalPrompt}" that are most educational.
        2. Tailor the explanation and depth of information based on the "${this.getLevelDisplay(level)}" level.
        3. Adjust the length and detail of the content based on the "${contentType === "concise" ? "Concise - Quick Reads" : "Long form - Detailed"}" preference.
        4. Include requirements for animations, illustrations, topic-wise information, and references.
        5. Return ONLY the refined prompt as a single paragraph with no explanations.

        **Refined Prompt:**
      `;

      console.log("🔹 Sending refinement request:", refinementPrompt);

      const result = await this.model.generateContent(refinementPrompt);
      const refinedText = await result.response.text();

      console.log("✅ Refined Prompt:", refinedText);
      return refinedText.trim();

    } catch (error) {
      console.error("❌ Error refining prompt:", error);
      return originalPrompt;
    }
  }

  private getLevelDisplay(levelCode: string): string {
    const levels: Record<string, string> = {
      "explain-like-im-5": "5-year-old",
      "school-kid": "elementary school",
      "high-school": "high school",
      "graduate-student": "graduate student",
      "expert": "expert"
    };
    return levels[levelCode] || "school-kid";
  }
}

export default new PromptRefinement();
