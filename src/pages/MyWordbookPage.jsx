// src/pages/MyWordbookPage.jsx
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useMyWordsStore } from "../store/useMyWordsStore";
import WordCard from "../components/WordCard";
import "../styles/MyWordbookPage.css";

// 一意ID（保存時の id があればそれを最優先）
const buildId = (w) =>
  w?.id ??
  `${w?.level ?? "n?"}:${w?.lesson ?? "Lesson?"}:${w?.idx ?? w?.kanji ?? Math.random()}`;

export default function MyWordbookPage() {
  const { t } = useTranslation();
  const items = useMyWordsStore((s) => s.items);
  const removeWord = useMyWordsStore((s) => s.removeWord);
  const clear = useMyWordsStore((s) => s.clear);

  // ==== 1枚表示用のインデックス ====
  const [index, setIndex] = useState(0);

  const goto = useCallback(
    (next) => {
      if (next >= 0 && next < items.length) {
        setIndex(next);
      }
    },
    [items.length]
  );

  const handleRemove = (w) => {
    removeWord(buildId(w));
    // 削除後にインデックス調整
    if (index >= items.length - 1) {
      setIndex(Math.max(0, items.length - 2));
    }
  };

  return (
    <div className="mywb-wrap">
      <h2 className="mywb-title">{t("mywb.title", "My Wordbook")}</h2>

      {items.length === 0 ? (
        <p className="mywb-empty">
          {t("mywb.empty", "まだ追加された単語はありません。")}
        </p>
      ) : (
        <>
          {/* ここで items を丸ごと渡し、WordCard 側の Next/Back で切替 */}
          <WordCard
            wordList={items}
            level={items[index]?.level || "n5"}
            lesson={items[index]?.lesson || "Lesson1"}
            onIndexChange={setIndex}
            mode="my" // ← WordCard 側で mode="my" のとき右上ボタンを削除に
            onRemove={() => handleRemove(items[index])}
          />

          <div className="mywb-actions">
            <button className="mywb-clear" onClick={clear}>
              {t("mywb.clearAll", "全部消す")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}