import React from "react";
import PropTypes from "prop-types";
import IconGlyph from "./IconGlyph.jsx";
import "../styles/FeatureTile.css";

/**
 * アイコン用の正方形サーフェス + 下にラベル（2行まで）
 * - 緑の箱は .tile-surface にのみ適用
 * - ラベルは箱の外、下に配置
 * - disabled の場合はクリック不可＆「近日公開」バッジ表示
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
      className={`tile ${disabled ? "is-disabled" : ""}`}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      aria-label={label}
      aria-disabled={disabled ? "true" : "false"}
      tabIndex={disabled ? -1 : 0}
    >
      <span className="tile-surface" aria-hidden="true">
        <span className="tile-ico">
          <IconGlyph name={iconName} />
        </span>
        {disabled && <span className="soon-badge">近日公開</span>}
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
