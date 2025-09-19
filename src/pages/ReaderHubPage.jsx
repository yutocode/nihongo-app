// src/pages/ReaderHubPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LuFlame,
  LuBookOpen,
  LuKey,
  LuChevronRight,
  LuLock,
} from "react-icons/lu";
import "../styles/ReaderHub.css";

// N5 の全レベル情報（エイリアスが効かない場合は相対パスに変更）
// import { n5Levels } from "../data/reader/n5/n5Levels.js";
import { n5Levels } from "@/data/reader/n5/n5Levels.js";

const IMG_FALLBACK = "/images/reader/placeholder.jpg";

export default function ReaderHubPage() {
  const navigate = useNavigate();
  const levelKey = "n5";
  const schema = n5Levels;

  return (
    <div className="reader-hub">
      {/* ======= ① 上部ステータスバー ======= */}
      <div className="stats-bar">
        <div className="stat-pill">
          <span className="num">0</span>
        </div>
        <div className="stat-pill red">
          <LuFlame />
          <span className="num">0</span>
        </div>
        <div className="stat-pill green">
          <LuBookOpen />
          <span className="num">0</span>
        </div>
        <div className="stat-pill gold">
          <LuKey />
          <span className="num">1</span>
        </div>
      </div>

      {/* ======= ② ステージ見出し（Beginner） ======= */}
      <div className="stage stage--compact">
        <div className="stage-left">
          <span className="stage-icon">🌱</span>
          <span className="stage-label">Beginner</span>
        </div>

        <div className="stage-right">
          <span className="percent-pill">0%</span>
          <LuChevronRight className="chev" />
        </div>
      </div>

      {/* ======= ③ 各レベル ======= */}
      {schema.map((lv, idx) => (
        <section key={lv.id} className="level-section">
          <div className="level-head">
            <div className="level-title">
              <h2>Level {idx + 1}</h2>
              {!lv.unlocked && (
                <div className="lock-hint-inline">
                  <LuLock />
                  <span>Complete previous level to unlock</span>
                </div>
              )}
            </div>

            {lv.unlocked && (
              <div className="progress-dots">
                {Array.from({ length: lv.progressDots || 5 }).map((_, i) => (
                  <span key={i} className="dot" />
                ))}
              </div>
            )}
          </div>

          <div className="cards-row">
            {lv.stories.map((st, i) => (
              <article
                key={`${lv.id}-${st.id}`}
                className={`story-card ${st.locked ? "locked" : "unlocked"}`}
                onClick={() =>
                  !st.locked && navigate(`/reader/${levelKey}/${st.id}`)
                }
              >
                <div className="card-image">
                  <img
                    src={st.img}
                    alt={st.title}
                    onError={(e) => (e.currentTarget.src = IMG_FALLBACK)}
                    loading={lv.id === "level1" && i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                </div>

                <div className="card-body">
                  <div className="meta-row">
                    <span className="tag">{st.tag}</span>
                    <span className="lockmark">
                      {st.locked ? <LuLock /> : "🔓"}
                    </span>
                  </div>
                  <h3 className="card-title">{st.title}</h3>
                  <p className="time">~5 min. read</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* ======= ④ 下部ナビ（5色） ======= */}
      <nav className="bottom-nav bottom-nav--pill">
        <button className="nav-btn blue" aria-label="Lessons">
          🎓
        </button>
        <button className="nav-btn green" aria-label="Reader">
          📖
        </button>
        <button className="nav-btn red" aria-label="Ranking">
          🏆
        </button>
        <button className="nav-btn yellow" aria-label="Bookmarks">
          📑
        </button>
        <button className="nav-btn purple" aria-label="Profile">
          👤
        </button>
      </nav>
    </div>
  );
}
