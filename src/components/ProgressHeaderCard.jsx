import React from "react";
import { FaTrophy, FaCog } from "react-icons/fa";
import "../styles/ProgressHeaderCard.css";

export default function ProgressHeaderCard({
  levelLabel = "Lv 1",
  title = "N5 progress",
  answered = 0,
  total = 0,
  pct = 0,
  onPressTrophy,
  onPressSettings,
}) {
  return (
    <div className="phc">
      <button className="phc__ghost" aria-label="trophy" onClick={onPressTrophy}>
        <FaTrophy />
      </button>

      <div className="phc__content">
        <span className="phc__level">{levelLabel}</span>
        <span className="phc__title">{title}</span>
        <div className="phc__numbers">
          <strong>{answered}</strong>
          <span className="slash">/</span>
          <span>{total || "?"}</span>
          <span className="pct">({pct}%)</span>
        </div>
        <div className="phc__bar">
          <div className="phc__fill" style={{ width: `${Math.min(100, total ? (answered / total) * 100 : 0)}%` }} />
        </div>
      </div>

      <button className="phc__ghost" aria-label="settings" onClick={onPressSettings}>
        <FaCog />
      </button>
    </div>
  );
}
