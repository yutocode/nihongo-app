import React from "react";
import { useAppStore } from "@/store/useAppStore";
import "@/styles/LevelPill.css";

export default function LevelPill({ className = "" }) {
  const xp = useAppStore((s) => s.xp);
  const levelLabel = xp?.levelLabel || "N5";
  const level = xp?.level || 1;
  const percent = Math.max(0, Math.min(100, xp?.percent || 0));
  const need = xp?.need ?? 0;
  const into = xp?.into ?? 0;

  return (
    <div className={`levelPill ${className}`} role="group" aria-label="学習レベル">
      <div className="levelPill__left" aria-label={`レベル ${level}`}>
        <span className="levelPill__lv">Lv {level}</span>
        <span className="levelPill__sep" aria-hidden>•</span>
        <span className="levelPill__label" aria-label={`現在の級 ${levelLabel}`}>{levelLabel}</span>
      </div>
      <div className="levelPill__right" aria-label="進捗">
        <div className="levelPill__bar" aria-hidden>
          <div className="levelPill__fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="levelPill__meta" aria-label={`次のレベルまで ${into}/${need}`}>
          {into}/{need}（{percent}%）
        </span>
      </div>
    </div>
  );
}
