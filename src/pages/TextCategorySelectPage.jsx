// src/pages/TextCategorySelectPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/TextCategory.css";

const TEXT_CATEGORIES = [
  { slug: "particles",   tkey: "text.categories.particles",   enabled: true  },
  { slug: "verb-forms",  tkey: "text.categories.verbForms",   enabled: true  },
  { slug: "adjectives",  tkey: "text.categories.adjectives",  enabled: true  },
  { slug: "exist-have",  tkey: "text.categories.existHave",   enabled: true  },
  { slug: "compare",     tkey: "text.categories.compare",     enabled: true  },
  { slug: "intent-plan", tkey: "text.categories.intentPlan",  enabled: true  },
  { slug: "ask-permit",  tkey: "text.categories.askPermit",   enabled: true  },
  { slug: "basic",       tkey: "text.categories.basic",       enabled: false },
];

export default function TextCategorySelectPage() {
  const { level = "n5" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = (cat) => {
    if (!cat.enabled) return;
    // ✅ すべてのカテゴリを押したら page1 に直行する
    navigate(`/text/${level}/${cat.slug}/page1`);
  };

  return (
    <div className="text-wrap">
      <h1>{t("text.categories.title", { level: level.toUpperCase() })}</h1>
      <div className="grid">
        {TEXT_CATEGORIES.map((cat) => {
          const disabled = !cat.enabled;
          const label = t(cat.tkey);
          const coming = t("text.categories.comingSoon");
          return (
            <button
              key={cat.slug}
              className={`text-btn ${disabled ? "is-disabled" : ""}`}
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
