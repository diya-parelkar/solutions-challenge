import { GoogleGenerativeAI } from "@google/generative-ai";

class OutlineGenerator {
  private genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  private model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  async generateOutline(refinedPrompt: string, level: string, contentType: string): Promise<any> {
    try {
        const outlinePrompt = `
        You are an expert website architect and educational content planner. Your task is to analyze a refined topic prompt and generate a structured website outline for an educational website, considering the specified level and content type.
    
        **Refined Topic Prompt:** "${refinedPrompt}"
    
        **Level:** ${this.getLevelDisplay(level)}
    
        **Content Type:** ${contentType === "concise" ? "Concise - Quick Reads" : "Long form - Detailed"}
    
        **Instructions:**
        1. Analyze the refined topic and extract the core concepts and learning objectives.
        2. Organize the topic into logical sections with **topics and subtopics**, ensuring depth and complexity align with the specified **"Level"**.
        3. Determine the optimal number of pages needed to cover the topic, adjusting detail and length based on **"Content Type"**.
        4. Generate **clear and concise page titles** that accurately reflect the content of each page.
        5.  Provide a **more detailed summary** (4-6 sentences) of the content that should be included on each page, outlining key points, examples, and intended learning outcomes, adjusting the detail and vocabulary based on the "Level".
        6. Determine whether **images, simulations, or animations** should be included for each page.
            - Return these as an **array of strings** in \`"requires"\`, e.g., \`["Image", "Simulation"]\` or \`[]\` if none.
        7. **Ensure the last topic (containing the last page, with page number equal to totalPages) has the title "References".**
        8. Output the website structure outline in **structured JSON format ONLY**, with NO explanations or additional text.
    
        **Example JSON Format:** {
            "topics": [
                {
                    "title": "Topic Title",
                    "subtopics": [
                        {
                            "title": "Subtopic Title",
                            "page": 1,
                            "summary": "Short summary of the content.",
                            "requires": ["Image", "Simulation"]
                        },
                        // ... other subtopics
                    ]
                },
                // ... other topics
            ],
            "totalPages": 5
        }
    `;

      console.log("🔹 Sending outline generation request:", outlinePrompt);

      const result = await this.model.generateContent(outlinePrompt);
      const responseText = await result.response.text();

      console.log("✅ Raw Response from API:", responseText);

      // ✅ Ensure only valid JSON is parsed
      const jsonStartIndex = responseText.indexOf("{");
      const jsonEndIndex = responseText.lastIndexOf("}");

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        const jsonResponse = responseText.substring(jsonStartIndex, jsonEndIndex + 1);

        try {
          const parsedData = JSON.parse(jsonResponse);

          // ✅ Ensure "requires" is always an array of strings
          parsedData.topics.forEach((topic: any) => {
            topic.subtopics.forEach((subtopic: any) => {
              if (!Array.isArray(subtopic.requires)) {
                subtopic.requires = [];
              } else {
                subtopic.requires = subtopic.requires.filter((item: any) => typeof item === "string");
              }
            });
          });

          return parsedData;
        } catch (parseError) {
          console.error("❌ JSON parsing error:", parseError, "Response:", jsonResponse);
          return null;
        }
      } else {
        console.warn("❌ API response does not contain valid JSON:", responseText);
        return null;
      }
    } catch (error) {
      console.error("❌ Error generating outline:", error);
      return null;
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
