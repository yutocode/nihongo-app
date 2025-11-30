// src/components/WordProgressBar.jsx
import React from "react";
import "@/styles/WordProgressBar.css";

function clampPercent(value) {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

/**
 * 単語帳用プログレスバー
 * @param {number} currentIndex  0始まりの現在インデックス
 * @param {number} total         全単語数（例: 50）
 */
const WordProgressBar = ({ currentIndex = 0, total = 0 }) => {
  const safeTotal = total > 0 ? total : 1;
  const completed = Math.min(currentIndex + 1, safeTotal);
  const percent = clampPercent(Math.round((completed / safeTotal) * 100));

  return (
    <section
      className="wpb"
      aria-label="word progress"
    >
      <div className="wpb-bar">
        <div
          className="wpb-bar__fill"
          style={{ "--wpb-percent": `${percent}%` }}
        />
      </div>

      <div className="wpb-meta">
        <span className="wpb-meta__label">
          Progress:{" "}
          <span className="wpb-meta__strong">
            {completed} / {total || 0} words
          </span>
        </span>

        <span className="wpb-meta__percent">{percent}%</span>
      </div>
    </section>
  );
};

export default WordProgressBar;
