import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

interface Question {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  difficulty: string;
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await api.get("/quiz?difficulty=medium");
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Quiz error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === questions[currentQuestion].answerIndex;
    if (correct) {
      setScore(score + 1);
    }
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        submitQuiz();
      }
    }, 2000);
  };

  const submitQuiz = async () => {
    try {
      const finalScore = score + (selectedAnswer === questions[currentQuestion].answerIndex ? 1 : 0);
      await api.post("/quiz/submit", {
        answers: {},
        score: finalScore / questions.length,
        difficulty: "medium"
      });
      setQuizCompleted(true);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-soft/50">Loading quiz...</p>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center glass-panel rounded-2xl p-8"
        >
          <h1 className="text-4xl font-display font-bold text-gold mb-4">
            Quiz Completed!
          </h1>
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-2xl text-soft mb-2">
            Your Score: {score}/{questions.length}
          </p>
          <p className="text-soft/50 mb-6">
            {Math.round((score / questions.length) * 100)}% Correct
          </p>
          <button
            onClick={resetQuiz}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold hover:from-gold/30 hover:to-gold/20 transition"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-display font-bold text-gold mb-4">
          History Quiz
        </h1>
        <p className="text-soft/70">
          Test your knowledge of historical events and figures
        </p>
      </motion.div>

      <div className="glass-panel rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-soft/50">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-gold">
              Score: {score}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {questions[currentQuestion] && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold text-soft mb-6">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3 mb-6">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !showResult && setSelectedAnswer(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    showResult
                      ? idx === questions[currentQuestion].answerIndex
                        ? "bg-green-500/20 border-green-500/50 text-green-400"
                        : idx === selectedAnswer
                        ? "bg-red-500/20 border-red-500/50 text-red-400"
                        : "bg-white/5 border-white/10 text-soft/50"
                      : selectedAnswer === idx
                      ? "bg-gold/20 border-gold/30 text-gold"
                      : "bg-white/5 border-white/10 text-soft hover:bg-white/10 hover:border-gold/30"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {!showResult && (
              <button
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold hover:from-gold/30 hover:to-gold/20 transition disabled:opacity-50"
              >
                Submit Answer
              </button>
            )}

            {showResult && (
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-soft/70">
                  {selectedAnswer === questions[currentQuestion].answerIndex
                    ? "✅ Correct!"
                    : "❌ Incorrect. Try the next question!"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
