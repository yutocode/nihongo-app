//src/components/XPBanner.jsx
import React, { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import "@/styles/XPBanner.css";

const toInt = (v, fallback = 0) => {
  const n = typeof v === "string" ? Number(v) : v;
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
};

export default function XPBanner({ compact = false }) {
  const xp = useAppStore((s) => s.xp);

  // storeの形：xp = { total, level, need, into, percent, levelLabel }
  const levelNum = toInt(xp?.level, 1);
  const cur = Math.max(0, toInt(xp?.into, 0));
  const max = Math.max(1, toInt(xp?.need, 1));

  const pct = useMemo(() => {
    const p = toInt(xp?.percent, -1);
    if (p >= 0 && p <= 100) return p;
    return Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
  }, [xp?.percent, cur, max]);

  return (
    <div className={`xpbar ${compact ? "is-compact" : ""}`}>
      <div className="xpbar-panel" role="status" aria-label="XP progress">
        <div className="xpbar-row">
          <span className="xpbar-lvPill">Lv {levelNum}</span>

          <div className="xpbar-metrics" aria-label="progress numbers">
            <span className="xpbar-num">{cur}</span>
            <span className="xpbar-slash">/</span>
            <span className="xpbar-den">{max}</span>
            <span className="xpbar-per">({pct}%)</span>
          </div>
        </div>

        <div className="xpbar-rail" aria-hidden="true">
          <span className="xpbar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}