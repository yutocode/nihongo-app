import React from "react";
import { useNavigate } from "react-router-dom";
import XPBanner from "@/components/XPBanner";
import "@/styles/Header.css";

function IconLayers(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M12 3 2 8l10 5 10-5-10-5Zm0 8L2 6v4l10 5 10-5V6l-10 5Zm0 6L2 12v4l10 5 10-5v-4l-10 5Z"
      />
    </svg>
  );
}

export default function Header({
  leftButton = null,
  onOpenLevels,
}) {
  const navigate = useNavigate();
  const handleLevels = onOpenLevels || (() => navigate("/levels"));

  return (
    <header className="app-header" role="banner">
      <div className="app-header__inner">
        <div className="hdr-left">
          {leftButton ? leftButton : <div className="hdr-placeholder" aria-hidden="true" />}
        </div>

        <div className="hdr-center">
          <XPBanner compact />
        </div>

        <div className="hdr-right">
          <button
            type="button"
            className="hdr-icon-btn"
            onClick={handleLevels}
            aria-label="Levels"
          >
            <IconLayers className="hdr-ic" />
          </button>
        </div>
      </div>
    </header>
  );
}