// src/components/WordCard.jsx
import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

import { useAppStore } from "../store/useAppStore";
import { useMyWordsStore } from "../store/useMyWordsStore";
import { getPosById } from "../utils/posById";
import { loadDetail } from "@/data/wordDetails/loader";
import DetailModal from "@/components/DetailModal.jsx";
import { FiVolume2 } from "react-icons/fi";
import "../styles/WordCard.css";
import WordProgressBar from "./WordProgressBar.jsx";

// 複合キー
const buildKey = (w) => {
  const lvl = w?.level ?? "n?";
  const id = w?.id ?? `${w?.lesson ?? "Lesson?"}:${w?.idx ?? w?.kanji ?? ""}`;
  return `${lvl}:${id}`;
};

export default function WordCard({
  wordList = [],
  level = "n5",
  lesson = "Lesson1",
  quizLessonKey, // ★ 追加：クイズ用の本当のキー
  category = "nouns",
  audioBase = "/audio",
  onIndexChange,
  onAdd,
  onDetail,
  mode = "learn", // "learn" | "my"
  onRemove,
}) {
  const isMy = mode === "my";

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // === 状態 ===
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null); // "left" | "right" | null

  const audioRef = useRef(null);

  // 詳細モーダル
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const addXP = useAppStore((s) => s.addXP);
  const awardedRef = useRef(new Set());

  const addToMyBook = useMyWordsStore((s) => s.add);
  const removeWord = useMyWordsStore((s) => s.removeWord);

  // === 表示言語 ===
  const currentLang = useMemo(() => {
    const lower = String(i18n.language || "ja").toLowerCase();
    if (lower.startsWith("tw")) return "tw";
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("en")) return "en";
    if (lower.startsWith("id")) return "id";
    if (lower.startsWith("vi")) return "vi";
    if (lower.startsWith("th")) return "th";
    if (lower.startsWith("my")) return "my";
    if (lower.startsWith("ko")) return "ko";
    if (lower.startsWith("km")) return "km";
    return "ja";
  }, [i18n.language]);

  // === 文言 ===
  const L = useMemo(
    () => ({
      show: t("wordcard.showMeaning", "クリックして意味を表示"),
      meaning: t("wordcard.meaning", "意味"),
      detail: t("wordcard.detail", "詳しく"),
      add: t("wordcard.add", "追加"),
      added: t("wordcard.added", "追加済み"),
      remove: t("mywb.remove", "削除"),
      notFound: t("wordcard.notFound", "❌ 翻訳が見つかりません"),
      loading: t("common.loading", "読み込み中…"),
      challenge: t("wordcard.challenge", "Challenge"),
    }),
    [t]
  );

  // === 単語リストなし ===
  if (!Array.isArray(wordList) || wordList.length === 0) {
    return (
      <div className="word-card">
        <p>{t("common.noWordsFound", "単語が見つかりません")}</p>
      </div>
    );
  }

  // === 現在の単語 ===
  const word = wordList[index] ?? {};
  const currentMeaning = word?.meanings?.[currentLang] || L.notFound;

  const enriched = useMemo(
    () => ({ ...word, level, lesson, idx: index }),
    [word, level, lesson, index]
  );

  // MyWordBookにあるか
  const isAdded = useMyWordsStore(
    useCallback(
      (s) => s.items.some((w) => buildKey(w) === buildKey(enriched)),
      [enriched]
    )
  );

  // === 音声候補 ===
  const audioCandidates = useMemo(() => {
    const join = (...p) =>
      p
        .filter(Boolean)
        .map((x) => (typeof x === "string" ? x.replace(/^\/+|\/+$/g, "") : x))
        .join("/");
    const enc = (s) => encodeURIComponent(s || "");
    const r = word?.reading || "";
    const arr = [];
    if (word?.audio) arr.push(`/${join(audioBase, level, lesson, word.audio)}`);
    if (r) {
      arr.push(`/${join(audioBase, level, lesson, `${index + 1}_${enc(r)}.mp3`)}`);
      arr.push(`/${join(audioBase, level, lesson, `${enc(r)}.mp3`)}`);
    }
    return arr;
  }, [word, index, level, lesson, audioBase]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {
        // ignore
      }
      audioRef.current.src = "";
    }
    setIsPlaying(false);
  }, []);

  // === 送り・戻し（共通） ===
  const goto = useCallback(
    (next) => {
      stopAudio();
      setShowMeaning(false);
      setIndex(next);
      onIndexChange?.(next);
    },
    [onIndexChange, stopAudio]
  );

  const handleNext = useCallback(() => {
    if (!awardedRef.current.has(index)) {
      awardedRef.current.add(index);
      addXP(1);
    }
    if (index < wordList.length - 1) goto(index + 1);
  }, [index, wordList.length, goto, addXP]);

  const handlePrev = useCallback(() => {
    if (index > 0) goto(index - 1);
  }, [index, goto]);

  // === スワイプ設定 ===
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < wordList.length - 1) {
        setSwipeDir("left");
        // アニメーション後に実際にページ送り
        setTimeout(() => {
          handleNext();
          setSwipeDir(null);
        }, 220);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        setSwipeDir("right");
        setTimeout(() => {
          handlePrev();
          setSwipeDir(null);
        }, 220);
      }
    },
    trackMouse: true, // PCブラウザでもマウスドラッグでテスト可能
    preventScrollOnSwipe: true,
  });

  // === 再生 ===
  const playAudio = useCallback(async () => {
    if (!audioCandidates.length) return;
    stopAudio();
    const a = audioRef.current || new Audio();
    audioRef.current = a;

    for (const src of audioCandidates) {
      try {
        a.src = src;
        await a.play();
        setIsPlaying(true);
        a.onended = () => setIsPlaying(false);
        return;
      } catch {
        // 次の候補へ
      }
    }
    setIsPlaying(false);
  }, [audioCandidates, stopAudio]);

  useEffect(() => {
    return () => {
      stopAudio();
      audioRef.current = null;
    };
  }, [stopAudio]);

  // === 意味表示 ===
  const onToggleMeaning = () => {
    if (!showMeaning && !awardedRef.current.has(index)) {
      awardedRef.current.add(index);
      addXP(1);
    }
    setShowMeaning(true);
  };

  // === 品詞とID表示 ===
  const pos = getPosById(level, word?.id, word?.pos || "—"); // 例: "名詞"
  const idLabel = word?.id ? `No.${word.id}` : `No.${index + 1}`;

  const posClass = (p) => {
    if ((p || "").includes("名詞")) return "noun";
    if ((p || "").includes("動詞")) return "verb";
    if ((p || "").includes("い形容詞") || (p || "").includes("な形容詞"))
      return "adj";
    if ((p || "").includes("副詞")) return "adv";
    if ((p || "").includes("助詞")) return "particle";
    if ((p || "").includes("助数詞")) return "counter";
    return "default";
  };

  // === 右側ボタン（追加/削除） ===
  const handleRight = () => {
    if (isMy) {
      onRemove?.(enriched);
      removeWord(enriched);
    } else {
      onAdd?.(enriched);
      isAdded ? removeWord(enriched) : addToMyBook(enriched);
    }
  };

  // === 詳細モーダル ===
  const openDetail = useCallback(async () => {
    if (!word) return;
    setDetailLoading(true);
    try {
      const base = {
        id: word?.id,
        kanji: word?.kanji ?? "",
        reading: word?.reading ?? "",
        pos: word?.pos || pos || "—",
        meanings: word?.meanings || {},
        level,
        lesson,
      };
      let extra = null;
      try {
        extra = await loadDetail(level, category, lesson, word?.id);
      } catch {
        // optional
      }
      const payload = { ...base, ...(extra || {}) };
      setDetailData(payload);
      onDetail?.({ ...payload, idx: index });
    } finally {
      setDetailLoading(false);
      setDetailOpen(true);
    }
  }, [word, pos, level, lesson, category, index, onDetail]);

  const closeDetail = () => setDetailOpen(false);

  // === 同じレッスンのクイズへジャンプ ===
  const quizKey = quizLessonKey || lesson; // 表示名と別に、クイズ用キーを優先

  const handleChallengeClick = useCallback(() => {
    if (!level || !quizKey) return;
    const encoded = encodeURIComponent(quizKey);
    navigate(`/word-quiz/${level}/${encoded}`);
  }, [navigate, level, quizKey]);

  const showChallenge = Boolean(level && quizKey);

  // === 出力 ===
  const swipeClass =
    swipeDir === "left"
      ? " word-card--swipe-left"
      : swipeDir === "right"
      ? " word-card--swipe-right"
      : "";

  return (
    <div
      className={`word-card${swipeClass}`}
      role="group"
      aria-label="Word card"
      {...swipeHandlers}
    >
      {/* 進捗バー + チャレンジボタン */}
      <div className="wc-progress-row">
        <WordProgressBar currentIndex={index} total={wordList.length || 0} />
        {showChallenge && (
          <button
            type="button"
            className="wc-challenge-btn"
            onClick={handleChallengeClick}
          >
            {L.challenge}
          </button>
        )}
      </div>

      {/* ヘッダー：左「詳しく」 / 中央「名詞 No.x」 / 右「追加」 */}
      <div className="wc-head">
        <button
          type="button"
          className="wc-head-btn left"
          onClick={openDetail}
        >
          {detailLoading ? L.loading : L.detail}
        </button>

        <div className="wc-head-title" aria-label="品詞と番号">
          <span className={`pos-badge ${posClass(pos)}`}>{pos || "—"}</span>
          <span className="id-badge">{idLabel}</span>
        </div>

        <button
          type="button"
          className={`wc-head-btn right ${
            !isMy && isAdded ? "is-added" : ""
          }`}
          onClick={handleRight}
          aria-pressed={!isMy && isAdded}
        >
          {isMy ? L.remove : isAdded ? L.added : L.add}
        </button>
      </div>

      {/* 本文 */}
      <div className="kanji">{word?.kanji || "—"}</div>
      <div className="reading">{word?.reading || "—"}</div>

      <button
        type="button"
        className="meaning-box"
        onClick={onToggleMeaning}
        aria-expanded={showMeaning}
      >
        {showMeaning ? (
          <p>
            <b>{L.meaning}:</b> {currentMeaning}
          </p>
        ) : (
          <p>{L.show}</p>
        )}
      </button>

      {/* スピーカー */}
      <div className="audio-area">
        <button
          type="button"
          className="icon-btn audio-button"
          onClick={playAudio}
          disabled={isPlaying || !word?.reading}
          aria-busy={isPlaying}
          aria-label="音声を再生"
          title="音声を再生"
        >
          <FiVolume2 size={20} />
        </button>
      </div>

      {/* ←→ ナビボタンは削除：スワイプのみで移動 */}

      {/* 詳細モーダル */}
      <DetailModal open={detailOpen} onClose={closeDetail} data={detailData} />
    </div>
  );
}
