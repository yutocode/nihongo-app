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

const WordPage = () => {
  const { level, lesson } = useParams();
  const selectedLanguage = useAppStore((state) => state.language);
  const { t } = useTranslation(); // ✅ 翻訳フックを追加

  const wordSetsMap = {
    n5: n5WordSets,
    n4: n4WordSets,
    n3: n3WordSets,
    n2: n2WordSets,
    n1: n1WordSets,
  };

  const levelWordSet = wordSetsMap[level];
  const wordList = levelWordSet?.[lesson];

  return (
    <div className="word-page">
      {wordList ? (
        <>
          {/* ✅ 翻訳対応されたレッスンタイトル表示 */}
          <h2 className="word-page-title">
            {t("lesson", "レッスン")} {lesson.replace("Lesson", "")}
          </h2>

          <WordCard wordList={wordList} selectedLanguage={selectedLanguage} />
        </>
      ) : (
        <p className="error-text">
          ❌ {t("noWordsFound", "該当する単語が見つかりません")} ({level} - {lesson})
        </p>
      )}
    </div>
  );
};

export default WordPage;
