// src/components/HeaderRight.jsx
import React, { useState } from "react";
import { FiSettings } from "react-icons/fi"; 

export default function HeaderRight() {
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  return (
    <div className="header-right">
      {/* レベル選択トリガー */}
      <button 
        className="level-select-btn"
        onClick={() => setShowLevelSelect(!showLevelSelect)}
      >
        JLPT N5 ▼
      </button>

      {/* 設定ボタン */}
      <button className="settings-btn">
        <FiSettings size={22} />
      </button>

      {/* レベル選択モーダル */}
      {showLevelSelect && (
        <div className="level-select-modal">
          <h3>Choose level</h3>
          <ul>
            <li>Beginner</li>
            <li>JLPT N5</li>
            <li>JLPT N4</li>
            <li>JLPT N3</li>
            <li>JLPT N2</li>
            <li>JLPT N1</li>
          </ul>
        </div>
      )}
    </div>
  );
}
