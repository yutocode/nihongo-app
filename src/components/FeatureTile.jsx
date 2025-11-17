// src/components/FeatureTile.jsx
import React from "react";
import PropTypes from "prop-types";
import IconGlyph from "./IconGlyph.jsx";
import "../styles/FeatureTile.css";

/**
 * ホーム画面の機能タイル
 * - 上：緑の正方形サーフェス（アイコン）
 * - 下：ラベル（最大2行）
 * - disabled のときはクリック不可＋鍵マーク
 */
export default function FeatureTile({ iconName, label, onClick, disabled }) {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      className="tile"
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      aria-label={label}
    >
      <span className="tile-surface" aria-hidden="true">
        <span className="tile-ico">
          <IconGlyph name={iconName} />
        </span>
      </span>
      <span className="tile-label">{label}</span>
    </button>
  );
}

FeatureTile.propTypes = {
  iconName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

FeatureTile.defaultProps = {
  onClick: () => {},
  disabled: false,
};
