import { GoogleGenerativeAI } from "@google/generative-ai";

class OutlineGenerator {
  private genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  private model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  async generateOutline(refinedPrompt: string, level: string, contentType: string): Promise<any> {
    try {
      const outlinePrompt = `
      You are an expert website architect and educational content planner. Your task is to create a beautiful, well-structured educational website outline that follows modern design principles and ensures excellent readability in both light and dark modes.

      **Refined Topic Prompt:** "${refinedPrompt}"
      **Level:** ${this.getLevelDisplay(level)}
      **Content Type:** ${contentType === "concise" ? "Concise - Quick Reads" : "Long form - Detailed"}

      **Content Structure Requirements:**
      1. Create a logical flow of topics that builds understanding progressively
      2. Each topic should have 2-4 subtopics for optimal content organization
      3. Ensure proper heading hierarchy and content progression
      4. Include visual elements where they enhance understanding
      5. Maintain consistent styling across all pages
      6. IMPORTANT: Each subtopic MUST have a unique page number, starting from 1 and incrementing sequentially

      **Design System Requirements:**
      1. Use these exact class names for consistent styling:
         - Main container: "content-wrapper prose dark:prose-invert max-w-none"
         - Headings: 
           * "content-title text-4xl font-bold mb-6"
           * "content-subtitle text-2xl font-semibold mt-8 mb-4"
           * "content-heading text-xl font-medium mt-6 mb-3"
         - Lists: 
           * "content-list space-y-2 my-4"
           * "content-list-item"
         - Tables: 
           * "content-table-wrapper overflow-x-auto my-8 rounded-lg shadow-lg"
           * "content-table w-full border-collapse"
           * "content-table-header p-4 text-left font-semibold border-b"
           * "content-table-cell p-4"
         - Blockquotes: 
           * "content-quote border-l-4 border-primary-500 dark:border-primary-400 pl-4 my-4 italic"
         - Important text: 
           * "content-highlight bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg my-4"
         - Illustrations:
           * "content-illustration my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"

      **Visual Elements:**
      1. Tables:
         - Use for comparisons, data presentation, and step-by-step guides
         - Include alternating row colors
         - Add hover effects
         - Ensure proper spacing and rounded corners
         - Make headers stand out
         - Add responsive wrapper

      2. Illustrations:
         - Use for complex concepts
         - Include process flows
         - Show visual examples
         - Add data visualization
         - Include descriptive captions

      3. Lists:
         - Use for key points
         - Include step-by-step instructions
         - Show feature comparisons
         - Add bullet points for quick reference

      **Required JSON Structure:**
      {
        "topics": [
          {
            "title": "Topic Title",
            "subtopics": [
              {
                "title": "Subtopic Title",
                "page": 1,
                "summary": "Detailed summary including key points, examples, and learning outcomes. Specify which design elements (tables, illustrations, lists) will be used and why.",
                "requires": ["Image", "Simulation", "Table", "List"]
              }
            ]
          }
        ],
        "totalPages": 5
      }

      **Important Notes:**
      1. Ensure the last topic is always "References"
      2. Each subtopic should have a clear purpose and learning outcome
      3. Specify required visual elements in the "requires" array
      4. Maintain consistent styling across all pages
      5. Consider both light and dark mode aesthetics
      6. CRITICAL: Each subtopic MUST have a unique page number, starting from 1 and incrementing sequentially

      Return ONLY the JSON structure with no additional text or explanations.
      `;

      const result = await this.model.generateContent(outlinePrompt);
      const responseText = await result.response.text();

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const jsonResponse = jsonMatch[0];
      const parsedData = JSON.parse(jsonResponse);

      // Validate required structure
      if (!parsedData.topics || !Array.isArray(parsedData.topics) || parsedData.topics.length === 0) {
        throw new Error("Invalid topics array in outline data");
      }

      // Validate and normalize each topic
      parsedData.topics = parsedData.topics.map((topic: any, topicIndex: number) => {
        if (!topic.title || !topic.subtopics || !Array.isArray(topic.subtopics)) {
          throw new Error(`Invalid topic structure at index ${topicIndex}`);
        }

        // Ensure last topic is References
        if (topicIndex === parsedData.topics.length - 1 && topic.title !== "References") {
          topic.title = "References";
        }

        // Validate and normalize subtopics
        topic.subtopics = topic.subtopics.map((subtopic: any, subtopicIndex: number) => {
          if (!subtopic.title || !subtopic.summary || typeof subtopic.page !== 'number') {
            throw new Error(`Invalid subtopic structure at topic ${topicIndex}, subtopic ${subtopicIndex}`);
          }

          // Ensure requires is an array of strings
          if (!Array.isArray(subtopic.requires)) {
            subtopic.requires = [];
          } else {
            subtopic.requires = subtopic.requires.filter((item: any) => typeof item === "string");
          }

          return subtopic;
        });

        return topic;
      });

      // Validate that each subtopic has a unique page number
      const pageNumbers = new Set<number>();
      let currentPage = 1;
      let hasError = false;

      for (const topic of parsedData.topics) {
        for (const subtopic of topic.subtopics) {
          if (pageNumbers.has(subtopic.page)) {
            console.error(`❌ Duplicate page number found: ${subtopic.page} for subtopic "${subtopic.title}"`);
            hasError = true;
          }
          pageNumbers.add(subtopic.page);
          subtopic.page = currentPage++; // Force sequential page numbers
        }
      }

      if (hasError) {
        console.warn('⚠️ Fixed duplicate page numbers by reassigning sequentially');
      }

      // Update totalPages to match the actual number of subtopics
      parsedData.totalPages = currentPage - 1;

      return parsedData;

    } catch (error) {
      throw new Error(`Failed to generate outline: ${error instanceof Error ? error.message : String(error)}`);
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

export default new OutlineGenerator();
