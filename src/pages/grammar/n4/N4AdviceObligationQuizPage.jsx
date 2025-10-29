import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
import { getN4AdviceObligationLesson } from "../../../data/grammar/n4/advice-obligation";

function normalizeLesson(raw) {
  if (!raw) return "Lesson1";
  const m = String(raw).match(/(\d+)/);
  const no = m ? Math.max(1, parseInt(m[1], 10)) : 1;
  return `Lesson${no}`;
}

export default function N4AdviceObligationQuizPage() {
  const navigate = useNavigate();
  const { level = "n4", lesson = "lesson1" } = useParams();

  const normLevel = String(level).toLowerCase();
  const normLesson = normalizeLesson(lesson);

  const items = useMemo(() => {
    if (normLevel !== "n4") return [];
    const src = getN4AdviceObligationLesson(normLesson) ?? [];
    return src
      .filter(
        (q) =>
          Array.isArray(q?.choices) &&
          q.choices.length === 4 &&
          Number.isInteger(q?.answer) &&
          q.answer >= 0 &&
          q.answer < 4
      )
      .map((q, i) => ({
        id: q.id ?? `n4-ao-${normLesson}-${i}`,
        question: q.furigana || q.question || "",
        choices: q.choices,
        answer: q.answer,
      }));
  }, [normLevel, normLesson]);

  const quiz = useMCQQuiz(items, {
    shuffleQuestions: true,
    shuffleChoices: true,
    fxDelay: 750,
  });

  return (
    <MCQQuizShell
      title={`N4 助言・義務・不要 ${normLesson}`}
      questions={quiz.questions}
      current={quiz.current}
      index={quiz.index}
      total={quiz.total}
      score={quiz.score}
      selected={quiz.selected}
      judge={quiz.judge}
      finished={quiz.finished}
      onPick={quiz.pick}
      onRestart={quiz.restart}
      onBack={quiz.backOne}
      onExit={() => navigate(`/grammar/n4`)}
      renderQuestion={(q) =>
        typeof q?.question === "string" && q.question.includes("<rt>") ? (
          <span
            className="jp"
            style={{ fontSize: 22 }}
            dangerouslySetInnerHTML={{ __html: q.question }}
          />
        ) : (
          <span className="jp" style={{ fontSize: 22 }}>
            {q?.question || ""}
          </span>
        )
      }
      numberLabels={[]} // 問題番号のラベル非表示
    />
  );
}
