import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import "../styles/XPBanner.css";

/** 数値をなめらかにカウントアップ表示するフック */
function useCountUp(value, duration = 600) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    prevRef.current = value;
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

/**
 * XPBanner（ミニマル版）
 * - トロフィー/ラベルは出さない（Lvピル＋バー＋数値のみ）
 * - モバイル優先、デザイントークンのみ使用
 */
export default function XPBanner({ compact = false }) {
  const xp = useAppStore((s) => s.xp); // { total, level, need, into, percent, levelLabel }
  const [levelUp, setLevelUp] = useState(false);
  const prevLevel = useRef(xp.level);
  const prevPercent = useRef(xp.percent);

  // 数字アニメ
  const animPercent = useCountUp(xp.percent ?? 0, 600);
  const animLevel   = useCountUp(xp.level ?? 1, 700);
  const animInto    = useCountUp(xp.into ?? 0, 600);
  const animNeed    = useMemo(() => xp.need ?? 0, [xp.need]);

  // レベルアップ演出
  useEffect(() => {
    if ((xp.level ?? 1) > (prevLevel.current ?? 1)) {
      setLevelUp(true);
      const t = setTimeout(() => setLevelUp(false), 1400);
      prevLevel.current = xp.level;
      return () => clearTimeout(t);
    }
    prevLevel.current = xp.level;
  }, [xp.level]);

  // バー幅（％）
  const width = Math.max(0, Math.min(100, xp.percent ?? 0));

  // 変化量に応じてアニメ時間を可変（1%あたり12ms、最小150ms、最大250ms）
  const delta = Math.abs(width - (prevPercent.current ?? 0));
  const durMs = Math.max(150, Math.min(250, Math.round(delta * 12)));
  useEffect(() => { prevPercent.current = width; }, [width]);

  return (
    <div
      className={`xp-banner ${compact ? "is-compact" : ""} ${levelUp ? "is-levelup" : ""}`}
      role="region"
      aria-label="Level progress"
    >
      <div className="xp-main">
        <div className="xp-row">
          <div className="xp-title">
            <span className="xp-levelchip" aria-label={`レベル ${animLevel}`}>Lv {animLevel}</span>
          </div>
          <div className="xp-numbers" aria-live="polite">
            <span className="xp-num">{animInto}</span>
            <span className="xp-split">/</span>
            <span className="xp-den">{animNeed}</span>
            <span className="xp-per">({animPercent}%)</span>
          </div>
        </div>

        <div
          className="xp-rail"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(width)}
          aria-label="経験値バー"
        >
          {/* 可変durationをCSS変数で渡す */}
          <div className="xp-fill" style={{ width: `${width}%`, ["--dur"]: `${durMs}ms` }}>
            <span className="xp-shine" aria-hidden />
          </div>
        </div>
      </div>

      {/* レベルアップ時のポップ（控えめ） */}
      {levelUp && <div className="levelup-pop" aria-hidden>Level Up!</div>}
    </div>
  );
}
