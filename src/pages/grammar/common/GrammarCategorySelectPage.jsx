// src/pages/grammar/common/GrammarCategorySelectPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarQuiz.css";

/** 表示メタ */
const CATEGORY_META = {
  particles:   { slug: "particles",   tkey: "grammar.categories.particles"  },
  "verb-forms":{ slug: "verb-forms",  tkey: "grammar.categories.verbForms"  },
  adjectives:  { slug: "adjectives",  tkey: "grammar.categories.adjectives" },
  "exist-have":{ slug: "exist-have",  tkey: "grammar.categories.existHave"  },
  comparison:  { slug: "comparison",  tkey: "grammar.categories.compare"    },
  "intent-plan":{slug: "intent-plan", tkey: "grammar.categories.intentPlan" },
  "ask-permit":{ slug: "ask-permit",  tkey: "grammar.categories.askPermit"  },
  basic:       { slug: "basic",       tkey: "grammar.categories.basic"      },
  "tense-aspect":     { slug: "tense-aspect",      tkey: "grammar.categories.tenseAspect" },
  "tense-aspect-jlpt":{ slug: "tense-aspect-jlpt", tkey: "grammar.categories.tenseAspect" },
};

/** レベルごとの表示カテゴリ */
const CATS_BY_LEVEL = {
  n5: [
    "particles","verb-forms","adjectives",
    "exist-have","intent-plan","ask-permit","basic"
    // ← N5は比較を出さない
  ],
  // ★ N4はアスペクト＋比較のみ
  n4: [
    "tense-aspect-jlpt",
    "comparison",
    "particles",
  ],
  n3: [],
  n2: [],
  n1: [],
};

/** ルーティング */
function toCategoryPath(level, slug) {
  const lv = String(level).toLowerCase();
  const s = String(slug).toLowerCase();

  if (s === "adjectives") return `/adj/${lv}/lesson1`;
  if (s === "comparison") return `/grammar/${lv}/comparison`;
  if (s === "tense-aspect" || s === "tense-aspect-jlpt")
    return `/grammar/${lv}/tense-aspect-jlpt`;
  return `/grammar/${lv}/${s}`;
}

export default function GrammarCategorySelectPage() {
  const { level = "n5" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const normLevel = String(level).toLowerCase();
  const levelCats = CATS_BY_LEVEL[normLevel] || CATS_BY_LEVEL.n5;

  const categories = levelCats.map((key) => CATEGORY_META[key]).filter(Boolean);

  return (
    <div className="grammar-wrap">
      <h1>
        {t("grammar.categories.title", {
          level: normLevel.toUpperCase(),
          defaultValue: `選択 ${normLevel.toUpperCase()} 文法分類`,
        })}
      </h1>

      <div className="grid">
        {categories.map((cat) => {
          const label = t(cat.tkey, { defaultValue: cat.slug });
          return (
            <button
              key={cat.slug}
              className="grammar-btn"
              onClick={() => navigate(toCategoryPath(normLevel, cat.slug))}
              aria-label={label}
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
