// src/pages/LessonSelectPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// ← ページ内ホームを消すので FiHome は不要
import "../styles/LessonSelectPage.css";

const LESSON_COUNTS = {
  n5: 14,
  n4: 12,
  n3: 36,
  n2: 20,
  n1: 40,
};

export default function LessonSelectPage() {
  const { level = "n5" } = useParams(); // /lessons/:level
  const navigate = useNavigate();
  const { t } = useTranslation();

  const normLevel = String(level).toLowerCase();
  const lessonCount = LESSON_COUNTS[normLevel] ?? 0;

  const lessons = useMemo(
    () => Array.from({ length: Math.max(lessonCount, 0) }, (_, i) => i + 1),
    [lessonCount]
  );

  const goLesson = (no) => navigate(`/words/${normLevel}/Lesson${no}`);

  const title = t("lesson.selectTitle", {
    level: normLevel.toUpperCase(),
    defaultValue: `選択 ${normLevel.toUpperCase()} レッスン`,
  });

  return (
    <main className="lesson-select-page" role="main" aria-label={title}>
      {/* ← ここにあった黒帯内ホームは削除。共通 Header 側のホームだけ表示 */}

      {lessonCount <= 0 ? (
        <div className="lesson-empty">
          {t("common.notFound", "このレベルのレッスンは見つかりませんでした。")}
        </div>
      ) : (
        <div className="lesson-buttons" role="list">
          {lessons.map((no) => {
            const label = t("lesson.part", { num: no, defaultValue: `第 ${no} 課` });
            return (
              <button
                key={no}
                className="lesson-btn"
                type="button"
                role="listitem"
                onClick={() => goLesson(no)}
                aria-label={label}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}
