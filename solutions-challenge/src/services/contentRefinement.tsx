import { GoogleGenerativeAI } from "@google/generative-ai"; 

class ContentRefinement {
    private genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    private model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    private cache = new Map<string, string>(); 

    async refineContent(rawContent: string): Promise<string> {
      try {
        if (this.cache.has(rawContent)) {
          console.log("✅ Serving refined content from cache");
          return this.cache.get(rawContent)!; 
        }

        console.log("🔹 Refining content...");

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
        - **Quick Read**: Make it concise. Use **bullet points, short paragraphs, and key takeaways**.
        - **Detailed Explanation**: Expand on concepts. Provide **in-depth breakdowns, multiple perspectives, and supporting evidence**.

        **Refinement Guidelines:**
        1. **Improve Clarity & Flow**: Ensure the content is **structured well** with **clear headings, subheadings, and logical flow**.
        2. **Use Visual & Interactive Elements**: Add **images, animations, or interactive components** where necessary.
        3. **Ensure Proper Math Formatting**: Use **LaTeX MathJax** for any **mathematical expressions**.
        4. **Include Engaging Analogies**: Provide **at least one simple analogy** for each **key concept**.
        5. **Ensure Valid HTML Output**: The final output should be **fully formatted HTML**, **ready for display**.

        **Example Refinement (Before & After):**
        ---
        **Before (Raw Content):**
        \`\`\`html
        <h1>What is Gravity?</h1>
        <p>Gravity is a force that attracts two objects toward each other. The more massive an object, the stronger its gravity.</p>
        \`\`\`

        **After (Refined Content - Explain Like 5 & Quick Read):**
        \`\`\`html
        <h1>🌍 What is Gravity?</h1>
        <p>Imagine you have a big magnet under the floor. 🌟 That’s like gravity! It pulls everything down so we don’t float away.</p>
        <p>Bigger objects have **stronger gravity**. That’s why the 🌞 **Sun** pulls planets around it!</p>
        <img src="gravity_example.png" alt="Gravity pulling objects down" />
        \`\`\`

        ---
        **After (Refined Content - Expert & Detailed Explanation):**
        \`\`\`html
        <h1>Understanding Gravity: General Relativity & Quantum Gravity</h1>
        <p>Gravity, according to Einstein’s General Relativity, is the **curvature of spacetime** caused by mass. Unlike Newtonian gravity, this model explains **gravitational time dilation** and the bending of light.</p>
        <p>However, **Quantum Gravity** seeks to unify General Relativity with Quantum Mechanics, proposing models such as **String Theory and Loop Quantum Gravity**.</p>
        <div class="math-container">
          \[ G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu} \]
        </div>
        <img src="spacetime_curvature.png" alt="Spacetime Curvature">
        \`\`\`

        **Final Output:** Return the fully refined **HTML content**.
        `;

        const result = await this.model.generateContent(refinementPrompt);
        const refinedContent = await result.response.text();

        this.cache.set(rawContent, refinedContent.trim()); 
        return refinedContent.trim();
      } catch (error) {
        console.error("❌ Error refining content:", error);
        return rawContent;
      }
    }
}

export default new ContentRefinement();
