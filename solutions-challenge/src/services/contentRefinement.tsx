import { GoogleGenerativeAI } from "@google/generative-ai"; 

class ContentRefinement {
    private genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_BEAUTIFY_KEY);
    private model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    private cache = new Map<string, string>(); 
    private iconBaseUrl = "https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/";

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
        You are an expert content refiner focused on maintaining perfect design consistency. Your task is to refine the HTML content while preserving the website's design system.

        **Input HTML Content:**
        \`\`\`html
        ${rawContent}
        \`\`\`

        **Design System Requirements:**
        1. Maintain these exact class names and structure:
           - Main container: <div class="content-wrapper prose dark:prose-invert max-w-none">
           - Headings: 
             * <h2 class="content-subtitle text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-200">
               <img src="${this.iconBaseUrl}idea.svg" class="flat-color-icon" alt="Idea icon" />
               Subtitle
             </h2>
           - Lists: 
             * <ul class="content-list space-y-2 my-4 text-gray-700 dark:text-gray-300">
               <li class="content-list-item">
                 <img src="${this.iconBaseUrl}checkmark.svg" class="flat-color-icon" alt="Checkmark icon" />
                 List item
               </li>
             </ul>
           - Tables: 
             * <div class="content-table-wrapper overflow-x-auto my-8 rounded-lg shadow-lg">
               <table class="content-table w-full border-collapse">
                 <thead>
                   <tr class="bg-gray-50 dark:bg-gray-800">
                     <th class="content-table-header p-4 text-left font-semibold border-b text-gray-900 dark:text-gray-100">
                       <img src="${this.iconBaseUrl}data_sheet.svg" class="flat-color-icon" alt="Data icon" />
                       Header
                     </th>
                   </tr>
                 </thead>
                 <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                   <tr class="content-table-row even:bg-gray-50 dark:even:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                     <td class="content-table-cell p-4 text-gray-700 dark:text-gray-300">Content</td>
                   </tr>
                 </tbody>
               </table>
             </div>
           - Blockquotes: 
             * <blockquote class="content-quote border-l-4 border-primary-500 dark:border-primary-400 pl-4 my-4 italic text-gray-700 dark:text-gray-300">
               <img src="${this.iconBaseUrl}advertising.svg" class="flat-color-icon" alt="Quote icon" />
               Quote content
             </blockquote>
           - Important text: 
             * <div class="content-highlight bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg my-4 text-gray-800 dark:text-gray-200">
               <img src="${this.iconBaseUrl}info.svg" class="flat-color-icon" alt="Important icon" />
               Important information
             </div>
           - Code blocks:
             * <div class="content-code bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 font-mono text-sm text-gray-800 dark:text-gray-200">
               <img src="${this.iconBaseUrl}code.svg" class="flat-color-icon" alt="Code icon" />
               <pre><code>Code content</code></pre>
             </div>
           - Links:
             * <a href="#" class="content-link text-primary-600 dark:text-primary-400 hover:underline">
               <img src="${this.iconBaseUrl}link.svg" class="flat-color-icon" alt="Link icon" />
               Link text
             </a>
           - Illustrations:
             * <div class="content-illustration my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
               <div class="flex items-center justify-between mb-4">
                 <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                   <img src="${this.iconBaseUrl}image_file.svg" class="flat-color-icon" alt="Image icon" />
                   Illustration Title
                 </h4>
                 <span class="text-sm text-gray-500 dark:text-gray-400">Figure 1</span>
               </div>
               [image: {search_term} : {detailed_prompt}]
               <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Caption text here</p>
             </div>

        2. Content Structure Requirements:
           - Ensure proper heading hierarchy
           - Maintain consistent spacing between elements
           - Preserve all design classes and Tailwind utilities
           - Ensure proper dark mode support
           - Maintain responsive design patterns

        3. Content Improvements:
           - Enhance readability while keeping design classes
           - Maintain proper spacing between elements
           - Keep math expressions properly formatted
           - Preserve image and code block formatting
           - Maintain consistent visual hierarchy
           - Keep proper color contrast in both light and dark modes

        4. Accessibility Requirements:
           - Ensure proper heading hierarchy
           - Add descriptive alt text for images
           - Use semantic HTML elements
           - Maintain good color contrast
           - Keep consistent spacing
           - Make tables responsive
           - Ensure all content is readable
           - Maintain proper focus states

        Return ONLY the refined HTML content with all design classes and icons intact. Do not include any markdown or additional text.
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

        // Add styles for icons and animations
        refinedContent = this.addEnhancements(refinedContent);

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
      
      // Convert markdown-style bold text to HTML bold tags
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
      
      // Ensure content is wrapped in a container
      if (!html.includes('<div class="content-wrapper"')) {
        html = `<div class="content-wrapper prose dark:prose-invert max-w-none">${html}</div>`;
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

    private addEnhancements(htmlContent: string): string {
      // Add icon styles
      const iconStyles = `
        <style>
          /* Icon Styles */
          img[src*="flat-color-icons"] {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.2em;
            height: 1.2em;
            margin-right: 0.3em;
            vertical-align: middle;
            transition: transform 0.2s ease;
          }

          img[src*="flat-color-icons"]:hover {
            transform: scale(1.1);
          }

          /* Dark mode adjustments */
          @media (prefers-color-scheme: dark) {
            img[src*="flat-color-icons"] {
              filter: brightness(1.2) drop-shadow(0 1px 2px rgba(0,0,0,0.1));
            }
          }

          /* Content wrapper styles */
          .content-wrapper {
            max-width: 100%;
            margin: 0 auto;
            padding: 0 0.4rem;
            overflow-x: hidden;
          }

          /* Table styles */
          .content-table-wrapper {
            margin: 1.5rem 0;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 100%;
          }

          .content-table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          .content-table th,
          .content-table td {
            padding: 0.75rem;
            border-bottom: 1px solid #e5e7eb;
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
          }

          .content-table th {
            width: auto;
            white-space: normal;
          }

          .content-table td {
            width: auto;
            white-space: normal;
          }

          /* Light mode table styles */
          .content-table tr:nth-child(even) {
            color: rgb(17 24 39);
          }

          .content-table tr:hover {
            color: rgb(17 24 39);
          }

          /* Dark mode table styles */
          @media (prefers-color-scheme: dark) {
            .content-table th,
            .content-table td {
              border-bottom-color: rgb(55 65 81);
            }

            .content-table tr:nth-child(even) {
              color: rgb(209 213 219);
            }

            .content-table tr:hover {
              color: rgb(209 213 219);
            }
          }
        </style>
      `;

      return `${iconStyles}${htmlContent}`;
    }
}

export default new ContentRefinement();