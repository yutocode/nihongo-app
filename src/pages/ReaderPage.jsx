// src/pages/ReaderPage.jsx
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { n5Stories } from "../data/reader/n5/stories";
import ReaderHeader from "../components/ReaderHeader.jsx";
import SentenceCard from "../components/SentenceCard.jsx";
import BottomActionBar from "../components/BottomActionBar.jsx";
import WordPopup from "../components/WordPopup.jsx";
import { useAppStore } from "../store/useAppStore";

// （あれば）共通辞書ローダーを使う
// ない場合はこの import を一旦コメントアウトしても動きます。
import { getGlobalDict } from "@/data/dictionary/globalDict"; // 任意（前回案）

const STORY_MAP = { n5: n5Stories };

// i18n.language を storyの翻訳キーへマッピング
const pickKey = (lng) => {
  const l = String(lng || "").toLowerCase();
  if (l.startsWith("zh-tw") || l === "tw") return "tw";
  if (l.startsWith("zh") || l === "cn") return "zh";
  if (l.startsWith("en")) return "en";
  if (l.startsWith("ko")) return "ko";
  if (l.startsWith("vi")) return "vi";
  if (l.startsWith("th")) return "th";
  if (l.startsWith("my")) return "my";
  return "ja";
};

export default function ReaderPage() {
  const { storyId = "story1" } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [idx, setIdx] = useState(0);
  const [showFuri, setShowFuri] = useState(true);
  const [showTrans, setShowTrans] = useState(true);
  const [popupWord, setPopupWord] = useState(null); // 単語ポップアップ
  const audioRef = useRef(null);

  const saveReaderProgress = useAppStore((s) => s.saveReaderProgress);

  // ストーリー取得（N5固定）
  const story = useMemo(() => STORY_MAP.n5?.[storyId], [storyId]);

  // 共通辞書（5000語）。モジュールが無ければ空でフォールバック
  const globalDict = useMemo(() => {
    try {
      return getGlobalDict ? getGlobalDict() : {};
    } catch {
      return {};
    }
  }, []);

  // ストーリーが無ければ一覧へ戻す
  useEffect(() => {
    if (!story) navigate("/reader", { replace: true });
  }, [story, navigate]);

  // ストーリー切替時の初期化
  useEffect(() => {
    setIdx(0);
    setPopupWord(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [storyId]);

  const sentences = story?.sentences ?? [];
  const page = sentences[idx];
  const total = sentences.length;
  const progress = total ? Math.round(((idx + 1) / total) * 100) : 0;

  // 進捗保存（軽いデバウンス）
  useEffect(() => {
    if (!story) return;
    const t = setTimeout(() => {
      try {
        saveReaderProgress("n5", story.id, idx);
      } catch {}
    }, 150);
    return () => clearTimeout(t);
  }, [idx, story, saveReaderProgress]);

  // 再生（音声未用意なら安全ログ）
  const onPlay = useCallback(() => {
    if (!page || !story || !audioRef.current) return;
    if (!page.audio) {
      console.log("音声はまだ準備中です");
      return;
    }
    const url = `${story.audioBase}/${page.audio}`;
    audioRef.current.src = url;
    audioRef.current.play().catch(() => console.log("音声はまだ準備中です"));
  }, [page, story]);

  // 音声終了で次へ
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const handleEnd = () => setIdx((i) => Math.min(i + 1, total - 1));
    el.addEventListener("ended", handleEnd);
    return () => el.removeEventListener("ended", handleEnd);
  }, [total]);

  const next = useCallback(
    () => setIdx((i) => Math.min(i + 1, total - 1)),
    [total]
  );
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  if (!story) return null;

  // 選択言語で翻訳テキスト
  const langKey = pickKey(i18n.language);
  const trText =
    page && showTrans
      ? page.tr?.[langKey] ?? page.tr?.en ?? page.tr?.ja ?? null
      : null;

  // ポップアップに渡す辞書エントリ（ページ辞書優先 → 共通辞書）
  const popupEntry =
    (page?.dict && popupWord && page.dict[popupWord]) ||
    (popupWord && globalDict[popupWord]) ||
    null;

  return (
    <div className="reader-wrap">
      <ReaderHeader
        title={story.title}
        progress={progress}
        current={idx + 1}
        total={total}
        showFuri={showFuri}
        setShowFuri={setShowFuri}
        showTrans={showTrans}
        setShowTrans={setShowTrans}
        onBack={() => navigate("/reader")}
        onFlag={() => {}}
      />

      {page && (
        <SentenceCard
          cover={page.image || story.cover}    // ページ専用画像があれば優先
          html={page.jp}                        // ルビ入りHTML
          showFurigana={showFuri}
          tr={trText}                           // 選択言語の翻訳
          // クリック可能語：ページ固有 + 共通辞書（キー集合として利用）
          dict={{ ...(globalDict || {}), ...(page.dict || {}) }}
          onWord={(w) => setPopupWord(w)}
          lang={i18n.language}
        />
      )}

      <BottomActionBar
        onSettings={() => {}}
        onTranslate={() => setShowTrans((v) => !v)}
        onPlay={onPlay}
        onSlow={() => {}}
        slowActive={false}
        onPrev={prev}
        onNext={next}
        onCheck={() => {}}
      />

      {/* 単語ポップアップ（選択言語だけ表示される版） */}
      <WordPopup
        open={!!popupWord}
        word={popupWord}
        entry={popupEntry}
        lang={i18n.language}
        onClose={() => setPopupWord(null)}
      />

      <audio ref={audioRef} preload="none" />
    </div>
  );
}
