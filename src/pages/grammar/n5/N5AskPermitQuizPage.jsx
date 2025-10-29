// src/pages/grammar/n5/N5AskPermitQuizPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
import { n5AskPermitLessons } from "../../../data/grammar/n5/ask-permit";

/** 依頼/許可などのフォーム表示テキスト（i18n→フォールバック日語） */
function useInstructionText(t, form) {
  const RAW = String(form ?? "").trim().toLowerCase();
  const ALIAS = {
    req: "request", request: "request",
    permission: "permission", permit: "permission", allow: "permission",
    prohibition: "prohibition", forbid: "prohibition",
    obligation: "obligation", must: "obligation",
    unnecessary: "unnecessary", needless: "unnecessary",
  };
  const key = ALIAS[RAW] ?? "default";
  const i18nKey = `askPermit.instruction.${key}`;
  const jpFallback = {
    request: "この文を依頼形にしてください。",
    permission: "この文を許可形にしてください。",
    prohibition: "この文を禁止形にしてください。",
    obligation: "この文を義務形にしてください。",
    unnecessary: "この文を不要形にしてください。",
    default: "正しい形にしてください。",
  };
  const v = t(i18nKey);
  return v === i18nKey ? jpFallback[key] : v;
}

export default function N5AskPermitQuizPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { level = "n5", lesson = "Lesson1" } = useParams();

  /* 元データ取得（なければ Lesson1） */
  const pool = n5AskPermitLessons?.[lesson] ?? n5AskPermitLessons?.Lesson1 ?? [];

  /* MCQ 形式に正規化
     - questionHTML: 指示＋文（空所 ___ は飾り付き）
     - choices: HTML文字列
     - answer: 正解インデックス（配列だったら先頭を採用）
  */
  const items = useMemo(() => {
    return pool.map((q, i) => {
      const instruction = useInstructionText(t, q.form);
      const sentenceHtml = String(q.sentence_ja || "").replaceAll(
        "___",
        "<span class='gq-blank'>___</span>"
      );
      const questionHTML =
        `<p class="gq-instruction">${instruction}</p>` +
        `<p class="gq-sentence">${sentenceHtml}</p>`;

      const choices = (q.choices_ja || []).slice();
      const correctIdx = Array.isArray(q.correct) ? q.correct[0] : q.correct;

      return {
        id: q.id ?? `ask-permit-${lesson}-${i}`,
        question: questionHTML,      // HTMLをそのまま流す
        choices,                     // HTML文字列の配列
        answer: Math.max(0, Number(correctIdx) || 0),
      };
    });
  }, [pool, lesson, t]);

  /* 進行管理（出題＆選択肢の順をランダム） */
  const quiz = useMCQQuiz(items, {
    shuffleQuestions: true,
    shuffleChoices: true,
    fxDelay: 900,
  });

  return (
    <MCQQuizShell
      title={`N5 請求・許可（${lesson}）`}
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
      onExit={() => navigate(`/grammar/${String(level).toLowerCase()}/ask-permit`)}

      /* 質問は HTML をそのまま描画 */
      renderQuestion={(q) => (
        <div
          className="jp"
          dangerouslySetInnerHTML={{ __html: q?.question || "" }}
        />
      )}

      // ★ 番号を非表示に
      numberLabels={[]}
    />
  );
}
