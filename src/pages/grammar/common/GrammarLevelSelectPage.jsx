// src/pages/grammar/common/GrammarLevelSelectPage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProgressStore } from "../../../store/useProgressStore.jsx";
import { summarizeSections } from "../../../utils/progressMath.js";
import "../../../styles/GrammarLesson.css";

const LEVEL_ORDER = ["n5", "n4", "n3", "n2", "n1"];
const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

export default function GrammarLevelSelectPage({
  basePath = "/grammar",
  i18nKey = "grammar.level.title",
  defaultTitle = "選擇文法級別",
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 進捗ストア：推奨構造 => sections = { n5:{...}, n4:{...}, ... }
  const sections = useProgressStore((s) => s.sections);

  // 各レベルの集計（answered/total/pct）
  const levelSummaries = useMemo(() => {
    const out = {};
    LEVEL_ORDER.forEach((lv) => {
      const sec = sections?.[lv];            // 例: { particles:{...}, adjectives:{...}, ... }
      if (sec && typeof sec === "object") {
        out[lv] = summarizeSections(sec);    // { answered, correct, total, pct }
      }
    });
    return out;
  }, [sections]);

  const title = t(i18nKey, { defaultValue: defaultTitle });

  const goLevel = (lv) => navigate(`${basePath}/${lv}`);

  return (
    <div className="grammar-wrap" role="main">
      <h1 className="level-head">{title}</h1>

      <div className="grid" aria-label={title}>
        {LEVEL_ORDER.map((lv) => {
          const sum = levelSummaries[lv]; // ない場合は undefined
          const donePct = sum?.total ? Math.round((sum.answered / sum.total) * 100) : 0;

          return (
            <button
              key={lv}
              type="button"
              className="grammar-btn grammar-btn--level"
              onClick={() => goLevel(lv)}
              title={LEVEL_LABELS[lv]}
              aria-label={LEVEL_LABELS[lv]}
            >
              <div className="gbtn-row">
                <span className="gbtn-label">{LEVEL_LABELS[lv]}</span>

                {/* 数字バッジ（データがあれば） */}
                {sum && (
                  <span className="gbtn-badge">
                    {sum.answered}/{sum.total || "?"} <span className="gbtn-pct">({donePct}%)</span>
                  </span>
                )}
              </div>

              {/* ミニ進捗バー（データがあれば） */}
              {sum && (
                <div className="gbtn-meter" aria-hidden="true">
                  <div className="gbtn-fill" style={{ width: `${Math.min(100, donePct)}%` }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
