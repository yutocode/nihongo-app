// src/pages/grammar/common/GrammarCategorySelectPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarQuiz.css";

const CATEGORIES = [
  { slug: "particles",   tkey: "grammar.categories.particles",   enabled: true  },
  { slug: "verb-forms",  tkey: "grammar.categories.verbForms",   enabled: true  },
  { slug: "adjectives",  tkey: "grammar.categories.adjectives",  enabled: true  },
  { slug: "exist-have",  tkey: "grammar.categories.existHave",   enabled: true  },
  { slug: "compare",     tkey: "grammar.categories.compare",     enabled: true  },
  { slug: "intent-plan", tkey: "grammar.categories.intentPlan",  enabled: true  },
  { slug: "ask-permit",  tkey: "grammar.categories.askPermit",   enabled: true  },
  { slug: "basic",       tkey: "grammar.categories.basic",       enabled: false },
];

export default function GrammarCategorySelectPage() {
  const { level = "n5" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const normLevel = String(level).toLowerCase();

  const handleClick = (cat) => {
    if (!cat.enabled) return;
    if (cat.slug === "adjectives") {
      navigate(`/adj/${normLevel}/lesson1`);
    } else {
      navigate(`/grammar/${normLevel}/${cat.slug}`);
    }
  };

  return (
    <div className="grammar-wrap">
      {/* ← ページ内ホームは削除。黒帯の共通 Header に任せる */}

      <h1>
        {t("grammar.categories.title", {
          level: normLevel.toUpperCase(),
          defaultValue: `選択 ${normLevel.toUpperCase()} 文法分類`,
        })}
      </h1>

      <div className="grid">
        {CATEGORIES.map((cat) => {
          const disabled = !cat.enabled;
          const label = t(cat.tkey);
          const coming = t("grammar.categories.comingSoon", "準備中");
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
