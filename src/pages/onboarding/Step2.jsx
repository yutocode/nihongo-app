// src/pages/onboarding/Step2.jsx
import React from "react";

// 共通：配列のトグル
function toggleMulti(list, setter, value) {
  setter((prev) =>
    prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value],
  );
}

export default function Step2({ goals, setGoals }) {
  const options = [
    { id: "travel", label: "Travel", icon: "✈️" },
    { id: "conversation", label: "Deep Conversations", icon: "💬" },
    { id: "grades", label: "Improve Grades", icon: "🎓" },
    { id: "anime", label: "Anime & Manga", icon: "📚" },
    { id: "business", label: "Business", icon: "💼" },
    { id: "fun", label: "Just for Fun", icon: "😊" },
  ];

  return (
    <section className="onb-step">
      <header className="onb-header">
        <h1 className="onb-title">
          Tell us more about your learning goals!
        </h1>
        <p className="onb-subtitle">Select all that apply.</p>
      </header>

      {/* 2列グリッド（Figma と同じ） */}
      <div className="onb-options onb-options--grid2">
        {options.map((opt) => {
          const active = goals.includes(opt.id);

          return (
            <button
              key={opt.id}
              type="button"
              className={`onb-option onb-option--level onb-option--goal ${
                active ? "onb-option--active" : ""
              }`}
              data-selected={active ? "true" : "false"}
              onClick={() => toggleMulti(goals, setGoals, opt.id)}
            >
              <div className="onb-option__icon">
                <span aria-hidden="true">{opt.icon}</span>
              </div>

              <div className="onb-option__body">
                <span className="onb-option__label">{opt.label}</span>
              </div>

              {/* 右上の緑チェック */}
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
