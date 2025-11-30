// src/pages/onboarding/Step3.jsx
import React from "react";

// 共通：配列トグル
function toggleMulti(list, setter, value) {
  setter((prev) =>
    prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value],
  );
}

export default function Step3({ interests, setInterests }) {
  const options = [
    { id: "culture", label: "Culture", icon: "🏯" },
    { id: "anime", label: "Anime", icon: "🎌" },
    { id: "food", label: "Food", icon: "🍣" },
    { id: "travel", label: "Travel", icon: "✈️" },
    { id: "business", label: "Business", icon: "💼" },
    { id: "daily", label: "Daily Life", icon: "🏠" },
    { id: "tech", label: "Technology", icon: "💻" },
    { id: "music", label: "Music", icon: "🎵" },
    { id: "arts", label: "Arts", icon: "🎨" },
    { id: "sports", label: "Sports", icon: "⚽️" },
    { id: "education", label: "Education", icon: "📚" },
    { id: "outdoors", label: "Outdoors", icon: "⛰️" },
  ];

  return (
    <section className="onb-step">
      <header className="onb-header">
        <h1 className="onb-title">Choose your interests</h1>
        <p className="onb-subtitle">
          We&apos;ll personalize your lessons.
        </p>
      </header>

      {/* 3列グリッド（Figma と同じ） */}
      <div className="onb-options onb-options--grid3">
        {options.map((opt) => {
          const active = interests.includes(opt.id);

          return (
            <button
              key={opt.id}
              type="button"
              className={`onb-option onb-option--level onb-option--interest ${
                active ? "onb-option--active" : ""
              }`}
              data-selected={active ? "true" : "false"}
              onClick={() => toggleMulti(interests, setInterests, opt.id)}
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
