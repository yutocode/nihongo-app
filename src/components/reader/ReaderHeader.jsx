import React from "react";
import { FaHome } from "react-icons/fa";
import XPBanner from "../XPBanner";

export default function ReaderHeader({
  title, progress,
  showFuri, setShowFuri,
  showTrans, setShowTrans,
  onBack
}) {
  return (
    <header className="reader-topbar">
      <div className="reader-topbar__left">
        <button className="hdr-btn is-ghost" onClick={onBack} aria-label="ホーム">
          <FaHome />
          <span>ホーム</span>
        </button>
      </div>

      <div className="reader-topbar__center">
        <XPBanner levelLabel="N5" percent={progress} compact />
      </div>

      <div className="reader-topbar__right">
        <label className="toggle">
          <input
            type="checkbox"
            checked={showFuri}
            onChange={(e) => setShowFuri(e.target.checked)}
          />
          <span>ふりがな</span>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showTrans}
            onChange={(e) => setShowTrans(e.target.checked)}
          />
          <span>翻訳</span>
        </label>
      </div>
    </header>
  );
}
