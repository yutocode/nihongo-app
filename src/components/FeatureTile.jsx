import React from "react";
import PropTypes from "prop-types";
import IconGlyph from "./IconGlyph.jsx";
import "../styles/FeatureTile.css";

/**
 * アイコン用の正方形サーフェス + 下にラベル（2行まで）
 * - 緑の箱は .tile-surface にのみ適用
 * - ラベルは箱の外、下に配置
 */
export default function FeatureTile({ iconName, label, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      className="tile"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      aria-pressed="false"
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
};

FeatureTile.defaultProps = {
  onClick: () => {},
};
