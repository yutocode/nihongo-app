// src/pages/grammar/n4/N4AdviceObligationQuizPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/GrammarQuiz.css";

// ★ 追加入力（ご要望分）
import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
import TextWithRuby from "../../../components/TextWithRuby";
import { getN5ExistHaveLesson } from "../../../data/grammar/n5/exist-have"; // 将来の流用用

import { getN4AdviceObligationLesson } from "../../../data/grammar/n4/advice-obligation";

// linter対策：現時点では未使用のため抑止（将来ここで流用する想定）
// eslint-disable-next-line no-unused-vars
const __keepImport = getN5ExistHaveLesson;

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

  // データ整形
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
        // ふりがなHTML対応（TextWithRubyで描画）
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
      // 問題文：<ruby> を含む場合は TextWithRuby で描画、無ければプレーン
      renderQuestion={(q) =>
        typeof q?.question === "string" && q.question.includes("<rt>") ? (
          <TextWithRuby
            html={q.question}
            className="jp"
            style={{ fontSize: 22 }}
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
