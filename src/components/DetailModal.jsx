// src/components/DetailModal.jsx
import React from "react";
import "../styles/DetailModal.css";

export default function DetailModal({ open, onClose, data }) {
  if (!open) return null;
  if (!data) return null;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* 閉じるボタン */}
        <button className="detail-close" onClick={onClose}>×</button>

        {/* 単語見出し */}
        <div className="detail-header">
          <div className="detail-kanji">{data.kanji || "—"}</div>
          <div className="detail-reading">{data.reading || ""}</div>
          <div className="detail-pos">{data.pos || ""}</div>
        </div>

        {/* 意味（多言語） */}
        <div className="detail-meanings">
          {data.meanings &&
            Object.entries(data.meanings).map(([lang, val]) => (
              <div key={lang} className="detail-meaning">
                <b>{lang.toUpperCase()}:</b> {val || "—"}
              </div>
            ))}
        </div>

        {/* 例文 */}
        {data.examples && data.examples.length > 0 && (
          <div className="detail-examples">
            <h3>例文</h3>
            {data.examples.map((ex, idx) => (
              <div key={idx} className="example-block">
                <p><b>JA:</b> {ex.ja}</p>
                <p><b>EN:</b> {ex.en}</p>
                <p><b>ID:</b> {ex.id}</p>
                <p><b>ZH:</b> {ex.zh}</p>
                <p><b>TW:</b> {ex.tw}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
