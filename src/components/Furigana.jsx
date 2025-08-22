// src/components/Furigana.jsx
import React from "react";

/**
 * HTML文字列（<ruby>含む）を描画。
 * 安全な入力前提（自前データのみ）で dangerouslySetInnerHTML を利用。
 */
export default function Furigana({ html, className }) {
  if (!html) return null;
  return (
    <p
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
