// src/pages/GrammarLessonSelectPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarLesson.css";
import { n5ComparisonLessons } from "../../../data/grammar/n5/comparison";
import { useAppStore } from "../../../store/useAppStore";

const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

// 既定レッスン数（N5）
const N5_CATEGORY_COUNTS = {
  particles: 10,
  "verb-forms": 6,
  adjectives: 6,
  "exist-have": 6,
  compare: 0,
  comparison: 8,
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

  // ★ URL優先、無ければストアの現在レベルを使用
  const storeLevel = useAppStore((s) => s.level) || "n5";
  const level = useMemo(() => {
    const lv = String(rawLevel || storeLevel).toLowerCase();
    return LEVEL_LABELS[lv] ? lv : storeLevel;
  }, [rawLevel, storeLevel]);

  const category = String(rawCat).toLowerCase();

  if (!category) {
    return (
      <div className="grammar-wrap">
        <h1>{t("lesson.title")}</h1>
        <p>{t("grammar.lessons.hint")}</p>
      </div>
    );
  }

  const isComparison = category === "compare" || category === "comparison";
  const comparisonCount = Object.keys(n5ComparisonLessons || {}).length || 8;

  // N5のみ実データ、他は将来拡張（0ならComing soon）
  const total =
    level === "n5"
      ? isComparison
        ? comparisonCount
        : (N5_CATEGORY_COUNTS[category] ?? 0)
      : 0;

  // 未知・未実装カテゴリ
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
