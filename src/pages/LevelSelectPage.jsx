// src/pages/LevelSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LevelSelectPage.css";
import { useTranslation } from "react-i18next";

const LevelSelectPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const levels = ["n5", "n4", "n3", "n2", "n1"];

  return (
    <div className="level-select-page">
      <h2>{t("selectLevel", "レベルを選んでください")}</h2>
      <div className="level-buttons">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => navigate(`/lessons/${level}`)}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelectPage;
