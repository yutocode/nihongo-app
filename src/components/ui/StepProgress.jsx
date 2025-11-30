// src/components/ui/StepProgress.jsx
export function StepProgress({ current = 1, total = 5 }) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="stepper">
      <p className="stepper__label">
        {current} / {total} steps completed
      </p>
      <div className="stepper__track">
        {steps.map((step) => (
          <div
            key={step}
            className="stepper__dot"
            data-state={
              step < current ? "done" : step === current ? "current" : "todo"
            }
          >
            {step < current ? "✓" : step}
          </div>
        ))}
      </div>
    </div>
  );
}