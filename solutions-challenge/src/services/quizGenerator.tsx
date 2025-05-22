import { GoogleGenerativeAI } from "@google/generative-ai";

interface QuizQuestion {
  question: string;
  questionType: string;
  answerSelectionType: string;
  answers: string[];
  correctAnswer: string;
  messageForCorrectAnswer: string;
  messageForIncorrectAnswer: string;
  explanation: string;
  point: string;
}

interface Quiz {
  quizTitle: string;
  quizSynopsis: string;
  progressBarColor: string;
  nrOfQuestions: string;
  questions: QuizQuestion[];
}

export class QuizGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_BEAUTIFY_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateQuiz(topic: string, content: string, level: string): Promise<Quiz> {
    try {
      console.log("🎯 Generating quiz for topic:", topic);
      
      const prompt = `
        Create a quiz with EXACTLY 6 multiple-choice questions for the following topic and content:
        Topic: ${topic}
        Content: ${content}
        Level: ${level}

        Requirements:
        1. Generate EXACTLY 6 questions
        2. Each question must have exactly 4 answer options
        3. Each question must test different aspects of the topic
        4. Questions should progress from basic to more complex concepts
        5. Include clear explanations for correct answers
        6. Match the specified difficulty level

        Return the quiz in this exact JSON format:
        {
          "quizTitle": "Quiz Title",
          "quizSynopsis": "Brief description of what the quiz covers",
          "progressBarColor": "#9de1f6",
          "nrOfQuestions": "6",
          "questions": [
            {
              "question": "Question text",
              "questionType": "text",
              "answerSelectionType": "single",
              "answers": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": "1",
              "messageForCorrectAnswer": "Correct answer. Good job.",
              "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
              "explanation": "Explanation of why this is the correct answer",
              "point": "20"
            }
          ]
        }

        Important rules:
        1. You MUST generate EXACTLY 6 questions
        2. correctAnswer must be a string number (1-based index)
        3. Each question MUST have exactly 4 answers
        4. Include messageForCorrectAnswer and messageForIncorrectAnswer for each question
        5. Set point value for each question (typically 20)
        6. Make sure the JSON is valid and properly formatted
        7. Do not include any markdown formatting in the response
        8. Return ONLY the JSON object, no additional text
      `;

      console.log("📤 Sending prompt to Gemini...");
      const result = await this.model.generateContent(prompt);
      const response = await result.response.text();
      
      try {
        // Clean the response by removing markdown code block markers and any extra text
        const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
        console.log("📝 Raw response:", response);
        console.log("🧹 Cleaned response:", cleanedResponse);
        
        const quiz = JSON.parse(cleanedResponse);
        
        // Validate the quiz has exactly 6 questions
        if (!quiz.questions || quiz.questions.length !== 6) {
          throw new Error(`Invalid number of questions: ${quiz.questions?.length || 0}. Expected 6.`);
        }
        
        console.log("✅ Quiz generated successfully with", quiz.questions.length, "questions");
        return quiz;
      } catch (e) {
        console.error("❌ Error parsing quiz response:", e);
        console.error("Raw response:", response);
        throw new Error("Failed to parse quiz response");
      }
    } catch (error) {
      console.error("❌ Error generating quiz:", error);
      throw error;
    }
  }
}

export const quizGenerator = new QuizGenerator();