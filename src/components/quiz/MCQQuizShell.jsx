// src/components/quiz/MCQQuizShell.jsx
import JudgeFX from "./JudgeFX";

export default function MCQQuizShell({
  title = "Quiz",
  questions,
  current,
  index,
  total,
  score,
  selected,
  judge,
  finished,
  onPick,
  onRestart,
  onBack,
  onExit,
  renderQuestion,        // (q) => ReactNode
  renderChoice,          // (choice, i, q) => ReactNode
  numberLabels = ["1","2","3","4"],
}) {
  if (!questions?.length) {
    return (
      <div className="quiz-wrap">
        <h1>{title}</h1>
        <p>このレッスンの問題データが見つかりません。</p>
        {onExit && (
          <button className="choice-btn" onClick={() => onExit?.()}>
            戻る
          </button>
        )}
      </div>
    );
  }

  if (finished) {
    const pct = total ? Math.round((score / total) * 100) : 0;
    return (
      <div className="quiz-wrap">
        <h1>{title}</h1>
        <div className="result-card">
          <p className="counter">Score: {score}/{total}（{pct}%）</p>
          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
            <button className="choice-btn" onClick={() => onRestart?.()}>もう一度</button>
            {onExit && (
              <button className="choice-btn" onClick={() => onExit?.()}>
                レッスン一覧へ
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const wrapCls = judge ? (judge === "correct" ? "show-correct" : "show-wrong") : "";
  const qid = current?.id ?? `q-${index}`;

  return (
    <div className={`quiz-wrap ${wrapCls}`}>
      <div className="counter" aria-live="polite">
        {title} {index + 1}/{total}
      </div>

      <div className="question">
        {renderQuestion ? renderQuestion(current) : (current?.question || "")}
      </div>

      <div className="choices" role="group" aria-label="選択肢">
        {current?.choices?.map((c, i) => {
          const classes =
            selected !== null
              ? i === current.answer
                ? "choice-btn correct"
                : i === selected
                ? "choice-btn wrong"
                : "choice-btn"
              : "choice-btn";

          return (
            <button
              key={`${qid}-${i}`}
              className={classes}
              onClick={() => onPick?.(i)}
              disabled={selected !== null}
            >
              {numberLabels[i] && <b className="opt-label">{numberLabels[i]}.</b>}{" "}
              {renderChoice
                ? renderChoice(c, i, current)
                : <span dangerouslySetInnerHTML={{ __html: String(c) }} />}
            </button>
          );
        })}
      </div>

      <div className="quiz-footer-nav">
        <button
          className="choice-btn"
          onClick={() => onBack?.()}
          disabled={index === 0 || selected !== null}
        >
          ← 前へ
        </button>
        {onExit && (
          <button
            className="choice-btn"
            onClick={() => onExit?.()}
            disabled={selected !== null}
          >
            レッスン一覧へ
          </button>
        )}
      </div>

      <JudgeFX judge={judge} />
    </div>
  );
}
