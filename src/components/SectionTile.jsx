import React from "react";
import "../styles/SectionTile.css";

export default function SectionTile({ label, answered = 0, total = 0, onClick }) {
  const donePct = total ? Math.round((answered / total) * 100) : 0;
  return (
    <button className="sectile" onClick={onClick}>
      <div className="sectile__label">{label}</div>
      <div className="sectile__meter">
        <div className="sectile__fill" style={{ width: `${donePct}%` }} />
      </div>
      <div className="sectile__nums">
        {answered}/{total || "?"} <span className="muted">({donePct}%)</span>
      </div>
    </button>
  );
}
