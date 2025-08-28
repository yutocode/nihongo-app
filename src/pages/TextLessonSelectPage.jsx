// src/pages/TextLessonSelectPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TextLessonPage.css";

export default function TextLessonSelectPage() {
  const { level, category } = useParams();
  const navigate = useNavigate();

  const lessons = Array.from({ length: 10 }, (_, i) => `Lesson${i + 1}`);

  return (
    <div className="text-lesson-wrap">
      <h1>{level.toUpperCase()} - {category} のレッスンを選んでください</h1>
      <div className="grid">
        {lessons.map((lesson) => (
          <button
            key={lesson}
            onClick={() => navigate(`/text/${level}/${category}/${lesson.toLowerCase()}`)}
          >
            {lesson}
          </button>
        ))}
      </div>
    </div>
  );
}
