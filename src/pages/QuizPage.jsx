// src/pages/QuizPage.jsx

import React, { useState, useEffect } from "react";
import QuizCard from "../components/QuizCard";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { n5WordSets } from "../data/n5WordSets";
import "../styles/QuizPage.css";


const QuizPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [currentPart] = useState("part1"); // ✅ part1 に修正（index.jsxのキーと一致させる）
  const [quizWords, setQuizWords] = useState([]);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const lessonWords = n5WordSets[currentPart] || [];
    const shuffled = [...lessonWords].sort(() => Math.random() - 0.5);
    setQuizWords(shuffled.slice(0, 10)); // 10問だけ出題（自由に変更可）
  }, [currentPart]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (questionIndex + 1 < quizWords.length) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      setTimeout(() => {
        navigate("/result", { state: { score: score + (isCorrect ? 1 : 0), total: quizWords.length } });
      }, 1000);
    }
  };

  if (quizWords.length === 0) return <p>Loading...</p>;

  return (
    <div className="quiz-page">
      <h2>{t("question")} {questionIndex + 1} / {quizWords.length}</h2>
      {!isFinished && (
        <QuizCard
          word={quizWords[questionIndex]}
          onAnswer={handleAnswer}
          currentLang={i18n.language}
        />
      )}
    </div>
  );
};

export default QuizPage;
