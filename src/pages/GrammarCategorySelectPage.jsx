import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/GrammarLesson.css";

const CATEGORIES = [
  { slug: "particles",   tkey: "grammar.categories.particles",   enabled: true  },
  { slug: "verb-forms",  tkey: "grammar.categories.verbForms",   enabled: true  },
  { slug: "adjectives",  tkey: "grammar.categories.adjectives",  enabled: true },
  { slug: "exist-have",  tkey: "grammar.categories.existHave",   enabled: true },
  { slug: "compare",     tkey: "grammar.categories.compare",     enabled: false },
  { slug: "intent-plan", tkey: "grammar.categories.intentPlan",  enabled: false },
  { slug: "ask-permit",  tkey: "grammar.categories.askPermit",   enabled: false },
  { slug: "basic",       tkey: "grammar.categories.basic",       enabled: false },
];

export default function GrammarCategorySelectPage() {
  const { level = "n5" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = (cat) => {
    if (!cat.enabled) return;
    if (cat.slug === "adjectives") {
      navigate(`/adj/${level}/lesson1`);
    } else {
      navigate(`/grammar/${level}/${cat.slug}`);
    }
  };

  return (
    <div className="grammar-wrap">
      {/* ← 戻るボタンは Header に任せる */}
      <h1>{t("grammar.categories.title", { level: level.toUpperCase() })}</h1>

      <div className="grid">
        {CATEGORIES.map((cat) => {
          const disabled = !cat.enabled;
          const label = t(cat.tkey);
          const coming = t("grammar.categories.comingSoon");
          return (
            <button
              key={cat.slug}
              className={`grammar-btn ${disabled ? "is-disabled" : ""}`}
              onClick={() => handleClick(cat)}
              disabled={disabled}
              title={disabled ? coming : ""}
              aria-label={`${label}${disabled ? `（${coming}）` : ""}`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}