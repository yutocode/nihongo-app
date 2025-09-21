// src/components/ReaderHeader.jsx
import React from "react";
import { FiChevronLeft, FiFlag } from "react-icons/fi";
import "@/styles/ReaderHeader.css";

export default function ReaderHeader({ current, total, onBack, onFlag }) {
  const pct = Math.max(0, Math.min(1, (current - 1) / Math.max(1, total - 1)));
  return (
    <div className="rh-wrap">
      <button className="rh-back" aria-label="back" onClick={onBack}>
        <FiChevronLeft size={24} />
      </button>

      <div className="rh-track">
        <div className="rh-fill" style={{ width: `${pct * 100}%` }} />
      </div>

      <div className="rh-page">{current} / {total}</div>

      <button className="rh-flag" aria-label="flag" onClick={onFlag}>
        <FiFlag size={18} />
      </button>
    </div>
  );
}
