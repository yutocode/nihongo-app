// src/components/avatars/JellyfishLogo.jsx
import React from "react";

/**
 * グラデクラゲのロゴアイコン
 * - size だけ渡せばOK（正方形）
 */
const JellyfishLogo = ({ size = 96 }) => {
  const viewBoxSize = 200;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      aria-hidden="true"
    >
      <defs>
        {/* 深いネイビー背景 */}
        <linearGradient id="jf-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#020817" />
          <stop offset="100%" stopColor="#020b1f" />
        </linearGradient>

        {/* ドーム：シアン→ピンク */}
        <linearGradient id="jf-dome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ef2ff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#56e0ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6fb3" stopOpacity="0.9" />
        </linearGradient>

        {/* 触手：クール系 */}
        <linearGradient id="jf-tentacle-cool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ef2ff" />
          <stop offset="100%" stopColor="#567bff" />
        </linearGradient>

        {/* 触手：ウォーム系 */}
        <linearGradient id="jf-tentacle-warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb86c" />
          <stop offset="100%" stopColor="#ff3f91" />
        </linearGradient>
      </defs>

      {/* 角丸スクエア背景（アプリアイコン風） */}
      <rect
        x="0"
        y="0"
        width={viewBoxSize}
        height={viewBoxSize}
        rx={40}
        ry={40}
        fill="url(#jf-bg)"
      />

      {/* ドーム */}
      <path
        d="
          M 60 82
          Q 100 26 140 82
          Q 140 100 132 108
          Q 100 116 68 108
          Q 60 100 60 82
        "
        fill="url(#jf-dome)"
      />
      {/* 内側レイヤーで透明感 */}
      <path
        d="
          M 72 80
          Q 100 38 128 80
          Q 122 96 100 102
          Q 78 96 72 80
        "
        fill="#4ef2ff"
        opacity="0.2"
      />

      {/* 触手 4 本（カーブリボン） */}
      <path
        d="M 82 108 C 70 132, 68 154, 78 174"
        stroke="url(#jf-tentacle-cool)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 96 108 C 86 134, 90 158, 98 176"
        stroke="url(#jf-tentacle-warm)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 104 108 C 114 134, 110 158, 102 176"
        stroke="url(#jf-tentacle-cool)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 118 108 C 130 132, 132 154, 122 174"
        stroke="url(#jf-tentacle-warm)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default JellyfishLogo;
