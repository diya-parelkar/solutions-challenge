import { GoogleGenerativeAI } from "@google/generative-ai";
class ContentGenerator {
    private genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    private model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    private cache = new Map<string, string>(); 
  
    async generatePageContent(
      refinedPrompt: string,
      level: string,
      contentType: string,
      pageTitle: string,
      pageSummary: string,
      pageNumber: number,
      requires: string[]
    ): Promise<string> {
      try {
        const imageRequired = requires.includes("Image");
        const simulationRequired = requires.includes("Simulation");
        const animationRequired = requires.includes("Animation");

        const cacheKey = `${pageTitle}-${level}-${contentType}`;
  
        if (this.cache.has(cacheKey)) {
          console.log("✅ Serving from cache:", cacheKey);
          return this.cache.get(cacheKey)!; // Return cached response
        }
  
        console.log("🔹 Generating content for:", pageTitle);
  
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
        3. **For "Concise - Quick Reads" and levels above "Explain me like 5", prioritize brevity and key concepts. Avoid unnecessary detail.**
        4. Adjust the length and detail of the content according to **"${contentType}"**, prioritizing **comprehensive coverage and detailed explanations**, even for concise content types.
        5. ${imageRequired ? "Provide a detailed image prompt, formatted as [[image:prompt]]. Do not use alt attribute. Images should have minimal text." : ""}
        6. ${simulationRequired ? "Describe the simulation's functionality and purpose, providing detailed steps and interactions to be included." : ""}
        7. ${animationRequired ? "Describe the animation's sequence and key elements, including specific visual cues and transitions." : ""}
        8. Ensure the content is engaging, informative, and aligns with the educational objectives, **placing a strong emphasis on detailed explanations and examples.**
        9. Generate the content in **HTML format**, using the following tags and class names:
            * **Headings:** <h1>, <h2>, <h3> 
            * **Paragraphs:** <p> 
            * **Lists:** <ul>, <li> 
            * **Emphasis:** <strong> for bold text 
            * **Highlights:** <span class="highlight"> 
            * **Boxed Content:** <div class="box"> 
            * **Important Text:** <span class="important">
            * **Tables:** <table>, <tr>, <th>, <td>
            * **Code Blocks:** <pre><code class="language-LANGUAGE"> ... </code></pre> (Replace LANGUAGE with the appropriate language, e.g., python, javascript)
        10. **For any mathematical expressions, use KaTeX formatting:**
            Use '\\(' and '\\)' for inline math expressions (single backslash).
            Use '\\[' and '\\]' for block math expressions (single backslash).
        11. **If the ${pageTitle} is "References" (case-insensitive), create a comprehensive "References" section at the end of the HTML content, listing all sources used to generate the content. Format each reference in a clear and consistent style, including author, title, publication, and URL. Use <h1>, <h2>, <ul>, <li>, and <a> tags for formatting.**
        12. **Return ONLY the HTML content. Do NOT include any additional text, explanations, or greetings. Do NOT include any markdown code blocks. Return the HTML as plain text.**
        13. **If a comparison is needed, use a table to display the information. Ensure any image tags have an 'alt' attribute with [[image:prompt]] and 'AI generated' written in the description. Do not include a src attribute.**
        14. **Generate code blocks using the <pre><code> tags, and specify the programming language using the class attribute (e.g., <code class="language-python">).**
    
        **Generated Page Content:**
    `;
        const result = await this.model.generateContent(contentPrompt);
        const responseText = await result.response.text();
  
        this.cache.set(cacheKey, responseText.trim()); // ✅ Store result in cache
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
  