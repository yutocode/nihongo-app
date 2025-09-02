// src/pages/GrammarLessonSelectPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarLesson.css";
import { n5ComparisonLessons } from "../../../data/grammar/n5/comparison";

const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

// 既定レッスン数（比較は下で上書き）
const N5_CATEGORY_COUNTS = {
  particles: 10,
  "verb-forms": 6,
  adjectives: 6,
  "exist-have": 6,
  compare: 0,
  comparison: 8, // compare と同義
  "intent-plan": 8,
  "ask-permit": 6,
  basic: 0,
};

const CAT_I18N_KEY = {
  particles: "grammar.categories.particles",
  "verb-forms": "grammar.categories.verbForms",
  adjectives: "grammar.categories.adjectives",
  "exist-have": "grammar.categories.existHave",
  compare: "grammar.categories.compare",
  comparison: "grammar.categories.compare",
  "intent-plan": "grammar.categories.intentPlan",
  "ask-permit": "grammar.categories.askPermit",
  basic: "grammar.categories.basic",
};

function makeLessonPath(level, category, num) {
  const cat = String(category).toLowerCase();
  if (cat === "compare" || cat === "comparison") {
    return `/grammar/${level}/comparison/Lesson${num}`;
  }
  if (cat === "exist-have") {
    return `/grammar/${level}/exist-have/Lesson${num}`;
  }
  return `/grammar/${level}/${cat}/lesson${num}`;
}

export default function GrammarLessonSelectPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { level: rawLevel = "", category: rawCat = "" } = useParams();

  const level = String(rawLevel).toLowerCase();
  const category = String(rawCat).toLowerCase();

  const isKnownLevel = level in LEVEL_LABELS;

  if (!isKnownLevel) {
    return (
      <div className="grammar-wrap">
        <h1>{t("grammar.level.title")}</h1>
        <div className="grid">
          {Object.keys(LEVEL_LABELS).map((lv) => (
            <button
              key={lv}
              type="button"
              className="grammar-btn"
              onClick={() => navigate(`/grammar/${lv}`)}
              title={LEVEL_LABELS[lv]}
            >
              {LEVEL_LABELS[lv]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="grammar-wrap">
        <h1>{t("lesson.title")}</h1>
        <p>{t("grammar.lessons.hint")}</p>
      </div>
    );
  }

  const isComparison = category === "compare" || category === "comparison";
  const comparisonCount =
    Object.keys(n5ComparisonLessons || {}).length || 8; // フォールバック8

  // レッスン数の決定
  const total =
    level === "n5"
      ? isComparison
        ? comparisonCount
        : (N5_CATEGORY_COUNTS[category] ?? 0)
      : 0;

  // 未知カテゴリは Coming soon
  if (total === 0) {
    return (
      <div className="grammar-wrap">
        <h1>
          {t("grammar.lessons.title", {
            level: LEVEL_LABELS[level],
            category: t(CAT_I18N_KEY[category] ?? "", { defaultValue: rawCat }),
          })}
        </h1>
        <p>{t("grammar.categories.comingSoon")}</p>
      </div>
    );
  }

  const lessons = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="grammar-wrap">
      <h1>
        {t("grammar.lessons.title", {
          level: LEVEL_LABELS[level],
          category: t(CAT_I18N_KEY[category] ?? "", { defaultValue: rawCat }),
        })}
      </h1>

      <div className="grid">
        {lessons.map((num) => (
          <button
            key={num}
            type="button"
            className="grammar-btn"
            onClick={() => navigate(makeLessonPath(level, category, num))}
            title={t("grammar.lessons.open", { num })}
          >
            {t("grammar.lessons.open", { num })}
          </button>
        ))}
      </div>
    </div>
  );
}
