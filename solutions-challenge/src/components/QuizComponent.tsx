import React, { useState } from 'react';
import { useThemeContext } from './ThemeProvider';

interface QuizQuestion {
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

const QuizComponent: React.FC<QuizProps> = ({ questions = [] }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(questions?.length || 0).fill(null));
  const [showResults, setShowResults] = useState(false);
  const { getClasses, getCombinedClasses } = useThemeContext();

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(questions?.length || 0).fill(null));
    setShowResults(false);
  };

  if (!questions || questions.length === 0) {
    return <div className={`p-6 text-center ${getClasses('text.primary')}`}>No questions available.</div>;
  }

  const handleAnswer = (answer: string) => {
    if (userAnswers[currentQuestion] !== null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const isCorrect = (questionIndex: number) => {
    const question = questions[questionIndex];
    const correctAnswerIndex = parseInt(question.correctAnswer) - 1;
    return userAnswers[questionIndex] === question.answers[correctAnswerIndex];
  };

  const getCorrectAnswerText = (questionIndex: number) => {
    const question = questions[questionIndex];
    const correctAnswerIndex = parseInt(question.correctAnswer) - 1;
    return question.answers[correctAnswerIndex];
  };

  return (
    <div className={`p-6 max-w-xl mx-auto ${getCombinedClasses('background.card', 'rounded shadow border-2 border-gray-300 dark:border-gray-700')} my-8`}>
      {!showResults ? (
        <>
          <h2 className={`text-xl font-bold mb-4 ${getClasses('text.primary')}`}>
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <p className={`text-lg font-medium mb-4 ${getClasses('text.primary')}`}>
            {questions[currentQuestion].question}
          </p>
          <div className="flex flex-col space-y-3">
            {questions[currentQuestion].answers.map((answer, index) => {
              const selected = userAnswers[currentQuestion] === answer;
              const correctAnswerIndex = parseInt(questions[currentQuestion].correctAnswer) - 1;
              const correct = index === correctAnswerIndex;

              let btnClass = `p-3 border rounded cursor-pointer text-left ${getClasses('text.primary')}`;
              if (userAnswers[currentQuestion] !== null) {
                if (correct) {
                  btnClass += " bg-green-100 dark:bg-green-900 border-green-600 dark:border-green-400 text-green-800 dark:text-green-100 font-bold";
                } else if (selected) {
                  btnClass += " bg-red-100 dark:bg-red-900 border-red-600 dark:border-red-400 text-red-800 dark:text-red-100";
                } else {
                  btnClass += ` ${getCombinedClasses('border.secondary', '')}`;
                }
              } else {
                btnClass += ` ${getCombinedClasses('background.hover.button', 'hover:bg-opacity-50')}`;
              }

              return (
                <button
                  key={index}
                  className={btnClass}
                  onClick={() => handleAnswer(answer)}
                  disabled={userAnswers[currentQuestion] !== null}
                >
                  {answer}
                </button>
              );
            })}
          </div>

          {userAnswers[currentQuestion] !== null && (
            <>
              <p className={`mt-4 text-base font-medium ${getClasses('text.primary')}`}>
                {isCorrect(currentQuestion)
                  ? "✅ Correct!"
                  : `❌ Incorrect. Correct answer: `}
                {!isCorrect(currentQuestion) && (
                  <span className="font-bold text-green-700 dark:text-green-300">
                    {getCorrectAnswerText(currentQuestion)}
                  </span>
                )}
              </p>
              {questions[currentQuestion].explanation && (
                <p className={`text-base mt-2 ${getClasses('text.secondary')}`}>
                  {questions[currentQuestion].explanation}
                </p>
              )}
            </>
          )}
          
          <div className="flex gap-4 mt-6">
            {userAnswers[currentQuestion] !== null && (
              <button
                onClick={nextQuestion}
                className={`px-4 py-2 ${getCombinedClasses('accent.blue', 'text-black dark:text-white rounded border-2 border-opacity-20 hover:opacity-90 transition-colors font-medium')}`}
              >
                {currentQuestion + 1 === questions.length ? "Finish" : "Next"}
              </button>
            )}
            <button
              onClick={resetQuiz}
              className={`px-4 py-2 ${getCombinedClasses('background.hover.button', 'text-black dark:text-white rounded border-2 border-opacity-20 hover:opacity-90 transition-colors font-medium')}`}
            >
              Reset Quiz
            </button>
          </div>
        </>
      ) : (
        <div>
          <h2 className={`text-2xl font-bold mb-4 ${getClasses('text.primary')}`}>Results</h2>
          <p className={`mb-4 ${getClasses('text.primary')}`}>
            You scored{" "}
            {
              userAnswers.filter(
                (ans, i) => isCorrect(i)
              ).length
            }{" "}
            out of {questions.length}
          </p>
          {questions.map((question, i) => (
            <div
              key={i}
              className={`p-4 mb-4 border rounded ${
                isCorrect(i)
                  ? "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-500"
                  : "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-500"
              }`}
            >
              <p className={`font-medium ${getClasses('text.primary')}`}>{question.question}</p>
              <p className={getClasses('text.primary')}>
                Your answer:{" "}
                <span className="font-semibold">{userAnswers[i] ?? "Not answered"}</span>
              </p>
              <p className={getClasses('text.primary')}>Correct answer: {getCorrectAnswerText(i)}</p>
              {question.explanation && (
                <p className={`mt-2 ${getClasses('text.secondary')}`}>{question.explanation}</p>
              )}
            </div>
          ))}
          <div className="flex justify-center mt-6">
            <button
              onClick={resetQuiz}
              className={`px-6 py-2 ${getCombinedClasses('accent.blue', 'text-black dark:text-white rounded border-2 border-opacity-20 hover:opacity-90 transition-colors font-medium')}`}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;