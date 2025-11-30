// src/pages/Onboarding.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/Onboarding.css";

import OnboardingLayout from "./onboarding/OnboardingLayout";
import Step1 from "./onboarding/Step1";
import Step2 from "./onboarding/Step2";
import Step3 from "./onboarding/Step3";
import Step4 from "./onboarding/Step4";
import Step5 from "./onboarding/Step5";

const TOTAL_STEPS = 5;

const practiceSlots = [
  { id: 0, time: "06:00", label: "Morning", emoji: "🌅" },
  { id: 1, time: "12:00", label: "Afternoon", emoji: "🌞" },
  { id: 2, time: "18:00", label: "Evening", emoji: "🌇" },
  { id: 3, time: "00:00", label: "Night", emoji: "🌙" },
];

export default function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [level, setLevel] = useState("starter");
  const [goals, setGoals] = useState([]);
  const [interests, setInterests] = useState([]);
  const [dailyGoal, setDailyGoal] = useState("10");
  const [practiceIndex, setPracticeIndex] = useState(2); // 18:00

  const progressPercent = (step / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }

    // ✅ 最後の「Get Started!」でホームに飛ばす
    try {
      window.localStorage.removeItem("needsOnboarding");
    } catch (e) {
      console.warn("needsOnboarding 削除失敗:", e);
    }

    // TODO: Zustand に保存したくなったらここで level / goals / interests / dailyGoal / practiceSlots[practiceIndex] を保存
    // useAppStore.getState().setOnboarding({ ... })

    navigate("/home", { replace: true });
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const continueVariant =
    step === 1
      ? "green"
      : step === 2
        ? "purple"
        : step === 3
          ? "blue"
          : step === 4
            ? "orange"
            : "pink";

  const continueLabel = step === TOTAL_STEPS ? "Get Started!" : "Continue";

  return (
    <OnboardingLayout
      step={step}
      totalSteps={TOTAL_STEPS}
      progressPercent={progressPercent}
      continueVariant={continueVariant}
      continueLabel={continueLabel}
      onNext={handleNext}
      onPrev={handlePrev}
    >
      {step === 1 && (
        <Step1 level={level} setLevel={setLevel} key="step1" />
      )}

      {step === 2 && (
        <Step2 goals={goals} setGoals={setGoals} key="step2" />
      )}

      {step === 3 && (
        <Step3
          interests={interests}
          setInterests={setInterests}
          key="step3"
        />
      )}

      {step === 4 && (
        <Step4
          dailyGoal={dailyGoal}
          setDailyGoal={setDailyGoal}
          key="step4"
        />
      )}

      {step === 5 && (
        <Step5
          practiceSlots={practiceSlots}
          practiceIndex={practiceIndex}
          setPracticeIndex={setPracticeIndex}
          key="step5"
        />
      )}
    </OnboardingLayout>
  );
}
