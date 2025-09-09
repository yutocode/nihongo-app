// src/pages/WordQuizLessonSelectPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// N5 / N4 / N3 / N2 に対応
import * as n5Quiz from "../data/wordquiz/n5";
import * as n4Quiz from "../data/wordquiz/n4";
import * as n3Quiz from "../data/wordquiz/n3";
import * as n2Quiz from "../data/wordquiz/n2"; // ← 追加

// 見た目を文法のレッスン選択と同じにする
import "../styles/GrammarLesson.css";

const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };
const LESSON_KEY_REGEX = /^Lesson\d+$/i;

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

  // レベルごとのクイズデータをマップ
  const levelMap = {
    n5: n5Quiz,
    n4: n4Quiz,
    n3: n3Quiz,
    n2: n2Quiz, // ← 追加：N2対応
    // n1 は今後追加
  };

  const dataset = levelMap[level] || {};

  // LessonXX だけ抽出して番号順に
  const lessons = Object.keys(dataset)
    .filter((k) => LESSON_KEY_REGEX.test(k))
    .sort(sortByLessonNumber);

  return (
    <div className="grammar-wrap">
      {/* タイトルも文法ページと同じトーン */}
      <h1>
        Word Quiz Lesson Select ({LEVEL_LABELS[level] || level.toUpperCase()})
      </h1>

      <div className="grid">
        {lessons.map((lessonKey) => (
          <button
            key={lessonKey}
            type="button"
            className="grammar-btn"
            title={t("grammar.lessons.open", {
              num: lessonKey.replace(/\D/g, ""),
              defaultValue: `レッスンを開く`,
            })}
            onClick={() => nav(`/word-quiz/${level}/${lessonKey}`)}
          >
            {lessonKey}
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
