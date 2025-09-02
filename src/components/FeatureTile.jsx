import React from "react";
import IconGlyph from "./IconGlyph";
import "../styles/FeatureTile.css";

/**
 * アイコン用の正方形サーフェス + 下にラベル（2行まで）
 * - 緑の箱は .tile-surface にのみ適用
 * - ラベルは箱の外、下に配置
 */
export default function FeatureTile({ iconName, label, onClick }) {
  return (
    <button className="tile" onClick={onClick} aria-label={label}>
      <span className="tile-surface" aria-hidden>
        <span className="tile-ico">
          <IconGlyph name={iconName} />
        </span>
      </span>
      <span className="tile-label">{label}</span>
    </button>
  );
}