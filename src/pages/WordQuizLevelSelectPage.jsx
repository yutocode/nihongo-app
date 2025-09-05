// src/pages/WordQuizLevelSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/LevelSelectPage.css";
import "../styles/WordQuiz.css"; // ボタン用スタイル

export default function WordQuizLevelSelectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const levels = ["n5", "n4", "n3", "n2", "n1"];

  return (
    <div className="level-select-page">
      <h2>{t("wordquiz.selectLevel", "Word Quiz — レベルを選ぶ")}</h2>
      <div className="level-buttons">
        {levels.map((lv) => (
          <button
            key={lv}
            onClick={() => navigate(`/word-quiz/${lv}`)}
            aria-label={`Go to ${lv.toUpperCase()} lessons`}
          >
            {lv.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}