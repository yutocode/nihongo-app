// src/components/SentenceCard.jsx
import React, { useCallback } from "react";
import "@/styles/SentenceCard.css";

/**
 * props:
 * - cover?: string            画像URL（カード上部）
 * - html?: string             ルビ入りHTML（<ruby>…</ruby>）
 * - sentence?: string         ↑の代替（htmlが無いときに使用）
 * - tr?: string | null        翻訳テキスト（表示したいときだけ渡す）
 * - showFurigana?: boolean    ルビ表示ON/OFF（デフォルト true）
 * - onWordClick?: (word:string) => void  単語タップ時に呼ばれる（任意）
 */
export default function SentenceCard({
  cover,
  html,
  sentence,
  tr = null,
  showFurigana = true,
  onWordClick,
}) {
  const content = html ?? sentence ?? "";

  // 単語タップ対応：ruby をクリックしたらベース文字列を返す
  const handleClick = useCallback(
    (e) => {
      if (!onWordClick) return;
      // data-word 属性があればそれを優先（将来拡張用）
      const elWithData = e.target.closest("[data-word]");
      if (elWithData) {
        onWordClick(String(elWithData.getAttribute("data-word")));
        return;
      }
      // ruby要素を拾って、rt(ルビ)を除いたベース文字を返す
      const ruby = e.target.closest("ruby");
      if (ruby) {
        const clone = ruby.cloneNode(true);
        // 全rtを削除してベース文字だけ取り出す
        clone.querySelectorAll("rt").forEach((rt) => rt.remove());
        const base = clone.textContent?.trim();
        if (base) onWordClick(base);
      }
    },
    [onWordClick]
  );

  return (
    <div className="sc-card" onClick={handleClick}>
      {!!cover && <img src={cover} alt="" className="sc-img" />}
      <div
        className={`sc-jp ${showFurigana ? "show-ruby" : "hide-ruby"}`}
        // ルビ入りの文章をそのまま描画
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {tr ? <div className="tr">{tr}</div> : null}
    </div>
  );
}

