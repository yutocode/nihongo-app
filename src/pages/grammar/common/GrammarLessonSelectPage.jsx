// src/pages/grammar/common/GrammarLessonSelectPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarLesson.css";
import { useAppStore } from "../../../store/useAppStore";

const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

/** レッスン数（ここだけで管理） */
const LESSON_COUNTS = {
  n5: {
    particles: 10,
    "verb-forms": 3,
    adjectives: 6,
    "exist-have": 6,
    "intent-plan": 8,
    "ask-permit": 6,
    comparison: 0,
    basic: 0,
  },
  n4: {
    comparison: 8,
    "tense-aspect": 8,        // 旧スラッグ
    "tense-aspect-jlpt": 8, 
    particles: 10  // 本線
  },
  n3: {},
  n2: {},
  n1: {},
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
  "tense-aspect": "grammar.categories.tenseAspect",
  "tense-aspect-jlpt": "grammar.categories.tenseAspect",
};

function normalizeLessonNum(num) {
  const n = Number(num);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function makeLessonPath(level, category, num) {
  const cat = String(category).toLowerCase();
  const lv = String(level).toLowerCase();

  if (cat === "compare" || cat === "comparison") {
    return `/grammar/n4/comparison/Lesson${normalizeLessonNum(num)}`;
  }
  if (cat === "tense-aspect" || cat === "tense-aspect-jlpt") {
    return `/grammar/n4/tense-aspect-jlpt/Lesson${normalizeLessonNum(num)}`;
  }
  if (cat === "exist-have") {
    return `/grammar/${lv}/exist-have/Lesson${normalizeLessonNum(num)}`;
  }
  return `/grammar/${lv}/${cat}/lesson${normalizeLessonNum(num)}`;
}

export default function GrammarLessonSelectPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { level: rawLevel = "", category: rawCat = "" } = useParams();

  // URL の level を優先、無ければストアの level
  const storeLevel = useAppStore((s) => s.level) || "n5";
  const level = useMemo(() => {
    const lv = String(rawLevel || storeLevel).toLowerCase();
    return LEVEL_LABELS[lv] ? lv : storeLevel;
  }, [rawLevel, storeLevel]);

  const category = String(rawCat).toLowerCase();
  const isComparison = category === "compare" || category === "comparison";
  const isAspect = category === "tense-aspect" || category === "tense-aspect-jlpt";

  if (!category) {
    return (
      <div className="grammar-wrap">
        <h1>{t("lesson.title", { defaultValue: "レッスン選択" })}</h1>
        <p>{t("grammar.lessons.hint", { defaultValue: "カテゴリを選んでください。" })}</p>
      </div>
    );
  }

  // N3〜N1 はデータ無し
  if (level === "n3" || level === "n2" || level === "n1") {
    return (
      <div className="grammar-wrap">
        <h1>
          {t("grammar.lessons.title", {
            level: LEVEL_LABELS[level] || level.toUpperCase(),
            category: t(CAT_I18N_KEY[category] ?? "", { defaultValue: rawCat }),
          })}
        </h1>
        <p>このレベルのデータはありません。</p>
      </div>
    );
  }

  // total を明示フォールバックで決定
  let total = LESSON_COUNTS?.[level]?.[category];
  if (total == null) {
    if (isComparison) {
      total = LESSON_COUNTS?.n4?.comparison ?? 0;
    } else if (isAspect) {
      total = LESSON_COUNTS?.n4?.["tense-aspect-jlpt"] ?? 0;
    } else {
      total = 0;
    }
  }

  if (!total) {
    return (
      <div className="grammar-wrap">
        <h1>
          {t("grammar.lessons.title", {
            level: LEVEL_LABELS[level] || level.toUpperCase(),
            category: t(CAT_I18N_KEY[category] ?? "", { defaultValue: rawCat }),
          })}
        </h1>
        <p>{t("grammar.categories.comingSoon", { defaultValue: "準備中です。" })}</p>
      </div>
    );
  }

  const lessons = Array.from({ length: total }, (_, i) => i + 1);
  const titleLevelLabel =
    isComparison || isAspect ? LEVEL_LABELS.n4 : LEVEL_LABELS[level] || level.toUpperCase();

  return (
    <div className="grammar-wrap">
      <h1>
        {t("grammar.lessons.title", {
          level: titleLevelLabel,
          category: t(CAT_I18N_KEY[category] ?? "", { defaultValue: rawCat }),
        })}
      </h1>

      <div className="grid">
        {lessons.map((num) => {
          const label = t("grammar.lessons.open", {
            num,
            defaultValue: `レッスン ${num}`,
          });
          return (
            <button
              key={num}
              type="button"
              className="grammar-btn"
              onClick={() => navigate(makeLessonPath(level, category, num))}
              title={label}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
