// src/components/SentenceCard.jsx
import React, { useMemo } from "react";
import "@/styles/SentenceCard.css";

/**
 * props
 * - cover: string  … 画像URL（ページごとでもOK）
 * - html:  string  … ルビ入りHTML（例: 今日は<ruby>学校<rt>がっこう</rt></ruby>の…）
 * - showFurigana: boolean
 * - tr: string|null … 翻訳（非表示なら null）
 * - dict: object … { "学校": {...}, "初日": {...} } など（ページごと）
 * - onWord: (base: string) => void  … 単語タップ時に呼ぶ
 */
export default function SentenceCard({ cover, html, showFurigana, tr, dict = {}, onWord }) {
  // ルビ（<ruby>…<rt>…</rt></ruby>）は必ずクリック可にする
  // 通常テキスト中も、辞書にある語だけクリック可にする
  const contentNodes = useMemo(() => {
    if (!html) return null;

    // 1) HTML を一旦 DOM 化
    const doc = new DOMParser().parseFromString(html, "text/html");
    const container = doc.body;

    // 2) テキストノード中の辞書語を <span data-word> でラップ
    const dictKeys = Object.keys(dict || {});
    dictKeys.sort((a, b) => b.length - a.length); // 長い語優先で置換
    const dictRegex = dictKeys.length
      ? new RegExp(`(${dictKeys.map(escapeReg).join("|")})`, "g")
      : null;

    function escapeReg(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function wrapDictWordsInTextNode(node) {
      if (!dictRegex) return [node.textContent];

      const parts = node.textContent.split(dictRegex);
      return parts.map((part, i) => {
        if (!part) return null;
        if (dict[part]) {
          return (
            <span key={i + "-" + part}
              className="sc-word"
              onClick={() => onWord && onWord(part)}
            >
              {part}
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      });
    }

    // 3) 再帰的に DOM → React へ
    function toReact(node, keyPrefix = "k") {
      if (node.nodeType === 3) {
        // Text
        return wrapDictWordsInTextNode(node);
      }
      if (node.nodeType !== 1) return null;

      const tag = node.tagName.toLowerCase();

      if (tag === "ruby") {
        // <ruby>基<rt>ふり</rt></ruby>
        const base = node.childNodes[0]?.textContent ?? "";
        const rt = [...node.childNodes].find((n) => n.tagName?.toLowerCase() === "rt")?.textContent ?? "";
        return (
          <span
            key={keyPrefix}
            className="sc-word"
            onClick={() => onWord && onWord(base)}
          >
            <ruby>
              {base}
              {showFurigana && rt ? <rt>{rt}</rt> : null}
            </ruby>
          </span>
        );
      }

      // その他の要素（br など）
      const children = [...node.childNodes].map((n, i) =>
        toReact(n, keyPrefix + "-" + i)
      );
      const props = { key: keyPrefix };
      if (tag === "br") return <br key={keyPrefix} />;
      if (tag === "span") return <span {...props}>{children}</span>;
      if (tag === "p") return <p {...props}>{children}</p>;
      return <React.Fragment key={keyPrefix}>{children}</React.Fragment>;
    }

    const nodes = [...container.childNodes].map((n, i) => toReact(n, "n" + i));
    return nodes;
  }, [html, showFurigana, dict, onWord]);

  return (
    <div className="sc-card">
      {cover && (
        <div className="sc-image">
          {/* cover はページごとに渡せば差し替えOK */}
          <img src={cover} alt="" loading="lazy" />
        </div>
      )}

      <div className="sc-text">{contentNodes}</div>

      {tr ? <div className="sc-tr">{tr}</div> : null}
    </div>
  );
}
