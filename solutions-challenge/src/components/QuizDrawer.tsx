import React from 'react';
import { X } from 'lucide-react';
import QuizComponent from './QuizComponent';
import { quizGenerator } from '../services/quizGenerator';
import { useThemeContext } from './ThemeProvider';

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
  const { getClasses, getCombinedClasses } = useThemeContext();

  React.useEffect(() => {
    if (isOpen && !quiz) {
      generateQuiz();
    }
  }, [isOpen]);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
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
              <div className="flex items-center justify-center h-full">
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