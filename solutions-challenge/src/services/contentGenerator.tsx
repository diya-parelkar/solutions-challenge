import { GoogleGenerativeAI } from "@google/generative-ai";

class ContentGenerator {
  private genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  private model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  async generatePageContent(
    refinedPrompt: string,
    level: string,
    contentType: string,
    pageTitle: string,     // ✅ Added pageTitle parameter
    pageSummary: string,   // ✅ Added pageSummary parameter
    pageNumber: number,    // ✅ Added pageNumber parameter
    requires: string[]     // ✅ Array containing "Image", "Simulation", "Animation"
  ): Promise<string> {
    try {
      const imageRequired = requires.includes("Image");
      const simulationRequired = requires.includes("Simulation");
      const animationRequired = requires.includes("Animation");

      const contentPrompt = `
        You are a highly skilled website content creator and educational material developer. Your task is to generate the exact content for a specific page of an educational website, based on the provided page outline, level, content type, and visual aid requirements.

        **Page Outline:**

        * **Page Number:** ${pageNumber}
        * **Page Title:** ${pageTitle}
        * **Summary:** ${pageSummary}
        * **Image:** ${imageRequired ? "Yes" : "No"}
        * **Simulation:** ${simulationRequired ? "Yes" : "No"}
        * **Animation:** ${animationRequired ? "Yes" : "No"}

        **Level:** ${this.getLevelDisplay(level)}
        **Content Type:** ${contentType === "concise" ? "Concise - Quick Reads" : "Long form - Detailed"}

        **Instructions:**
        1. Generate the content for **"${pageTitle}"**, expanding significantly on the provided ${pageSummary} and ensuring it thoroughly covers the topic.
        2. Tailor the language, depth, and complexity of the content to the specified "${this.getLevelDisplay(level)}" level, but provide **more in-depth explanations and examples** than previously.
        3. Adjust the length and detail of the content according to **"${contentType}"**, prioritizing **comprehensive coverage and detailed explanations**, even for concise content types.
        4. ${imageRequired ? "Describe the type of image that should be included, specifying key elements and details to be visually represented." : ""}
        5. ${simulationRequired ? "Describe the simulation's functionality and purpose, providing detailed steps and interactions to be included." : ""}
        6. ${animationRequired ? "Describe the animation's sequence and key elements, including specific visual cues and transitions." : ""}
        7. Ensure the content is engaging, informative, and aligns with the educational objectives, **placing a strong emphasis on detailed explanations and examples.
        8. Generate the content in **HTML format**, using the following tags and class names:
            * **Headings:** <h1>, <h2>, <h3>  
            * **Paragraphs:** <p>  
            * **Lists:** <ul>, <li>  
            * **Emphasis:** <strong> for bold text  
            * **Highlights:** <span class="highlight">  
            * **Boxed Content:** <div class="box">  
            * **Important Text:** <span class="important">  
        9.  **For any mathematical expressions, use KaTeX formatting:**
            Use '\(...\)' for inline math expressions. [do not forget the forward slashes]
            Use '\[...\]' for block math expressions.[do not forget the forward slashes]
        10. **Return only the HTML content**, without any extra text or explanations.

      **Generated Page Content:**
      `;

      console.log("🔹 Generating content for:", pageTitle);

      const result = await this.model.generateContent(contentPrompt);
      const responseText = await result.response.text();

      console.log("✅ Generated Page Content:", responseText);

      return responseText.trim();
    } catch (error) {
      console.error("❌ Error generating page content:", error);
      return "Error generating content.";
    }
  }

  private getLevelDisplay(levelCode: string): string {
    const levels: Record<string, string> = {
      "explain-like-im-5": "Explain Like I'm 5",
      "school-kid": "School Kid",
      "high-school": "High School",
      "graduate-student": "Graduate Student",
      "expert": "Expert",
    };
    return levels[levelCode] || "School Kid";
  }
}

export default new ContentGenerator();
