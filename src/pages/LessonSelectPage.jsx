// src/pages/LessonSelectPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/LessonSelectPage.css";

const LESSON_COUNTS = {
  n5: 14,
  n4: 12,
  n3: 36,
  n2: 20,
  n1: 40,
};

export default function LessonSelectPage() {
  const { level = "n5" } = useParams();               // ex) "n5"
  const navigate = useNavigate();
  const { t } = useTranslation();

  const normLevel = String(level).toLowerCase();
  const lessonCount = LESSON_COUNTS[normLevel] ?? 0;

  const lessons = useMemo(
    () => Array.from({ length: Math.max(lessonCount, 0) }, (_, i) => i + 1),
    [lessonCount]
  );

  const go = (lessonNo) => navigate(`/words/${normLevel}/Lesson${lessonNo}`);

  // タイトル: 「Select Lesson (N5)」※各言語に selectTitle を用意
  const title = t("lesson.selectTitle", {
    level: normLevel.toUpperCase(),
    defaultValue: `Select Lesson (${normLevel.toUpperCase()})`,
  });

  // サブタイトル（辞書に無ければ非表示）
  const subtitle = t("lesson.subtitle", { defaultValue: "" });

  return (
    <main className="lesson-select-page">
      <header className="lesson-select-head">
        <h2 className="lesson-title">{title}</h2>
        {subtitle && <p className="lesson-sub">{subtitle}</p>}
      </header>

      {lessonCount <= 0 ? (
        <div className="lesson-empty">
          {t("common.notFound", "No lessons are available for this level.")}
        </div>
      ) : (
        <div className="lesson-buttons" role="list">
          {lessons.map((no) => {
            // ボタン表示：各言語の "lesson.part"（例：第 {{num}} 課 / Lesson {{num}}）
            const label = t("lesson.part", {
              num: no,
              defaultValue: `Lesson ${no}`,
            });
            return (
              <button
                key={no}
                role="listitem"
                className="lesson-btn"
                type="button"
                onClick={() => go(no)}
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