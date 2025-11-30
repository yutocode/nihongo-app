// src/pages/onboarding/Step5PracticeTime.jsx
import React, { useEffect, useMemo, useState } from "react";

function clampHour(value) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 23) return 23;
  return n;
}

function getSlotMeta(hour) {
  if (hour >= 5 && hour < 12) {
    return { label: "Morning", emoji: "🌅" };
  }
  if (hour >= 12 && hour < 18) {
    return { label: "Afternoon", emoji: "🌞" };
  }
  if (hour >= 18 && hour < 22) {
    return { label: "Evening", emoji: "🌇" };
  }
  return { label: "Night", emoji: "🌙" };
}

const SLIDER_MARKS = [
  { hour: 6, text: "06:00" },
  { hour: 12, text: "12:00" },
  { hour: 18, text: "18:00" },
  { hour: 0, text: "00:00" },
];

export default function Step5PracticeTime({ practiceIndex, setPracticeIndex }) {
  const hour = clampHour(practiceIndex);

  const [isPulsing, setIsPulsing] = useState(false);

  const meta = useMemo(() => getSlotMeta(hour), [hour]);
  const formattedTime = useMemo(
    () => `${hour.toString().padStart(2, "0")}:00`,
    [hour],
  );

  useEffect(() => {
    // 時間が変わったときに、丸いカードを「ポン」っとさせる
    setIsPulsing(true);
    const timer = setTimeout(() => setIsPulsing(false), 220);
    return () => clearTimeout(timer);
  }, [hour]);

  const handleSliderChange = (e) => {
    setPracticeIndex(clampHour(e.target.value));
  };

  return (
    <section className="onb-step">
      <header className="onb-header">
        <h1 className="onb-title">When will you practice?</h1>
        <p className="onb-subtitle">
          We&apos;ll send you a friendly reminder.
        </p>
      </header>

      {/* 真ん中の丸いタイムカード */}
      <div className="onb-time-card">
        <div
          className={
            "onb-time-card__circle" +
            (isPulsing ? " onb-time-card__circle--pulse" : "")
          }
        >
          <span className="onb-time-card__emoji">{meta.emoji}</span>
          <span className="onb-time-card__time">{formattedTime}</span>
          <span className="onb-time-card__label">{meta.label}</span>
        </div>
      </div>

      {/* スライダー */}
      <div className="onb-slider-block">
        <input
          type="range"
          min="0"
          max="23"
          step="1"
          value={hour}
          onChange={handleSliderChange}
          className="onb-slider"
        />

        <div className="onb-slider-labels">
          {SLIDER_MARKS.map((mark) => {
            const isActive = mark.hour === hour;
            return (
              <span
                key={mark.hour}
                className={
                  "onb-slider-label" +
                  (isActive ? " onb-slider-label--active" : "")
                }
              >
                {mark.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* 通知メッセージ */}
      <div className="onb-reminder">
        <span className="onb-reminder__icon">🔔</span>
        <p className="onb-reminder__text">
          We&apos;ll remind you daily to keep your streak going!
        </p>
      </div>
    </section>
  );
}
