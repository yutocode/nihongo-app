// src/pages/WordPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import WordCard from "../components/WordCard";
import "../styles/WordPage.css";

// 単語データ
import { n5WordSets } from "../data/n5WordSets";
import { n4WordSets } from "../data/n4WordSets";
import { n3WordSets } from "../data/n3WordSets";
import { n2WordSets } from "../data/n2WordSets";
import { n1WordSets } from "../data/n1WordSets";

// Zustand & i18n
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";

export default function WordPage() {
  const { level = "", lesson = "" } = useParams();
  const selectedLanguage = useAppStore((s) => s.language);
  const { t } = useTranslation();

  // level/lesson を安全に正規化
  const normLevel = String(level).toLowerCase();
  const lessonNo = (lesson.match(/\d+/)?.[0] ?? "").toString();

  // レベル→データの対応（キーは小文字に統一）
  const wordSetsMap = {
    n5: n5WordSets,
    n4: n4WordSets,
    n3: n3WordSets,
    n2: n2WordSets,
    n1: n1WordSets,
  };

  const levelWordSet = wordSetsMap[normLevel];

  // "Lesson1" 形式とそのままの両方を許容
  const wordList =
    levelWordSet?.[`Lesson${lessonNo}`] ??
    levelWordSet?.[lesson] ??
    null;

  return (
    <div className="word-page">
      {wordList ? (
        <>
          {/* タイトル（例: "課 1"）— 翻訳キーが無くてもフォールバック */}
          <header className="word-page-head">
            <h2 className="word-page-title">
              {t("lesson.lesson", { defaultValue: "課" })} {lessonNo || "?"}
            </h2>
          </header>

          <WordCard wordList={wordList} selectedLanguage={selectedLanguage} />
        </>
      ) : (
        <p className="error-text">
          ❌{" "}
          {t("common.noWordsFound", {
            defaultValue: "該当する単語が見つかりません",
          })}{" "}
          ({normLevel.toUpperCase()} - {lesson || `Lesson${lessonNo || "?"}`})
        </p>
      )}
    </div>
  );
}