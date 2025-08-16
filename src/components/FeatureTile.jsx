// src/components/FeatureTile.jsx
import React from "react";
import IconGlyph from "./IconGlyph";
import "../styles/FeatureTile.css";

export default function FeatureTile({ iconName, label, onClick }) {
  return (
    <button className="tile" onClick={onClick} aria-label={label}>
      <span className="tile-ico" aria-hidden>
        <IconGlyph name={iconName} />
      </span>
      <span className="tile-label">{label}</span>
    </button>
  );
}
