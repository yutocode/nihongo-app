// src/pages/WordQuizLessonSelectPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// N5 だけ先行対応
import * as n5Quiz from "../data/wordquiz/n5";

// 見た目を文法のレッスン選択と同じにする
import "../styles/GrammarLesson.css";

const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

// "Lesson10" が "Lesson2" より先に来ないよう数値でソート
const sortByLessonNumber = (a, b) => {
  const na = parseInt(String(a).match(/\d+/)?.[0] || "0", 10);
  const nb = parseInt(String(b).match(/\d+/)?.[0] || "0", 10);
  return na - nb;
};

export default function WordQuizLessonSelectPage() {
  const { level = "n5" } = useParams();
  const nav = useNavigate();
  const { t } = useTranslation();

  // レベルごとのレッスンキーを取得（いまは n5 のみ）
  const lessons =
    level === "n5"
      ? Object.keys(n5Quiz || {}).sort(sortByLessonNumber)
      : [];

  return (
    <div className="grammar-wrap">
      {/* タイトルも文法ページと同じトーン */}
      <h1>Word Quiz Lesson Select ({LEVEL_LABELS[level] || level.toUpperCase()})</h1>

      <div className="grid">
        {lessons.map((lesson) => (
          <button
            key={lesson}
            type="button"
            className="grammar-btn"
            title={t("grammar.lessons.open", { num: lesson.replace(/\D/g, "") })}
            onClick={() => nav(`/word-quiz/${level}/${lesson}`)}
          >
            {lesson}
          </button>
        ))}
      </div>

      {lessons.length === 0 && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          {t("common.comingSoon", { defaultValue: "準備中です" })}
        </p>
      )}
    </div>
  );
}