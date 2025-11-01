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
    paraphrase: 5,
  },
  n4: {
    comparison: 8,
    "tense-aspect": 8,        // 旧スラッグ
    "tense-aspect-jlpt": 8,
    particles: 10,
    "advice-obligation": 8,   // 助言・義務・不要
    paraphrase: 5,            // いいかえ（Lesson1〜5）
  },
  // ★ N3
  n3: {
    concession: 10,           // 逆接 Lesson1〜10（専用ページもあるが保険で記載）
    voice: 8,                 // 受け身・使役受け身 Lesson1〜8
    paraphrase: 5,            // いいかえ Lesson1〜5
  },
  // ★ N2 / N1
  n2: { paraphrase: 5 },
  n1: { paraphrase: 5 },
};

const CAT_I18N_KEY = {
  // 追加カテゴリ
  concession: "grammar.categories.concession",
  voice: "grammar.categories.voice",
  paraphrase: "grammar.categories.paraphrase",

  // 既存
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
  "advice-obligation": "grammar.categories.adviceObligation",
};

function normalizeLessonNum(num) {
  const n = Number(num);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function makeLessonPath(level, category, num) {
  const cat = String(category).toLowerCase();
  const lv = String(level).toLowerCase();
  const N = `Lesson${normalizeLessonNum(num)}`;

  if (cat === "compare" || cat === "comparison") {
    return `/grammar/n4/comparison/${N}`;
  }
  if (cat === "tense-aspect" || cat === "tense-aspect-jlpt") {
    return `/grammar/n4/tense-aspect-jlpt/${N}`;
  }
  if (cat === "exist-have") {
    return `/grammar/${lv}/exist-have/${N}`;
  }
  // ★ N3: 専用ページ（ConcessionQuizPage）
  if (cat === "concession") {
    // ルートは /grammar/n3/concession/:lesson （小文字lessonもOK）
    return `/grammar/${lv}/concession/lesson${normalizeLessonNum(num)}`;
  }
  // ★ N3: 専用ページ（N3VoiceQuizPage）
  if (cat === "voice") {
    return `/grammar/${lv}/voice/${N}`;
  }
  // 汎用カテゴリは共通ルート（GrammarQuizPage）
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
