// src/components/ReaderHeader.jsx
import React from "react";
import { FiChevronLeft, FiFlag } from "react-icons/fi";
import "@/styles/ReaderHeader.css";

export default function ReaderHeader({ current=1, total=5, onBack, onFlag }) {
  const pct = Math.max(0, Math.min(100, Math.round((current/total)*100)));
  return (
    <div className="rh-wrap">
      <button className="rh-back" aria-label="back" onClick={onBack}>
        <FiChevronLeft />
      </button>

      <div className="rh-track">
        <div className="rh-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="rh-page">{current} / {total}</div>

      <button className="rh-flag" aria-label="flag" onClick={onFlag}>
        <FiFlag />
      </button>
    </div>
  );
}
