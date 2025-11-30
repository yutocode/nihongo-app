// src/pages/onboarding/Step1.jsx
import React from "react";

export default function Step1Level({ level, setLevel }) {
  const options = [
    { id: "starter", label: "Starter", icon: "🌱" },
    { id: "beginner", label: "Beginner", icon: "🧩" },
    { id: "intermediate", label: "Intermediate", icon: "☁️" },
    { id: "advanced", label: "Advanced", icon: "🌲" },
    { id: "expert", label: "Expert", icon: "🏝️" },
  ];

  return (
    <section className="onb-step">
      <header className="onb-header">
        <h1 className="onb-title">How fluent are you in Japanese?</h1>
        <p className="onb-subtitle">
          Let&apos;s customize your learning experience!
        </p>
      </header>

      <div className="onb-options onb-options--stack">
        {options.map((opt) => {
          const active = level === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`onb-option onb-option--level ${
                active ? "onb-option--active" : ""
              }`}
              onClick={() => setLevel(opt.id)}
            >
              <div className="onb-option__icon">
                <span aria-hidden="true">{opt.icon}</span>
              </div>
              <div className="onb-option__body">
                <span className="onb-option__label">{opt.label}</span>
              </div>
              <div
                className={`onb-option__check ${
                  active ? "onb-option__check--visible" : ""
                }`}
                aria-hidden="true"
              >
                ✓
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
