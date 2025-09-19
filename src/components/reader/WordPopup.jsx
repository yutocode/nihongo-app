import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuX, LuVolume2, LuBookmarkPlus } from "react-icons/lu";

/**
 * WordPopup (Bottom Sheet)
 *
 * Props:
 * - open: boolean
 * - word: {
 *     title: string,
 *     pos?: string[],        // ["Noun", "Verb"] など
 *     defs?: string[],       // 定義配列
 *     romaji?: string,       // ローマ字
 *     notes?: string,        // 任意の補足
 *     examples?: Array<{ jp: string, en?: string }>,
 *     audioUrl?: string      // 発音音声（任意）
 *   } | null
 * - onClose: () => void
 * - onSave?: (word) => void
 * - onSpeak?: (word) => void   // audioUrlが無い場合でもTTSなどに接続可
 *
 * 使い方（ReaderSessionPage側）:
 *   <WordPopup open={!!dict} word={dict} onClose={()=>setSheetKey(null)} />
 */
export default function WordPopup({ open, word, onClose, onSave, onSpeak }) {
  const portalNode = usePortalNode("word-popup-root");
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const offsetRef = useRef(0);
  const [dragY, setDragY] = useState(0);
  const draggingRef = useRef(false);

  const hasContent = Boolean(open && word);
  const title = word?.title ?? "";

  // フォーカス管理（開く時に最初のボタンへ）
  const firstBtnRef = useRef(null);
  useEffect(() => {
    if (hasContent) {
      const t = setTimeout(() => firstBtnRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [hasContent]);

  // Escで閉じる
  useEffect(() => {
    if (!hasContent) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasContent, onClose]);

  // スワイプ（下方向）で閉じる
  const handleStart = (clientY) => {
    draggingRef.current = true;
    startYRef.current = clientY;
    offsetRef.current = dragY;
  };
  const handleMove = (clientY) => {
    if (!draggingRef.current) return;
    const dy = Math.max(0, clientY - startYRef.current + offsetRef.current);
    setDragY(dy);
  };
  const handleEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const vh = window.innerHeight || 800;
    // 画面高の 18% 以上引いたら閉じる
    if (dragY > vh * 0.18) {
      setDragY(0);
      onClose?.();
    } else {
      // 元の位置に戻す
      setDragY(0);
    }
  };

  // 再生処理（あるならaudio、無ければonSpeak）
  const speak = () => {
    if (word?.audioUrl) {
      const a = new Audio(word.audioUrl);
      a.play().catch(() => {});
    } else {
      onSpeak?.(word);
    }
  };

  if (!portalNode) return null;
  return createPortal(
    <>
      {/* 背景のオーバーレイ */}
      <div
        aria-hidden={!hasContent}
        className={`wp-overlay ${hasContent ? "open" : ""}`}
        onClick={onClose}
      />
      {/* ボトムシート本体 */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title || "Word details"}
        className={`wp-sheet ${hasContent ? "open" : ""}`}
        ref={sheetRef}
        style={{
          transform: hasContent
            ? `translateY(${dragY}px)`
            : "translateY(100%)",
        }}
        onMouseDown={(e) => {
          // ヘッダーとグリップのみドラッグ開始
          if (e.target.closest(".wp-grip") || e.target.closest(".wp-header")) {
            handleStart(e.clientY);
          }
        }}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        <div className="wp-grip" aria-hidden>
          <span className="wp-grip-bar" />
        </div>

        <header className="wp-header">
          <h3 className="wp-title">{title}</h3>

          <div className="wp-actions">
            <button
              ref={firstBtnRef}
              className="wp-btn"
              onClick={speak}
              aria-label="Speak"
              title="Speak"
            >
              <LuVolume2 />
            </button>
            <button
              className="wp-btn"
              onClick={() => onSave?.(word)}
              aria-label="Save"
              title="Save"
            >
              <LuBookmarkPlus />
            </button>
            <button
              className="wp-btn close"
              onClick={onClose}
              aria-label="Close"
              title="Close"
            >
              <LuX />
            </button>
          </div>
        </header>

        <div className="wp-body">
          {/* 品詞タグ */}
          {word?.pos?.length ? (
            <div className="wp-posrow">
              {word.pos.map((p, i) => (
                <span key={i} className="wp-pos">
                  {p}
                </span>
              ))}
            </div>
          ) : null}

          {/* 定義 */}
          {word?.defs?.length ? (
            <>
              <h4 className="wp-sub">Definitions:</h4>
              <div className="wp-def">• {word.defs[0]}</div>
              {word.defs.slice(1).map((d, i) => (
                <div key={i} className="wp-def more">
                  • {d}
                </div>
              ))}
            </>
          ) : null}

          {/* ローマ字 */}
          {word?.romaji ? (
            <>
              <h4 className="wp-sub">Writing and pronunciation:</h4>
              <div className="wp-roma">
                <strong>Romaji:</strong> {word.romaji}
              </div>
            </>
          ) : null}

          {/* 例文 */}
          {word?.examples?.length ? (
            <>
              <h4 className="wp-sub">Examples:</h4>
              <div className="wp-exlist">
                {word.examples.map((ex, i) => (
                  <div key={i} className="wp-ex">
                    <div className="wp-ex-jp">{ex.jp}</div>
                    {ex.en ? <div className="wp-ex-en">{ex.en}</div> : null}
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {/* 任意メモ */}
          {word?.notes ? (
            <>
              <h4 className="wp-sub">Notes:</h4>
              <div className="wp-notes">{word.notes}</div>
            </>
          ) : null}
        </div>
      </section>
    </>,
    portalNode
  );
}

/* -------- utils: portal node -------- */
function usePortalNode(id) {
  return useMemo(() => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
    return el;
  }, [id]);
}
