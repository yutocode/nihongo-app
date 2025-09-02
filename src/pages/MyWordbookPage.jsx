// src/pages/MyWordbookPage.jsx
import React from "react";
import { useMyWordsStore } from "../store/useMyWordsStore";
// ❌ import "./MyWordbookPage.css";
// ✅ styles フォルダに置いているなら↓
import "../styles/MyWordbookPage.css";

export default function MyWordbookPage() {
  const { items, remove, clear } = useMyWordsStore();

  return (
    <div className="mywb-wrap">
      <h2 className="mywb-title">My Wordbook</h2>

      {items.length === 0 ? (
        <p className="mywb-empty">まだ追加された単語はありません。</p>
      ) : (
        <>
          <ul className="mywb-list">
            {items.map((w, i) => (
              <li key={`${w.kanji}-${i}`} className="mywb-item">
                <div className="mywb-main">
                  <span className="mywb-kanji">{w.kanji}</span>
                  {w.reading && <span className="mywb-reading">{w.reading}</span>}
                  {w.note && <span className="mywb-note">— {w.note}</span>}
                </div>
                <button className="mywb-remove" onClick={() => remove(w)}>
                  削除
                </button>
              </li>
            ))}
          </ul>
          <div className="mywb-actions">
            <button className="mywb-clear" onClick={clear}>全部消す</button>
          </div>
        </>
      )}
    </div>
  );
}