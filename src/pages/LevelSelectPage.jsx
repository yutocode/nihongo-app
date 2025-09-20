import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LevelSelectPage.css";
import { useAppStore } from "../store/useAppStore";

const LEVELS = [
  { key: "n5", label: "JLPT N5" },
  { key: "n4", label: "JLPT N4" },
  { key: "n3", label: "JLPT N3" },
  { key: "n2", label: "JLPT N2" },
  { key: "n1", label: "JLPT N1" },
];

export default function LevelSelectPage() {
  const nav = useNavigate();
  const currentLevel = useAppStore((s) => s.currentLevel);
  const setLevel = useAppStore((s) => s.setLevel);

  // localStorage と同期（再訪時も選択が光る）
  useEffect(() => {
    const saved = localStorage.getItem("currentLevel");
    if (saved && saved !== currentLevel) {
      setLevel(saved);
    }
  }, []); // eslint-disable-line
  useEffect(() => {
    if (currentLevel) localStorage.setItem("currentLevel", currentLevel);
  }, [currentLevel]);

  const handleSelect = (lvlKey) => {
    setLevel(lvlKey);
    nav("/home"); // 必ずホームへ戻る
  };

  return (
    <div className="lvl-wrap">
      <h2 className="lvl-title">Choose level</h2>

      <div className="lvl-list">
        {LEVELS.map((lv) => {
          const checked = currentLevel === lv.key;
          return (
            <button
              type="button"
              key={lv.key}
              className={`lvl-item ${checked ? "is-selected" : ""}`}
              onClick={() => handleSelect(lv.key)}
              aria-pressed={checked}
            >
              <span className={`radio ${checked ? "checked" : ""}`} />
              <span className="label">{lv.label}</span>
            </button>
          );
        })}
      </div>

      <div className="safe-bottom" />
    </div>
  );
}
