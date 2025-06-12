import React from 'react';
import { X } from 'lucide-react';
import QuizComponent from './QuizComponent';
import { quizGenerator } from '../services/quizGenerator';
import { useThemeContext } from './ThemeProvider';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_BEAUTIFY_KEY);

interface QuizQuestion {
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation?: string;
}

interface Quiz {
  quizTitle: string;
  quizSynopsis: string;
  questions: QuizQuestion[];
}

interface QuizDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  level: string;
}

const QuizDrawer: React.FC<QuizDrawerProps> = ({ isOpen, onClose, prompt, level }) => {
  const [quiz, setQuiz] = React.useState<Quiz | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentFactIndex, setCurrentFactIndex] = React.useState(0);
  const [loadingFacts, setLoadingFacts] = React.useState<string[]>([]);
  const { getClasses, getCombinedClasses } = useThemeContext();

  React.useEffect(() => {
    if (isOpen && !quiz) {
      generateQuiz();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % loadingFacts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loading, loadingFacts]);

  const generateFacts = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const promptText = `Generate 2 interesting and educational facts about ${prompt} at ${level} level. Each fact should be concise and engaging. Return only the facts, one per line.`;
      const result = await model.generateContent(promptText);
      
      const response = await result.response;
      const text = response.text();
      console.log('Gemini response:', text); // Debug log
      
      // Split by newlines and filter out empty lines
      const facts = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('*') && !line.startsWith('-'));
      
      if (facts.length === 0) {
        throw new Error('No facts generated');
      }
      
      setLoadingFacts(facts);
    } catch (err) {
      console.error('Error generating facts:', err);
      setLoadingFacts([
        `Learning about ${prompt} at ${level} level can be fascinating!`,
        `Did you know that ${prompt} has many interesting aspects to explore?`
      ]);
    }
  };

  const generateQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate facts first
      await generateFacts();
      
      // Then generate the quiz
      const quizData = await quizGenerator.generateQuiz(prompt, "", level);
      setQuiz(quizData);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Error generating quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`p-4 border-b ${getCombinedClasses('border.primary', '')} flex items-center justify-between`}>
          <h2 className={`text-xl font-bold ${getClasses('text.primary')}`}>Quiz</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${getClasses('text.secondary')}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-12">
                <div className="w-full max-w-md mt-8">
                  <div className={`p-6 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 ${getClasses('text.primary')}`}>
                    <p className="text-sm font-medium mb-2">Did You Know?</p>
                    <p className="text-sm">{loadingFacts[currentFactIndex]}</p>
                  </div>
                </div>
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${getClasses('accent.blue')}`}></div>
              </div>
            ) : error ? (
              <div className={`text-center ${getCombinedClasses('text.primary', 'p-4')}`}>
                <p className="text-red-500">{error}</p>
                <button
                  onClick={generateQuiz}
                  className={`mt-4 px-4 py-2 ${getCombinedClasses('accent.blue', 'text-white rounded hover:opacity-90')}`}
                >
                  Try Again
                </button>
              </div>
            ) : quiz ? (
              <QuizComponent questions={quiz.questions} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDrawer; 