import React from "react";
import { FaVolumeUp } from "react-icons/fa";

/**
 * props:
 * - sentence: { id, jp(HTML可), tr: {...}, img }  // img は任意
 * - lang: i18n language
 * - showFuri: boolean
 * - showTrans: boolean
 * - onPlay?: () => void   // カード内の小さな再生ボタン用（任意）
 */
export default function SentenceCard({ sentence, lang, showFuri, showTrans, onPlay }) {
  if (!sentence) return null;

  // ふりがなON/OFF：ruby要素をそのまま表示/非表示
  // （安全側でdangerouslySetInnerHTMLを最小限に利用）
  const jp = showFuri
    ? sentence.jp
    : sentence.jp.replace(/<rt>.*?<\/rt>/g, ""); // rtだけ消す簡易版

  const t = sentence.tr?.[lang] || sentence.tr?.ja || "";

  return (
    <article className="reader-card" role="article" aria-label="reading card">
      {/* 画像がある場合はカード上部に */}
      {sentence.img ? (
        <div className="reader-card__media">
          <img src={sentence.img} alt="" />
        </div>
      ) : null}

      <div className="reader-card__body">
        <p
          className="reader-card__jp"
          dangerouslySetInnerHTML={{ __html: jp }}
        />
        {showTrans && t ? (
          <p className="reader-card__tr">{t}</p>
        ) : null}

        {/* カード右下の小さな再生ピル（任意） */}
        {onPlay ? (
          <button className="reader-card__play" onClick={onPlay} aria-label="play">
            <FaVolumeUp />
          </button>
        ) : null}
      </div>
    </article>
  );
}
