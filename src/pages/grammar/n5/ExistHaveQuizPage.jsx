// src/pages/grammar/n5/ExistHaveQuizPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
import TextWithRuby from "../../../components/TextWithRuby";
import { getN5ExistHaveLesson } from "../../../data/grammar/n5/exist-have";

export default function ExistHaveQuizPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { level = "n5", lesson = "lesson1" } = useParams();

  // 既存データ: { question/furigana/choices: string[], answer: string } → MCQ化
  const items = useMemo(() => {
    if (level !== "n5") return [];
    const raw = getN5ExistHaveLesson(lesson) ?? [];
    return raw.map((q, i) => {
      const choices = q.choices || [];
      const ansIdx = Math.max(0, choices.indexOf(q.answer));
      return {
        id: q.id ?? `exist-${lesson}-${i}`,
        question: q.furigana || q.question,
        choices,
        answer: ansIdx,
        _showExplain: q.explanation || "",
      };
    });
  }, [level, lesson]);

  const quiz = useMCQQuiz(items, { shuffleQuestions: true, shuffleChoices: true, fxDelay: 750 });

  return (
    <MCQQuizShell
      title={`${t("exist.title", { defaultValue: "存在・所有クイズ" })}（${level.toUpperCase()} / ${lesson}）`}
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
      onExit={() => navigate(`/grammar/${level}/exist-have`)}
      renderQuestion={(q) => (
        <span className="jp" style={{ fontSize: 22 }}>
          <TextWithRuby value={q?.question || ""} />
        </span>
      )}
      // ★ 番号を非表示に
      numberLabels={[]}
    />
  );
}
