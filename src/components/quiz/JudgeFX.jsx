export default function JudgeFX({ judge }) {
  if (!judge) return null;
  return (
    <div className="judge-overlay" aria-hidden>
      {judge === "correct" ? (
        <svg className="judge-circle" viewBox="0 0 120 120">
          <circle className="ring" cx="60" cy="60" r="45" />
          <circle className="ring2" cx="60" cy="60" r="30" />
        </svg>
      ) : (
        <svg className="judge-cross" viewBox="0 0 120 120">
          <line className="bar1" x1="30" y1="30" x2="90" y2="90" />
          <line className="bar2" x1="90" y1="30" x2="30" y2="90" />
        </svg>
      )}
    </div>
  );
}
