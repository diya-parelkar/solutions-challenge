import { GoogleGenerativeAI } from "@google/generative-ai"; 

class ContentRefinement {
    private genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    private model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    private cache = new Map<string, string>(); 

    async refineContent(rawContent: string): Promise<string> {
      try {
        console.log("📥 Received raw content for refinement:", rawContent);

        // ✅ Check if already cached
        if (this.cache.has(rawContent)) {
          console.log("🚀 Serving refined content from cache.");
          return this.cache.get(rawContent)!; 
        }

        console.log("🔹 Refining content with AI...");

        const refinementPrompt = `
          You are an expert **educational content refiner**. Your task is to **improve** the provided HTML content by making it more engaging, structured, and suited to the target audience's learning level. 
      
          **Input HTML Content:**
          \`\`\`html
          ${rawContent}
          \`\`\`
      
          **Target Audience Levels & Customization:**
          Based on the user's selected level, adjust the content as follows:
      
          - **Explain Like 5 (School Kid)**: Use **very simple words** and analogies a **5-year-old** can understand. Break down complex ideas into **basic explanations** and use **cartoon-style visuals**.
          - **School Kid**: Use **age-appropriate** words. Explain "how" concepts relate and use **diagrams & interactive elements**.
          - **Graduate Student**: Use **technical terms** and deeper explanations. Include **scientific diagrams & latest research**.
          - **Expert**: Assume **prior knowledge** and focus on **cutting-edge research, open questions, and data-driven visuals**.
      
          **Content Type Considerations:**
          - **Quick Read**: Make it extremely concise and to-the-point. Use **bullet points, very short paragraphs, and key takeaways only**. Remove all unnecessary details.
          - **Detailed Explanation**: Expand on concepts. Provide **in-depth breakdowns, multiple perspectives, and supporting evidence**.
      
          **Refinement Guidelines:**
          1. **Improve Clarity & Flow**: Ensure the content is **structured well** with **clear headings, subheadings, and logical flow**.
          2. **Use Visual & Interactive Elements**: Add **images, animations, or interactive components** where necessary.
          3. **Ensure Proper Math Formatting**: Use **LaTeX MathJax** for any **mathematical expressions**. Make sure to properly format mathematical expressions with \\( \\) for inline and \\[ \\] for display equations.
          4. **Include Engaging Analogies**: Provide **at least one simple analogy** for each **key concept**.
          5. **Structure Content with Proper HTML**: Wrap content in a <div class="content-container">. Use proper heading hierarchy (h1, h2, h3). Use <p> for paragraphs, <ul>/<ol> for lists, <blockquote> for quotes, etc.
          6. **Ensure Valid HTML Output**: The final output should be **fully formatted HTML**. DO NOT include any triple backticks, markdown code blocks, or the words 'html' at the beginning or end of your response.
          7. **Return ONLY the HTML content**. Do NOT include any additional text, explanations, or greetings. Return the HTML as plain text.

          **Final Output:** Return the fully refined **HTML content in a <div class="content-container"> wrapper**.
        `;

        console.log("🧠 Sending request to AI model...");

        // ✅ API Call & Debugging Logs
        const result = await this.model.generateContent(refinementPrompt);
        console.log("🔍 API Raw Response:", result);

        if (!result || !result.response) {
          throw new Error("⚠️ AI API response is missing!");
        }

        let refinedContent = await result.response.text();
        
        if (!refinedContent.trim()) {
          throw new Error("⚠️ Empty response from AI!");
        }

        // Post-processing to ensure HTML validity
        refinedContent = this.postProcessHtml(refinedContent);

        // ✅ Cache result
        this.cache.set(rawContent, refinedContent); 

        console.log("✅ Refined Content Successfully Generated:", refinedContent);
        return refinedContent;

      } catch (error) {
        console.error("❌ Error refining content:", error);
        console.warn("⚠️ Returning unrefined content due to error.");
        return rawContent;
      }
    }

    private postProcessHtml(html: string): string {
      // Remove any remaining markdown code blocks
      html = html.replace(/```html|```/g, '').trim();
      
      // Ensure content is wrapped in a container
      if (!html.includes('<div class="content-container"')) {
        html = `<div class="content-container">${html}</div>`;
      }
      
      // Ensure proper spacing for LaTeX expressions
      html = html.replace(/\\(\(|\[)(.*?)\\(\)|\])/g, (match, p1, p2, p3) => {
        // Add spacing around math expressions for better rendering
        return p1 === '(' ? ` \\(${p2}\\) ` : ` \\[${p2}\\] `;
      });
      
      // Replace html entities with their actual characters
      html = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      
      return html;
    }
}

export default new ContentRefinement();