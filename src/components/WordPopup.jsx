import React, { useEffect, useRef } from "react";
import "@/styles/WordPopup.css";

/**
 * props:
 * - open: boolean
 * - word: string
 * - entry: {
 *     ja?: string, en?: string, zh?: string, tw?: string, ko?: string,
 *     vi?: string, th?: string, my?: string,
 *     pos?: string[], romaji?: string, audioSrc?: string,
 *     defs?: string[], examples?: Array<{jp:string, en?:string}>
 *   }
 * - onClose: () => void
 */
export default function WordPopup({ open=false, word="", entry=null, onClose }) {
  const sheetRef = useRef(null);

  // 背景スクロールを止める／Escで閉じる
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  const playAudio = () => {
    if (entry?.audioSrc) {
      const a = new Audio(entry.audioSrc);
      a.play();
    }
  };

  const hasAny =
    entry &&
    (entry.ja || entry.en || entry.zh || entry.tw || entry.ko || entry.vi || entry.th || entry.my ||
     entry.defs?.length || entry.examples?.length || entry.romaji || entry.pos?.length);

  return (
    <div className="wp-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="wp-sheet"
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wp-handle" />

        {/* ヘッダー */}
        <div className="wp-head">
          <div className="wp-title">
            <span className="wp-word">{word || "—"}</span>
            {entry?.romaji && <span className="wp-romaji">{entry.romaji}</span>}
          </div>
          <div className="wp-actions">
            <button className="wp-icon" onClick={playAudio} aria-label="play">
              🔊
            </button>
            <button className="wp-icon" onClick={onClose} aria-label="close">
              ✕
            </button>
          </div>
        </div>

        {/* 品詞タグ */}
        {entry?.pos?.length ? (
          <div className="wp-tags">
            {entry.pos.map((p, i) => (
              <span key={i} className="wp-tag">{p}</span>
            ))}
          </div>
        ) : null}

        <div className="wp-content">
          {/* 定義 */}
          {entry?.defs?.length ? (
            <section className="wp-section">
              <h4>Definitions:</h4>
              <ul className="wp-list">
                {entry.defs.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </section>
          ) : null}

          {/* 多言語 */}
          {(entry?.ja || entry?.en || entry?.zh || entry?.tw || entry?.ko || entry?.vi || entry?.th || entry?.my) ? (
            <section className="wp-section">
              <h4>Translations:</h4>
              <div className="wp-grid">
                {entry?.ja && <div><b>日本語:</b> {entry.ja}</div>}
                {entry?.en && <div><b>English:</b> {entry.en}</div>}
                {entry?.zh && <div><b>中文:</b> {entry.zh}</div>}
                {entry?.tw && <div><b>繁體:</b> {entry.tw}</div>}
                {entry?.ko && <div><b>한국어:</b> {entry.ko}</div>}
                {entry?.vi && <div><b>Tiếng Việt:</b> {entry.vi}</div>}
                {entry?.th && <div><b>ภาษาไทย:</b> {entry.th}</div>}
                {entry?.my && <div><b>မြန်မာ:</b> {entry.my}</div>}
              </div>
            </section>
          ) : null}

          {/* 例文 */}
          {entry?.examples?.length ? (
            <section className="wp-section">
              <h4>Examples:</h4>
              {entry.examples.map((ex, i) => (
                <div key={i} className="wp-card">
                  <div className="wp-ex-jp">{ex.jp}</div>
                  {ex.en && <div className="wp-ex-en">{ex.en}</div>}
                </div>
              ))}
            </section>
          ) : null}

          {!hasAny && (
            <div className="wp-empty">この単語の情報はありません。</div>
          )}
        </div>
      </div>
    </div>
  );
}
