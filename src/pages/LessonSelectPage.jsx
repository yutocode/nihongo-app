// src/pages/LessonSelectPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/LessonSelectPage.css";
import { useTranslation } from "react-i18next";

const LessonSelectPage = () => {
  const { level } = useParams(); // 例: "n5"
  const navigate = useNavigate();
  const { t } = useTranslation();

  const lessonCounts = {
    n5: 2,
    n4: 8,
    n3: 13,
    n2: 20,
    n1: 40,
  };

  const lessonCount = lessonCounts[level?.toLowerCase()] || 0;

  return (
    <div className="lesson-select-page">
      <h2>
        {t("lesson.title")} ({level?.toUpperCase()})
      </h2>
      <div className="lesson-buttons">
        {Array.from({ length: lessonCount }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => navigate(`/words/${level}/Lesson${i + 1}`)}
          >
            {t("lesson.part", { num: i + 1 })}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonSelectPage;
