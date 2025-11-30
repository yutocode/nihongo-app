// src/pages/onboarding/OnboardingLayout.jsx
import React from "react";

export default function OnboardingLayout({
  children,
  step,
  totalSteps,
  progressPercent,
  continueVariant,
  continueLabel,
  onNext,
  onPrev,
}) {
  return (
    <div className="onb-page">
      <div className="onb-shell">
        {/* 背景の“デバイス枠” */}
        <div className="onb-device">
          {/* 上部の緑プログレスバー */}
          <div className="onb-progress">
            <div
              className="onb-progress__bar"
              style={{ "--onb-progress": `${progressPercent}%` }}
            />
          </div>


          {/* 中身 */}
          <main className="onb-content">{children}</main>

          {/* 下の大きい Continue / Get Started ボタン */}
          <div className="onb-primary">
            <button
              type="button"
              className={`onb-primary-btn onb-primary-btn--${continueVariant}`}
              onClick={onNext}
            >
              {continueLabel}
            </button>
          </div>

          {/* 下のナビゲーションバー */}
          <footer className="onb-footer">
            <button
              type="button"
              className="onb-footer-btn onb-footer-btn--ghost"
              onClick={onPrev}
              disabled={step === 1}
            >
              Previous
            </button>

            <span className="onb-footer-page">
              {step} / {totalSteps}
            </span>

            <button
              type="button"
              className="onb-footer-btn"
              onClick={onNext}
            >
              {step === totalSteps ? "Skip" : "Next"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
