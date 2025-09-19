// src/pages/ReaderLessonSelectPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ReaderHub.css";
import { n5Levels } from "../data/reader/n5/n5Levels.js";

const IMG_FALLBACK = "/images/reader/placeholder.jpg";

const DATASETS = {
  n5: n5Levels,
  // n4: n4Levels, n3: n3Levels ... 将来追加
};

export default function ReaderLessonSelectPage() {
  const { level = "n5" } = useParams();
  const navigate = useNavigate();

  const norm = String(level).toLowerCase();
  const schema = DATASETS[norm] || [];

  return (
    <div className="reader-hub">
      {/* ステージヘッダー */}
      <div className="stage">
        <div className="stage-left">
          <span className="stage-icon">🌱</span>
          <span className="stage-label">{norm.toUpperCase()}</span>
        </div>
        <span className="stage-percent">0%</span>
      </div>

      {/* レベルごとのカード */}
      {schema.map((lv, idx) => (
        <section key={lv.id} className="level-section">
          <div className="level-head">
            <h2>{lv.title}</h2>

            {lv.unlocked && lv.progressDots ? (
              <div className="progress-dots">
                {Array.from({ length: lv.progressDots }).map((_, i) => (
                  <span key={i} className="dot" />
                ))}
              </div>
            ) : (
              idx > 0 && <div className="lock-hint">🔒 Complete previous level to unlock</div>
            )}
          </div>

          <div className="cards-row">
            {lv.stories.map((st) => (
              <article
                key={`${lv.id}-${st.id}`}
                className={`story-card ${st.locked ? "locked" : ""}`}
                onClick={() => !st.locked && navigate(`/reader/${norm}/${st.id}`)}
              >
                <div className="card-image">
                  <img
                    src={st.img}
                    alt={st.title}
                    onError={(e) => (e.currentTarget.src = IMG_FALLBACK)}
                    loading={lv.id === "level1" ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                </div>

                <div className="tag-lock">
                  <span className="tag">{st.tag}</span>
                  {st.locked && <span className="lock">🔒</span>}
                </div>

                <h3 className="card-title">{st.title}</h3>
                <p className="time">{st.time}</p>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* 下部ナビ（ダミー） */}
      <nav className="bottom-nav">
        <span className="nav-btn blue">🎓</span>
        <span className="nav-btn green">📖</span>
        <span className="nav-btn red">🏆</span>
        <span className="nav-btn yellow">📑</span>
        <span className="nav-btn purple">👤</span>
      </nav>
    </div>
  );
}
