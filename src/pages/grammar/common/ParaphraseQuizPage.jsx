// src/pages/grammar/common/ParaphraseQuizPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";

import { getN5ParaphraseLesson } from "../../../data/grammar/n5/paraphrase";
import { getN4ParaphraseLesson } from "../../../data/grammar/n4/paraphrase";
import { getN3ParaphraseLesson } from "../../../data/grammar/n3/paraphrase";
import { getN2ParaphraseLesson } from "../../../data/grammar/n2/paraphrase";
import { getN1ParaphraseLesson } from "../../../data/grammar/n1/paraphrase";

function normalizeLesson(raw) {
  const m = String(raw ?? "").match(/(\d+)/);
  const n = m ? Math.max(1, parseInt(m[1], 10)) : 1;
  return `Lesson${n}`;
}

export default function ParaphraseQuizPage() {
  const navigate = useNavigate();
  const { level = "n5", lesson = "lesson1" } = useParams();

  const normLevel = String(level).toLowerCase();
  const normLesson = normalizeLesson(lesson);

  const items = useMemo(() => {
    let src = [];
    if (normLevel === "n5") src = getN5ParaphraseLesson(normLesson) ?? [];
    else if (normLevel === "n4") src = getN4ParaphraseLesson(normLesson) ?? [];
    else if (normLevel === "n3") src = getN3ParaphraseLesson(normLesson) ?? [];
    else if (normLevel === "n2") src = getN2ParaphraseLesson(normLesson) ?? [];
    else if (normLevel === "n1") src = getN1ParaphraseLesson(normLesson) ?? [];
    else src = [];

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
        id: q.id ?? `para-${normLevel}-${normLesson}-${i}`,
        // furigana フィールド（<ruby>付きHTML）を優先
        question: q.furigana ?? q.question ?? "",
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
      title={`${normLevel.toUpperCase()} ちかい いみ（いいかえ） ${normLesson}`}
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
      onExit={() => navigate(`/grammar/${normLevel}`)}
      renderQuestion={(q) => (
        <div
          className="jp"
          style={{ fontSize: 22 }}
          dangerouslySetInnerHTML={{ __html: q?.question || "" }}
        />
      )}
      // 番号ラベルは非表示
      numberLabels={[]}
    />
  );
}
