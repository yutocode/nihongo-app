import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";   // ★ 追加：XP加点用
import "../styles/WordCard.css";

const WordCard = ({
  wordList,
  level = "n5",
  lesson = "lesson1",
  audioBase = "/audio",
  onIndexChange,         // オプション: インデックス変更を親に通知
}) => {
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const { i18n } = useTranslation();

  // ★ XP: 1問ごとに +1
  const addXP = useAppStore((s) => s.addXP);
  // このセッション中に「XP付与済み」の単語（インデックスベース）を記録
  const awardedRef = useRef(new Set());

  const normalizeLang = (lang) => {
    if (!lang) return "ja";
    const lower = lang.toLowerCase();
    if (lower.startsWith("tw")) return "tw";
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("en")) return "en";
    if (lower.startsWith("id")) return "id";
    if (lower.startsWith("ja")) return "ja";
    return "ja";
  };
  const currentLang = normalizeLang(i18n.language || "ja");

  const labels = {
    id: { back: "← Kembali", next: "Lanjut →", show: "Klik untuk melihat arti", meaning: "Arti", notFound: "❌ Arti tidak ditemukan", speak: "🔊 Dengar kata" },
    en: { back: "← Back", next: "Next →", show: "Click to show meaning", meaning: "Meaning", notFound: "❌ Translation not found", speak: "🔊 Play sound" },
    zh: { back: "← 返回", next: "下一個 →", show: "点击显示意思", meaning: "意思", notFound: "❌ 未找到翻譯", speak: "🔊 播放語音" },
    tw: { back: "← 返回", next: "下一個 →", show: "點擊顯示意思", meaning: "意思", notFound: "❌ 找不到翻譯", speak: "🔊 播放語音" },
    ja: { back: "← 戻る", next: "次へ →", show: "クリックして意味を表示", meaning: "意味", notFound: "❌ 翻訳が見つかりません", speak: "🔊 音声を聞く" },
  };
  const label = labels[currentLang] || labels.ja;

  if (!Array.isArray(wordList) || wordList.length === 0) {
    return (
      <div className="word-card">
        <p>No words available.</p>
      </div>
    );
  }

  const word = wordList[index];
  const currentMeaning = word?.meanings?.[currentLang] || label.notFound;

  const safeJoin = (...parts) =>
    parts
      .filter(Boolean)
      .map((p) => (typeof p === "string" ? p.replace(/^\/+|\/+$/g, "") : p))
      .join("/");

  // 再生候補パス（word.audio -> index_reading.mp3 -> reading.mp3）
  const audioCandidates = useMemo(() => {
    const reading = word?.reading || "";
    const enc = (s) => encodeURIComponent(s);
    const list = [];

    // 明示指定があれば最優先
    if (word?.audio) {
      list.push(`/${safeJoin(audioBase, level, lesson, word.audio)}`);
    }

    if (reading) {
      list.push(`/${safeJoin(audioBase, level, lesson, `${index + 1}_${enc(reading)}.mp3`)}`);
      list.push(`/${safeJoin(audioBase, level, lesson, `${enc(reading)}.mp3`)}`);
    }

    return list;
  }, [word, index, level, lesson, audioBase]);

  const handleNext = useCallback(() => {
  // ★ XP加点：まだ加点していない単語だけ +1
  if (!awardedRef.current.has(index)) {
    awardedRef.current.add(index);
    addXP(1);
  }

  setShowMeaning(false);
  setIsPlaying(false);

  if (index < wordList.length - 1) {
    const next = index + 1;
    setIndex(next);
    onIndexChange?.(next);
  }
}, [index, wordList.length, onIndexChange, addXP]);


  const handlePrev = useCallback(() => {
    setShowMeaning(false);
    setIsPlaying(false);
    if (index > 0) {
      const prev = index - 1;
      setIndex(prev);
      onIndexChange?.(prev);
    }
  }, [index, onIndexChange]);

  // 再生ロジック（Audioを使い回し）
  const playAudio = useCallback(async () => {
    if (!audioCandidates.length) return;
    setIsPlaying(true);

    // 既存の音を止める
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    let lastErr = null;
    for (const src of audioCandidates) {
      try {
        // 存在チェック（同一オリジン前提/失敗してもスキップ）
        try { await fetch(src, { method: "HEAD" }); } catch (_) {}

        const audio = audioRef.current || new Audio();
        audioRef.current = audio;
        audio.src = src;

        // 連打対策
        audio.pause();
        audio.currentTime = 0;

        // 終了時の状態復帰
        audio.onended = () => setIsPlaying(false);

        await audio.play();
        // console.log("✅ played:", src);
        return;
      } catch (err) {
        // console.warn("❌ failed:", src, err);
        lastErr = err;
      }
    }

    // すべて失敗
    setIsPlaying(false);
    console.error("All audio candidates failed:", audioCandidates, lastErr);
  }, [audioCandidates]);

  // アンマウント時に音を停止
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  // キーボード操作: ←/→ で移動、Space/Enter で再生
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        playAudio();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev, playAudio]);

  // ★ 意味を初めて表示したら +1XP（1単語1回だけ）
  const onToggleMeaning = () => {
    if (!showMeaning) {
      // これから表示＝初回表示タイミング
      if (!awardedRef.current.has(index)) {
        awardedRef.current.add(index);
        addXP(1); // ← ここで+1XP
      }
    }
    setShowMeaning(true);
  };

  return (
    <div className="word-card" role="group" aria-label="Word card">
      <div className="kanji" aria-label="kanji">{word?.kanji || "—"}</div>
      <div className="reading" aria-label="reading">{word?.reading || "—"}</div>

      <button
        type="button"
        className="meaning-box"
        onClick={onToggleMeaning}
        aria-expanded={showMeaning}
        aria-label="toggle meaning"
      >
        {showMeaning ? (
          <p><b>{label.meaning}:</b> {currentMeaning}</p>
        ) : (
          <p>{label.show}</p>
        )}
      </button>

      <div className="audio-area">
        <button
          type="button"
          className="audio-button"
          onClick={playAudio}
          disabled={isPlaying || !word?.reading}
          aria-busy={isPlaying}
          aria-label="play audio"
        >
          {isPlaying ? "⏳ Loading..." : label.speak}
        </button>
      </div>

      <div className="navigation">
        <button type="button" onClick={handlePrev} disabled={index === 0} aria-label="previous">
          {label.back}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={index === wordList.length - 1}
          aria-label="next"
        >
          {label.next}
        </button>
      </div>
    </div>
  );
};

export default WordCard;
