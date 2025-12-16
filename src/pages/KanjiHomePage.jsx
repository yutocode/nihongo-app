// src/pages/KanjiHomePage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import n1 from "@/data/kanji/n1_with_examples_ruby.json";
import n2 from "@/data/kanji/n2_with_examples_ruby.json";
import n3 from "@/data/kanji/n3_with_examples_ruby.json";
import n4 from "@/data/kanji/n4_with_examples_ruby.json";

import "@/styles/KanjiHomePage.css";

const LEVELS = ["N4", "N3", "N2", "N1"];

const DATA_BY_LEVEL = {
  N4: n4,
  N3: n3,
  N2: n2,
  N1: n1,
};

export default function KanjiHomePage() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("N4");
  const [favorites, setFavorites] = useState(() => new Set());

  const kanjiList = useMemo(() => {
    const data = DATA_BY_LEVEL[level] || {};
    return Object.values(data);
  }, [level]);

  const toggleStar = (char) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(char) ? next.delete(char) : next.add(char);
      return next;
    });
  };

  return (
    <main className="kanji-wrap">
      <header className="kanji-header">
        <button
          className="kanji-back"
          onClick={() => navigate(-1)}
          aria-label="back"
        >
          ←
        </button>

        <div className="kanji-title">
          <h1>{level} Kanji Trainer</h1>
          <p>合計 {kanjiList.length} 字</p>
        </div>

        <button className="kanji-info" aria-label="info">
          i
        </button>
      </header>

      <section className="kanji-levels">
        {LEVELS.map((lv) => (
          <button
            key={lv}
            className={`kanji-level ${lv === level ? "active" : ""}`}
            onClick={() => setLevel(lv)}
            type="button"
          >
            {lv}
          </button>
        ))}
      </section>

      <section className="kanji-modes">
        <button
          className="kanji-card"
          type="button"
          onClick={() => navigate(`/kanji/stroke/${level}`)}
        >
          <div className="icon" aria-hidden="true">
            ✍️
          </div>
          <h3>Stroke Order</h3>
          <p>書き順</p>
        </button>

        <div className="kanji-card disabled" aria-disabled="true">
          <div className="icon" aria-hidden="true">
            ❓
          </div>
          <h3>Quiz</h3>
          <span className="soon">Soon</span>
        </div>
      </section>

      <section className="kanji-list">
        <header className="kanji-list-header">
          <h2>{level} の漢字一覧</h2>
        </header>

        {kanjiList.map((k) => (
          <button
            key={k.char}
            className="kanji-row"
            type="button"
            onClick={() => navigate(`/kanji/stroke/${level}/${k.char}`)}
          >
            <div className="kanji-char">{k.char}</div>

            <div className="kanji-meta">
              <strong>{k.kunyomi?.[0] || k.onyomi?.[0] || ""}</strong>
              <span>
                {k.jlpt} ・ {k.strokes}画
              </span>
            </div>

            <button
              className={`bookmark ${favorites.has(k.char) ? "active" : ""}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(k.char);
              }}
              aria-label="favorite"
            >
              ★
            </button>
          </button>
        ))}
      </section>

      <footer className="kanji-cta">
        <button className="btn-outline" type="button">
          ランダム5問テスト
        </button>
        <button className="btn-primary" type="button">
          {level} 漢字テストを開始
        </button>
      </footer>
    </main>
  );
}