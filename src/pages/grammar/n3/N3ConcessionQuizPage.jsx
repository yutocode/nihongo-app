// src/pages/grammar/n3/N3ConcessionQuizPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
import TextWithRuby from "../../../components/TextWithRuby";
import { getN3ConcessionLesson } from "../../../data/grammar/n3/concession";

export default function ConcessionQuizPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { level = "n3", lesson = "lesson1" } = useParams();

  // lesson 正規化（lesson12 / Lesson12 → lesson12）
  const lessonKey = useMemo(() => {
    const m = String(lesson).match(/lesson\s*(\d+)/i);
    return m ? `lesson${m[1]}` : String(lesson).toLowerCase();
  }, [lesson]);

  // N3 逆接データ → MCQ 形式へ
  const items = useMemo(() => {
    if (String(level).toLowerCase() !== "n3") return [];
    const raw = getN3ConcessionLesson(lessonKey) ?? [];
    return raw.map((q, i) => ({
      id: q.id ?? `n3-conc-${lessonKey}-${i}`,
      question: q.question,               // ふりがな入り (<ruby>) OK
      choices: Array.isArray(q.choices) ? q.choices : [],
      answer:
        typeof q.answer === "number" && q.answer >= 0 ? q.answer : 0,
      _showExplain: q.explanation || "",  // 任意の解説フィールドに対応
    }));
  }, [level, lessonKey]);

  const quiz = useMCQQuiz(items, {
    shuffleQuestions: true,
    shuffleChoices: true,
    fxDelay: 750,
  });

  return (
    <MCQQuizShell
      title={`${t("concession.title", { defaultValue: "逆接クイズ" })}（${String(level).toUpperCase()} / ${lessonKey}）`}
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
      onExit={() => navigate(`/grammar/${String(level).toLowerCase()}/concession`)}
      renderQuestion={(q) => (
        <span className="jp" style={{ fontSize: 22 }}>
          <TextWithRuby value={q?.question || ""} />
        </span>
      )}
      // 写真スタイルに合わせて番号は非表示
      numberLabels={[]}
    />
  );
}
