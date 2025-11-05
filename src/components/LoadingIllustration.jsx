import React from "react";
import "../styles/LoadingIllustration.css";

/**
 * LoadingIllustration
 * props:
 * - message?: string        ... 画面下の文言（例: "学習データを読み込み中…"）
 * - size?: "sm" | "md" | "lg" (default: "md")
 * - showBackdrop?: boolean  ... 背景の半透明オーバーレイ
 * - ariaLabel?: string      ... スクリーンリーダ用
 */
export default function LoadingIllustration({
  message = "読み込み中…",
  size = "md",
  showBackdrop = false,
  ariaLabel = "読み込み中",
}) {
  return (
    <div className={`loader-wrap${showBackdrop ? " loader-wrap--backdrop" : ""}`} role="status" aria-label={ariaLabel}>
      <div className={`loader ${size}`}>
        {/* かわいい「本」マスコット */}
        <svg className="loader__svg" viewBox="0 0 200 160" width="100%" height="100%" aria-hidden="true">
          {/* 影 */}
          <ellipse cx="100" cy="135" rx="44" ry="8" className="shadow" />

          {/* 本の背表紙 */}
          <rect x="50" y="30" width="100" height="90" rx="12" className="book" />
          {/* 表紙の右側の厚み */}
          <path d="M150 40 v72 c0 6 -5 10 -11 10 h-3 v-92 h3 c6 0 11 4 11 10z" className="book-side" />

          {/* 本の顔（目・口） */}
          <circle cx="82" cy="75" r="4" className="eye eye--left" />
          <circle cx="118" cy="75" r="4" className="eye eye--right" />
          <path d="M90 92 q10 8 20 0" className="mouth" />

          {/* しおり */}
          <path d="M64 30 v26 l8 -6 l8 6 v-26" className="ribbon" />

          {/* ３つのドット（…） */}
          <circle cx="70" cy="120" r="4" className="dot dot-1" />
          <circle cx="100" cy="120" r="4" className="dot dot-2" />
          <circle cx="130" cy="120" r="4" className="dot dot-3" />

          {/* くるくる手裏剣（学習＝忍耐の比喩😆） */}
          <g className="shuriken" transform="translate(160,40)">
            <polygon points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3" />
          </g>

          {/* ページがめくれる風ライン（描画アニメ） */}
          <path d="M70 50 q30 10 60 0" className="page-stroke" />
        </svg>

        <div className="loader__text" aria-live="polite">{message}</div>
      </div>
    </div>
  );
}
