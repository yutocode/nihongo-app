// src/components/BackToHomeButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/BackToHomeButton.css";

function IconBack(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M15 18l-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BackToHomeButton({
  to = "/",
  label = "ホームへ戻る",
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={["bth", className].join(" ")}
      onClick={() => navigate(to)}
      aria-label={label}
    >
      <IconBack className="bth__icon" />
      <span className="bth__text">{label}</span>
    </button>
  );
}