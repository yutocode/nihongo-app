// src/pages/WordPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import WordCard from "../components/WordCard";
import { n5WordSets } from "../data/n5WordSets";
import "../styles/WordPage.css";

const WordPage = () => {
  const { t, i18n } = useTranslation();
  const selectedLanguage = i18n.language || "en";

  // 今は仮で Lesson1 を表示
  const wordList = n5WordSets.Lesson1;

  return (
    <div className="word-page">
      <h2>{t("part", { num: 1 })}</h2>
      <WordCard wordList={wordList} selectedLanguage={selectedLanguage} />
    </div>
  );
};

export default WordPage;
