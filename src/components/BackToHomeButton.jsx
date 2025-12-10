// src/components/AvatarPicker.jsx
import React from "react";
import PropTypes from "prop-types";
import { AVATAR_ICONS } from "@/data/avatarIcons";
import "@/styles/AvatarPicker.css";

export default function AvatarPicker({ value, onChange, ariaLabel = "Choose an avatar" }) {
  return (
    <div className="avp" role="radiogroup" aria-label={ariaLabel}>
      {AVATAR_ICONS.map((a) => {
        const selected = a.key === value;
        return (
          <button
            key={a.key}
            type="button"
            className={`avp-item ${selected ? "is-selected" : ""}`}
            onClick={() => onChange?.(a.key)}
            role="radio"
            aria-checked={selected}
            aria-label={a.label}
          >
            <span className="avp-ring" aria-hidden="true">
              <img className="avp-img" src={a.src} alt="" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

AvatarPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};

AvatarPicker.defaultProps = {
  ariaLabel: "Choose an avatar",
};