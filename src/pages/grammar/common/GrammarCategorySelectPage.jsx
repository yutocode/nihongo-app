// src/pages/grammar/common/GrammarCategorySelectPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarQuiz.css";

/** 表示メタ（i18nキーは locales/* の grammar.categories.* を想定） */
const CATEGORY_META = {
  // ★ N3 追加カテゴリ
  concession:          { slug: "concession",          tkey: "grammar.categories.concession" },
  voice:               { slug: "voice",               tkey: "grammar.categories.voice" },

  // 既存
  particles:           { slug: "particles",           tkey: "grammar.categories.particles" },
  "verb-forms":        { slug: "verb-forms",          tkey: "grammar.categories.verbForms" },
  adjectives:          { slug: "adjectives",          tkey: "grammar.categories.adjectives" },
  "exist-have":        { slug: "exist-have",          tkey: "grammar.categories.existHave" },
  comparison:          { slug: "comparison",          tkey: "grammar.categories.compare" },
  "intent-plan":       { slug: "intent-plan",         tkey: "grammar.categories.intentPlan" },
  "ask-permit":        { slug: "ask-permit",          tkey: "grammar.categories.askPermit" },
  basic:               { slug: "basic",               tkey: "grammar.categories.basic" },
  "tense-aspect":      { slug: "tense-aspect",        tkey: "grammar.categories.tenseAspect" },
  "tense-aspect-jlpt": { slug: "tense-aspect-jlpt",   tkey: "grammar.categories.tenseAspect" },

  // ★ N4: 助言・義務・不要（ほうがいい／なければならない／なくてもいい）
  "advice-obligation": { slug: "advice-obligation",   tkey: "grammar.categories.adviceObligation" },

  // ★ 新規：いいかえ（paraphrase）
  paraphrase:          { slug: "paraphrase",          tkey: "grammar.categories.paraphrase" },
};

/** レベルごとの表示カテゴリ */
const CATS_BY_LEVEL = {
  n5: [
    "particles",
    "verb-forms",
    "adjectives",
    "exist-have",
    "intent-plan",
    "ask-permit",
    "basic",
    "paraphrase",
    // ※N5は比較を出さない
  ],
  // ★ N4は「アスペクト(公式)」「比較」「助言・義務・不要」「粒子」「いいかえ」を表示
  n4: [
    "tense-aspect-jlpt",
    "comparison",
    "advice-obligation",
    "particles",
    "paraphrase",
  ],
  // ★ N3は「逆接（concession）」「受け身・使役受け身（voice）」「いいかえ」
  n3: ["concession", "voice", "paraphrase"],
  // ★ N2/N1 は「いいかえ」
  n2: ["paraphrase"],
  n1: ["paraphrase"],
};

/** ルーティング（カテゴリ→パス） */
function toCategoryPath(level, slug) {
  const lv = String(level).toLowerCase();
  const s = String(slug).toLowerCase();

  // 独自ルートを持つカテゴリ
  if (s === "adjectives") return `/adj/${lv}/lesson1`;
  if (s === "comparison") return `/grammar/${lv}/comparison`;
  if (s === "tense-aspect" || s === "tense-aspect-jlpt")
    return `/grammar/${lv}/tense-aspect-jlpt`;
  if (s === "concession") return `/grammar/${lv}/concession`;

  // 共通（LessonSelect → Quiz のフロー）
  return `/grammar/${lv}/${s}`;
}

export default function GrammarCategorySelectPage() {
  const { level = "n5" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const normLevel = String(level).toLowerCase();
  const levelCats = CATS_BY_LEVEL[normLevel] || CATS_BY_LEVEL.n5;

  const categories = useMemo(
    () => levelCats.map((key) => CATEGORY_META[key]).filter(Boolean),
    [levelCats]
  );

  return (
    <div className="grammar-wrap">
      <h1>
        {t("grammar.categories.title", {
          level: normLevel.toUpperCase(),
          defaultValue: `選択 ${normLevel.toUpperCase()} 文法分類`,
        })}
      </h1>

      <div className="grid" role="list">
        {categories.map((cat) => {
          const label = t(cat.tkey, { defaultValue: cat.slug });
          return (
            <button
              key={cat.slug}
              type="button"
              className="grammar-btn"
              onClick={() => navigate(toCategoryPath(normLevel, cat.slug))}
              aria-label={label}
              title={label}
              role="listitem"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
