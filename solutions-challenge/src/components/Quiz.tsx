import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useThemeContext } from './ThemeProvider';

interface QuizProps {
  quiz: {
    title: string;
    description: string;
    questions: Array<{
      question: string;
      answers: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  };
  onComplete?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const { getClasses } = useThemeContext();

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    if (answer === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete?.();
    }
  };

  // Simulate loading a 'Did You Know' fact
  const [didYouKnow, setDidYouKnow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{quiz.description}</p>
        <div className="mt-4">
          <p className="font-bold">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          <p>{quiz.questions[currentQuestion].question}</p>
          <div className="mt-2 space-y-2">
            {quiz.questions[currentQuestion].answers.map((answer, index) => (
              <Button
                key={index}
                variant={selectedAnswer === answer ? 'default' : 'outline'}
                onClick={() => handleAnswerSelect(answer)}
                disabled={selectedAnswer !== null}
                className="w-full"
              >
                {answer}
              </Button>
            ))}
          </div>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <p className="font-bold">Explanation:</p>
              <p>{quiz.questions[currentQuestion].explanation}</p>
              <Button onClick={handleNext} className="mt-2">
                {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Quiz; 