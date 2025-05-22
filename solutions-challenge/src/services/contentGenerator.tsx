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

        console.log("🔍 Content Requirements:", {
          imageRequired,
          simulationRequired,
          animationRequired,
          requires
        });

        const cacheKey = `${pageTitle}-${level}-${contentType}`;
  
        if (this.cache.has(cacheKey)) {
          console.log("✅ Serving from cache:", cacheKey);
          return this.cache.get(cacheKey)!; // Return cached response
        }
  
        console.log("🔹 Generating content for:", pageTitle);
        const contentPrompt = `
        You are a master web designer and content creator. Your task is to create stunning, visually appealing educational content that follows modern design principles.

        **Page Details:**
        * Page Number: ${pageNumber}
        * Title: ${pageTitle}
        * Summary: ${pageSummary}
        * Visual Requirements: ${imageRequired ? "Image" : ""} ${simulationRequired ? "Simulation" : ""} ${animationRequired ? "Animation" : ""}
        * Level: ${this.getLevelDisplay(level)}
        * Content Type: ${contentType === "concise" ? "Quick Read" : "Detailed Explanation"}

        ${animationRequired ? `
        **IMPORTANT: This content requires animations.**
        - Include at least one animation placeholder using the format: [animation: {search_term} : {detailed_prompt}]
        - search_term should be a short keyword for finding relevant animations
        - detailed_prompt should describe what the animation should show
        - Place animations in appropriate sections of the content
        - Include a descriptive caption for each animation
        ` : ''}

        **Design System Requirements:**
        1. Use these exact class names and structure:
           - Main container: <div class="content-wrapper prose dark:prose-invert max-w-none">
           - Headings: 
             * <h2 class="content-subtitle text-2xl font-semibold mt-2 mb-4">Subtitle</h2>
             * <h3 class="content-heading text-xl font-medium mt-6 mb-3">Heading</h3>
           - Lists: 
             * <ul class="content-list space-y-2 my-4">
             * <li class="content-list-item">List item</li>
           - Tables: 
             * <div class="content-table-wrapper overflow-x-auto my-8 rounded-lg shadow-lg">
               <table class="content-table w-full border-collapse">
                 <thead class="bg-gray-100 dark:bg-gray-800">
                   <tr>
                     <th class="content-table-header p-4 text-left font-semibold border-b text-gray-900 dark:text-gray-100">Header</th>
                   </tr>
                 </thead>
                 <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                   <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                     <td class="content-table-cell p-4 text-gray-900 dark:text-gray-300">Content</td>
                   </tr>
                   <tr class="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                     <td class="content-table-cell p-4">Content</td>
                   </tr>
                 </tbody>
               </table>
             </div>
           - Blockquotes: 
             * <blockquote class="content-quote border-l-4 border-primary-500 dark:border-primary-400 pl-4 my-4 italic">
               Quote content
             </blockquote>
           - Important text: 
             * <div class="content-highlight bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg my-4">
               Important information
             </div>
           - Illustrations:
             * <div class="content-illustration my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
               <div class="flex items-center justify-between mb-4">
                 <h4 class="text-lg font-semibold">Illustration Title</h4>
                 <span class="text-sm text-gray-500">Figure 1</span>
               </div>
               [image: {search_term} : {detailed_prompt}]
               <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Caption text here</p>
             </div>

           - Animations:
             * <div class="content-animation my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
               <div class="flex items-center justify-between mb-4">
                 <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                   <img src="https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/start.svg" class="flat-color-icon" alt="Animation icon" />
                   Animation Title
                 </h4>
               </div>
               [animation: {search_term} : {detailed_prompt}]
               <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Animation caption here</p>
             </div>

           - Timelines:
             * <div class="content-timeline my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
               <div class="flex items-center justify-between mb-4">
                 <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Timeline Title</h4>
               </div>
               <Timeline
                 title="Historical Events"
                 events={[
                   { date: "2020-01-01", label: "Event 1", description: "Description of event 1" },
                   { date: "2020-06-15", label: "Event 2", description: "Description of event 2" },
                   { date: "2021-03-30", label: "Event 3", description: "Description of event 3" }
                 ]}
               />
             </div>

        2. Visual Hierarchy and Spacing:
           - Use generous whitespace between sections (my-8)
           - Create visual hierarchy with font sizes and weights
           - Add subtle borders and rounded corners
           - Use consistent padding and margins
           - Implement responsive design patterns

        3. Rich Media Integration:
           - Images: 
             * Use high-quality, relevant images
             * Add rounded corners (rounded-xl)
             * Include subtle shadows (shadow-lg)
             * Add descriptive captions
             * Ensure proper aspect ratios
           - Tables:
             * Use alternating row colors
             * Add hover effects
             * Include proper spacing
             * Make headers stand out
             * Add responsive wrapper
           - Code blocks:
             * Include syntax highlighting
             * Add line numbers
             * Use proper padding
             * Include language indicator
           - Math:
             * Use proper KaTeX delimiters
             * Ensure responsive sizing
             * Add proper spacing

        4. Content Enhancement:
           - Start with an engaging introduction
           - Use clear section breaks
           - Include relevant examples in styled boxes
           - Add visual cues for important information
           - End with a concise summary
           - Use tables for:
             * Comparisons
             * Data presentation
             * Feature lists
             * Step-by-step guides
           - Use illustrations for:
             * Complex concepts
             * Process flows
             * Visual examples
             * Data visualization

        5. Accessibility and UX:
           - Ensure proper heading hierarchy
           - Add descriptive alt text for images
           - Use semantic HTML elements
           - Maintain good color contrast
           - Keep consistent spacing
           - Make tables responsive
           - Ensure all content is readable

        Return ONLY the HTML content with the specified class names and structure. Focus on creating a beautiful, engaging, and professional-looking page with well-designed tables and illustrations.
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
  