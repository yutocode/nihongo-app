// src/components/QuizCard.jsx
import React, { useState } from "react";
import "../styles/QuizCard.css";

const QuizCard = ({ word, onAnswer, currentLang }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (option) => {
    setSelected(option);
    const isCorrect = option === word.meaning;
    setTimeout(() => {
      onAnswer(isCorrect); // 親に伝える
      setSelected(null);
    }, 800);
  };

  return (
    <div className="quiz-card">
      <h2>{word.kanji}</h2>
      <div className="quiz-options">
        {word.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(opt)}
            className={`option-btn ${selected === opt ? (opt === word.meaning ? "correct" : "wrong") : ""}`}
            disabled={selected !== null}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected && (
        <p className="explanation">
          📘 {word.explanation?.[currentLang] || "解説なし"}
        </p>
      )}
    </div>
  );
};

export default QuizCard;
