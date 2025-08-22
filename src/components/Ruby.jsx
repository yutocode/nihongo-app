// src/components/Ruby.jsx
import React from "react";

/**
 * <ruby> 表示コンポーネント
 * - segments: [{ t: 表示文字, r?: ルビ }]
 * - text + ruby : 単純に全体へルビ（fallback）
 */
export default function Ruby({ text, ruby, segments }) {
  if (Array.isArray(segments) && segments.length > 0) {
    return (
      <>
        {segments.map((s, i) =>
          s.r ? (
            <ruby key={i}>
              {s.t}
              <rt>{s.r}</rt>
            </ruby>
          ) : (
            <span key={i}>{s.t}</span>
          )
        )}
      </>
    );
  }

  if (text && ruby) {
    return (
      <ruby>
        {text}
        <rt>{ruby}</rt>
      </ruby>
    );
  }

  return <span>{text || ""}</span>;
}
