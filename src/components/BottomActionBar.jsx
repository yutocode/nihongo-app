// src/components/BottomActionBar.jsx
import React from "react";
import {
  LuSettings,
  LuPlay,
  LuChevronLeft,
  LuChevronRight,
  LuCheck,
  LuLanguages,
  LuTurtle,
} from "react-icons/lu";
import "@/styles/BottomActionBar.css";

export default function BottomActionBar({
  onSettings = () => {},
  onTranslate = () => {},
  onPlay = () => {},
  onSlow = () => {},
  onPrev = () => {},
  onNext = () => {},
  onCheck = () => {},
  slowActive = false,
}) {
  return (
    <>
      <div className="ba-wrap" role="toolbar" aria-label="Playback and actions">
        <div className="ba-pill" aria-hidden="false">
          <button className="ba-btn" onClick={onSettings} aria-label="設定">
            <LuSettings />
          </button>

          <button className="ba-btn" onClick={onTranslate} aria-label="翻訳">
            <LuLanguages />
          </button>

          <button className="ba-btn ba-primary" onClick={onPlay} aria-label="再生">
            <LuPlay />
          </button>

          <button
            className={`ba-btn ${slowActive ? "ba-active" : ""}`}
            onClick={onSlow}
            aria-label="スロー再生"
            aria-pressed={slowActive}
          >
            <LuTurtle />
          </button>

          <button className="ba-btn" onClick={onPrev} aria-label="前へ">
            <LuChevronLeft />
          </button>

          <button className="ba-btn ba-ring" onClick={onNext} aria-label="次へ">
            <LuChevronRight />
          </button>

          <button className="ba-btn ba-ok" onClick={onCheck} aria-label="チェック">
            <LuCheck />
          </button>
        </div>
      </div>

      {/* Safe area spacer */}
      <div className="ba-safezone" aria-hidden="true" />
    </>
  );
}
