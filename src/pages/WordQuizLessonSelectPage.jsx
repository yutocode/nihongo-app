// src/pages/WordQuizLessonSelectPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// クイズデータ
import * as n5Quiz from "../data/wordquiz/n5";
import * as n4Quiz from "../data/wordquiz/n4";
import * as n3Quiz from "../data/wordquiz/n3";
import * as n2Quiz from "../data/wordquiz/n2"; // N2 まで対応

// 文法レッスン選択と同じ見た目
import "../styles/GrammarLesson.css";

const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };
const LESSON_KEY_REGEX = /^Lesson\d+$/i;

// "Lesson10" が "Lesson2" より先に来ないよう数値ソート
const sortByLessonNumber = (a, b) => {
  const na = parseInt(String(a).match(/\d+/)?.[0] || "0", 10);
  const nb = parseInt(String(b).match(/\d+/)?.[0] || "0", 10);
  return na - nb;
};

export default function WordQuizLessonSelectPage() {
  const { level = "n5" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { normLevel, dataset, lessons } = useMemo(() => {
    const lv = String(level).toLowerCase(); // 'N5' -> 'n5'
    const levelMap = { n5: n5Quiz, n4: n4Quiz, n3: n3Quiz, n2: n2Quiz };
    const data = levelMap[lv] || {};
    const keys = Object.keys(data)
      .filter((k) => LESSON_KEY_REGEX.test(k))
      .sort(sortByLessonNumber);
    return { normLevel: lv, dataset: data, lessons: keys };
  }, [level]);

  return (
    <div className="grammar-wrap" role="main" aria-label="Word Quiz Lesson Select">
      {/* タイトル（文法ページとトーン合わせ） */}
      <h1>
        Word Quiz レッスン選択（{LEVEL_LABELS[normLevel] || normLevel.toUpperCase()}）
      </h1>

      {/* レッスン一覧 */}
      <div className="grid" role="list">
        {lessons.map((lessonKey) => {
          const num = lessonKey.replace(/\D/g, "");
          const label =
            t("wordquiz.lessonLabel", { num, defaultValue: `第 ${num} 課` });
          return (
            <button
              key={lessonKey}
              type="button"
              className="grammar-btn"
              role="listitem"
              title={t("wordquiz.openLesson", { num, defaultValue: "レッスンを開く" })}
              aria-label={label}
              onClick={() => navigate(`/word-quiz/${normLevel}/${lessonKey}`)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* データがない場合 */}
      {lessons.length === 0 && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          {t("common.comingSoon", { defaultValue: "準備中です" })}
        </p>
      )}
    </div>
  );
}
