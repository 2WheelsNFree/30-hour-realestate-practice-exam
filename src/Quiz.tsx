import React, { useState, useEffect } from 'react';
import questionsData from './questions_with_answers';
import './Quiz.css';


type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}   

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [current, setCurrent] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(10); // default to 10
  const [showQuestionPrompt, setShowQuestionPrompt] = useState<boolean>(true); //show prompt on first load
  
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestionId = questions[current]?.id;
      setSelected(userAnswers[currentQuestionId] || null);
    }
  }, [current, questions, userAnswers]);

  const handleAnswer = (option: string) => {
  if (selected) return;
  setSelected(option);
  setShowExplanation(true);

  setUserAnswers((prev) => ({
    ...prev,
    [questions[current].id]: option
  }));
};

    const nextQuestion = () => {
        if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
        setSelected(null);
        setShowExplanation(false);
        } else {
        calculateFinalScore();
        }
    };
    const calculateFinalScore = () => {
        let total = 0;
        for (const question of questions) {
            const userAnswer = userAnswers[question.id];
            if (userAnswer === question.answer) {
            total += 1;
            }
        }
        setScore(total);
        setFinished(true);
    };

  const previousQuestion = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const restartQuiz = () => {
  setShowQuestionPrompt(true);
  setFinished(false);
};


  const startQuizWithCount = () => {
    const count = Math.max(10, Math.min(200, questionCount));
    const shuffled = shuffleArray(questionsData).slice(0, count);

    setQuestions(shuffled);
    setUserAnswers({});
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowExplanation(false);
    setFinished(false);
    setShowQuestionPrompt(false);
};


  if (questions.length === 0 && showQuestionPrompt) {
  return (
    <div className="quiz-container">
      <h2 className="question-header">🧠 Ready to start your quiz?</h2>
      <p className="question-text">How many questions would you like (10–200)?</p>
      <input
        type="number"
        min={10}
        max={200}
        value={questionCount}
        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
        className="question-input"
      />
      <button
        onClick={startQuizWithCount}
        disabled={questionCount < 10 || questionCount > 200}
        className="start-button"
      >
        Start Quiz
      </button>
    </div>
  );
}


  if (finished) {
    return (
      <div>
        <h2>🎉 Quiz Completed!</h2>
        <p>Your score: {score} / {questions.length} ({((score / questions.length) * 100).toFixed(1)}%)</p>
        <p>{score >= questions.length / 2 ? 'Great job!' : 'Keep practicing!'}</p>
        {showQuestionPrompt ? (
        <div>
          <p className="question-text">How many questions would you like (10–200)?</p>
          <input
            type="number"
            min={10}
            max={200}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          />
          <button
            onClick={startQuizWithCount}
            disabled={questionCount < 10 || questionCount > 200}
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <button onClick={restartQuiz}>Restart Quiz</button>
      )}
    </div>
    );
  }

  const q = questions[current];

  return (
  <div className="quiz-container">
    <div className="question-header">
      <h2>Question {current + 1} of {questions.length}</h2>
      <p className="question-text">{q.question}</p>
    </div>

    <div className="options-grid">
      {q.options.map((option, idx) => (
        <button
          key={idx}
          className={`option-button ${
            selected
              ? option === q.answer
                ? "correct"
                : selected === option
                ? "incorrect"
                : ""
              : ""
          }`}
          onClick={() => handleAnswer(option)}
          disabled={!!selected}
        >
          {option}
        </button>
      ))}
    </div>

    {showExplanation && (
      <p className="explanation">
        💡 {q.explanation}
      </p>
    )}

    <div className="navigation-buttons">
      <button onClick={previousQuestion} disabled={current === 0}>
        ⬅️ Previous
      </button>
      <button onClick={nextQuestion}>
        ➡️ Next
      </button>
    </div>
  </div>
);
}

export default Quiz;
