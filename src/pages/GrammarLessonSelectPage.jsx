// src/pages/GrammarLessonSelectPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/GrammarLesson.css";

const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

/** カテゴリごとのレッスン数（N5） */
const N5_CATEGORY_COUNTS = {
  particles: 10,      // 助詞：1〜10
  "verb-forms": 6,    // 動詞の活用：1〜6
  adjectives: 6,
  "exist-have": 6,
  compare: 0,
  "intent-plan": 0,
  "ask-permit": 0,
  basic: 0,
};

// i18n 用：カテゴリキー → 翻訳キー
const CAT_I18N_KEY = {
  particles: "grammar.categories.particles",
  "verb-forms": "grammar.categories.verbForms",
  adjectives: "grammar.categories.adjectives",
  "exist-have": "grammar.categories.existHave",
  compare: "grammar.categories.compare",
  "intent-plan": "grammar.categories.intentPlan",
  "ask-permit": "grammar.categories.askPermit",
  basic: "grammar.categories.basic",
};

export default function GrammarLessonSelectPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { level: rawLevel = "", category } = useParams();

  const level = String(rawLevel).toLowerCase();
  const isKnownLevel = level in LEVEL_LABELS;

  // レベル不正 → レベル選択へ誘導
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

  // カテゴリ未指定 → カテゴリ選択へ戻す
  if (!category) {
    return (
      <div className="grammar-wrap">
        <h1>{t("lesson.title")}</h1>
        <p>{t("grammar.lessons.hint")}</p>
      </div>
    );
  }

  // レッスン数（現状 N5 のみ）
  const total = level === "n5" ? (N5_CATEGORY_COUNTS[category] ?? 0) : 0;
  const lessons = Array.from({ length: total }, (_, i) => i + 1);
  const makePath = (num) => `/grammar/${level}/${category}/lesson${num}`;

  // 見出しのカテゴリ名（翻訳なければキー表示）
  const categoryLabel = t(CAT_I18N_KEY[category] ?? "", { defaultValue: category });

  return (
    <div className="grammar-wrap">
      {/* 戻るボタンは Header.jsx に任せる（🏠の隣） */}
      <h1>
        {t("grammar.lessons.title", {
          level: LEVEL_LABELS[level],
          category: categoryLabel,
        })}
      </h1>

      {total === 0 ? (
        <p>{t("grammar.categories.comingSoon")}</p>
      ) : (
        <div className="grid">
          {lessons.map((num) => (
            <button
              key={num}
              type="button"
              className="grammar-btn"
              onClick={() => navigate(makePath(num))}
              title={t("grammar.lessons.open", { num })}
            >
              {t("grammar.lessons.open", { num })}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}