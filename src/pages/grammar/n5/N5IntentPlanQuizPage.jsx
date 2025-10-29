// src/pages/grammar/n5/N5IntentPlanQuizPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
import { n5IntentPlanLessons } from "../../../data/grammar/n5/intent-plan";

// ---- local utils (このページで選択肢シャッフル＆正解再マップ) ----
const range = (n) => Array.from({ length: n }, (_, i) => i);
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
// correct が配列でも単一でも対応して新しいインデックスへ再マップ（配列の先頭を正解として扱う）
const remapCorrect = (origCorrect, order) => {
  if (Array.isArray(origCorrect) && origCorrect.length) {
    return order.indexOf(origCorrect[0]);
  }
  return order.indexOf(origCorrect);
};

export default function N5IntentPlanQuizPage() {
  const { lesson = "Lesson1" } = useParams();
  const navigate = useNavigate();

  // 元データ → ページ内でシャッフル＆整形（ダブルシャッフルを避けるためフック側ではシャッフルしない）
  const items = useMemo(() => {
    const pool = n5IntentPlanLessons?.[lesson] ?? n5IntentPlanLessons?.Lesson1 ?? [];
    // 出題順をシャッフル
    const questionOrder = shuffle(range(pool.length));
    return questionOrder.map((qi) => {
      const q = pool[qi];
      const order = shuffle(range(q.choices_ja.length));
      const choices = order.map((i) => q.choices_ja[i]);
      const answer = remapCorrect(q.correct, order);

      // 空所 ___ を見やすいスタイルに（シェル側で innerHTML 表示）
      const sentenceHtml = String(q.sentence_ja || "").replaceAll(
        "___",
        "<span class='gq-blank'>___</span>"
      );

      return {
        id: q.id ?? `intent-${lesson}-${qi}`,
        question: sentenceHtml,     // HTML文字列
        choices,                    // string[]
        answer,                     // number
      };
    });
  }, [lesson]);

  // フックは状態管理と○×演出タイミングだけ使う（シャッフルはオフ）
  const quiz = useMCQQuiz(items, {
    shuffleQuestions: false,
    shuffleChoices: false,
    fxDelay: 900,
  });

  return (
    <MCQQuizShell
      title={`N5 意図・計画（${lesson}）`}
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
      onExit={() => navigate(`/grammar/n5/intent-plan`)}
      // 問題文は HTML をそのまま表示（空所スタイル適用）
      renderQuestion={(q) => (
        <p
          className="gq-sentence"
          dangerouslySetInnerHTML={{ __html: q?.question || "" }}
        />
      )}
      // ★ 番号を非表示に
      numberLabels={[]}
    />
  );
}
