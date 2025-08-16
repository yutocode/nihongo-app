// src/pages/LessonSelectPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/LessonSelectPage.css";
import { useTranslation } from "react-i18next";

const LessonSelectPage = () => {
  const { level } = useParams(); // 例: "n5"
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ✅ JLPTレベルに応じたレッスン数を定義
  const lessonCounts = {
    n5: 2,
    n4: 8,
    n3: 13,
    n2: 20,
    n1: 40,
  };

  const lessonCount = lessonCounts[level?.toLowerCase()] || 0;

  // ✅ レッスン配列を生成（例: Lesson1〜Lesson40）
  const lessons = Array.from({ length: lessonCount }, (_, i) => `Lesson${i + 1}`);

  return (
    <div className="lesson-select-page">
      <h2>
        {t("selectLesson", "レッスンを選んでください")} ({level?.toUpperCase()})
      </h2>
      <div className="lesson-buttons">
        {lessons.map((lesson) => (
          <button
            key={lesson}
            onClick={() => navigate(`/words/${level}/${lesson}`)}
          >
            {t("lesson", "レッスン")} {lesson.replace("Lesson", "")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonSelectPage;
