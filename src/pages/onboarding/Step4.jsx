// src/pages/onboarding/Step4.jsx
import React from "react";

export default function Step4DailyGoal({ dailyGoal, setDailyGoal }) {
  const options = [
    { id: "5", label: "5 min/day", desc: "Casual" },
    { id: "10", label: "10 min/day", desc: "Regular", recommended: true },
    { id: "15", label: "15 min/day", desc: "Serious" },
    { id: "20", label: "20 min/day", desc: "Intense" },
  ];

  return (
    <section className="onb-step">
      <header className="onb-header">
        <h1 className="onb-title">Set Up Your Daily Goal</h1>
        <p className="onb-subtitle">
          You can always change this later.
        </p>
      </header>

      <div className="onb-options onb-options--stack">
        {options.map((opt) => {
          const active = dailyGoal === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`onb-option ${
                active ? "onb-option--active" : ""
              }`}
              onClick={() => setDailyGoal(opt.id)}
            >
              <div className="onb-option__body">
                <span className="onb-option__label">{opt.label}</span>
                <span className="onb-option__desc">{opt.desc}</span>
              </div>

              {opt.recommended && (
                <span className="onb-chip">Recommended</span>
              )}

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

      <p className="onb-note">
        Daily practice is the key to fluency! 💫
      </p>
    </section>
  );
}
