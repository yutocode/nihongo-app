// src/components/ui/ProgressRing.jsx
import React, { useMemo } from "react";
import "@/styles/ProgressRing.css";

/**
 * ドーナツ型の進捗リング
 *
 * props:
 * - value: 0〜100 のパーセンテージ
 * - size: 外径(px)
 * - stroke: 線の太さ(px)
 */
export default function ProgressRing({
  value = 0,
  size = 40,
  stroke = 6,
  ariaLabel,
}) {
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const dashOffset = useMemo(
    () => circumference * (1 - pct / 100),
    [circumference, pct]
  );

  return (
    <div
      className="pr-ring"
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel ?? `${pct.toFixed(1)}%`}
    >
      <svg className="pr-svg" width={size} height={size}>
        {/* 背景トラック */}
        <circle
          className="pr-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        {/* 進捗 */}
        <circle
          className="pr-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      {/* 中央のパーセント表示 */}
      <div className="pr-label">{pct.toFixed(1)}%</div>
    </div>
  );
}
