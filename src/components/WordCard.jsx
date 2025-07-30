// src/components/WordCard.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/WordCard.css";

const WordCard = ({ wordList, selectedLanguage }) => {
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const { t, i18n } = useTranslation();

  const currentLang = selectedLanguage || i18n.language || "ja";

  // ⚠️ wordList の存在確認（安全対策）
  if (!wordList || wordList.length === 0) {
    return <div className="word-card"><p>No words available.</p></div>;
  }

  const word = wordList[index];

  // 手動ラベル（i18nのfallbackに備え）
  const labels = {
    ja: { back: "← 戻る", next: "次へ →", show: "クリックして意味を表示", meaning: "意味" },
    id: { back: "← Kembali", next: "Lanjut →", show: "Klik untuk melihat arti", meaning: "Arti" },
    en: { back: "← Back", next: "Next →", show: "Click to show meaning", meaning: "Meaning" },
    zh: { back: "← 返回", next: "下一個 →", show: "点击显示意思", meaning: "意思" },
    tw: { back: "← 返回", next: "下一個 →", show: "點擊顯示意思", meaning: "意思" },
  };

  const label = labels[currentLang] || labels.ja;

  const handleNext = () => {
    setShowMeaning(false);
    if (index < wordList.length - 1) {
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    setShowMeaning(false);
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="word-card">
      <div className="kanji">{word.kanji}</div>
      <div className="reading">{word.reading}</div>

      <div className="meaning-box" onClick={() => setShowMeaning(true)}>
        {showMeaning ? (
          <p><b>{label.meaning}:</b> {word.meanings[currentLang]}</p>
        ) : (
          <p>{label.show}</p>
        )}
      </div>

      <div className="navigation">
        <button onClick={handlePrev} disabled={index === 0}>
          {label.back}
        </button>
        <button onClick={handleNext} disabled={index === wordList.length - 1}>
          {label.next}
        </button>
      </div>
    </div>
  );
};

export default WordCard;






