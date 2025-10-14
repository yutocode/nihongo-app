// src/components/SentenceCard.jsx
import React, { useMemo } from "react";
import "@/styles/SentenceCard.css";

/**
 * props
 * - cover: string               … 画像URL（ページごとでもOK）
 * - html: string                … ルビ入りHTML（例: 今日は<ruby>学校<rt>がっこう</rt></ruby>…）
 * - showFurigana: boolean       … ふりがな表示ON/OFF
 * - tr: string|null             … 翻訳（非表示なら null）
 * - dict: Record<string, any>   … { "学校": {...}, "初日": {...} }（ページごと）
 * - onWord: (base: string) => void … 単語タップ時に呼ぶ
 */
export default function SentenceCard({
  cover,
  html,
  showFurigana,
  tr,
  dict = {},
  onWord,
}) {
  const contentNodes = useMemo(() => {
    if (!html) return null;

    // --- 安全対策：DOMParserが無い（SSRなど）場合は素描画 ---
    if (typeof window === "undefined" || typeof DOMParser === "undefined") {
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // 1) HTML を DOM に
    const doc = new DOMParser().parseFromString(html, "text/html");
    const container = doc.body;

    // 2) 通常テキスト中の辞書語をクリック化
    const dictKeys = Object.keys(dict || {});
    dictKeys.sort((a, b) => b.length - a.length); // 長い語を優先
    const dictRegex =
      dictKeys.length > 0
        ? new RegExp(`(${dictKeys.map(escapeReg).join("|")})`, "g")
        : null;

    function escapeReg(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function wrapDictWordsInTextNode(node) {
      if (!dictRegex) return node.textContent;
      const parts = node.textContent.split(dictRegex);

      // 文字列＋React要素の配列を返し、親側でそのまま描画
      return parts.map((part, i) => {
        if (!part) return null;
        if (dict[part]) {
          return (
            <span
              key={`dw-${i}-${part}`}
              className="sc-word"
              onClick={() => onWord && onWord(part)}
            >
              {part}
            </span>
          );
        }
        return <React.Fragment key={`tx-${i}`}>{part}</React.Fragment>;
      });
    }

    // 3) 再帰的に DOM → React に変換
    const toReact = (node, key = "k") => {
      // Text
      if (node.nodeType === Node.TEXT_NODE) {
        return wrapDictWordsInTextNode(node);
      }

      // Element 以外は無視
      if (node.nodeType !== Node.ELEMENT_NODE) return null;

      const tag = node.tagName.toLowerCase();

      // <ruby>基<rt>ふり</rt></ruby> をクリック可能化
      if (tag === "ruby") {
        // childNodes[0] がベース想定（<rt>は別ノード）
        const base = node.childNodes[0]?.textContent ?? "";
        // <rt>のテキスト
        const rtNode = Array.from(node.childNodes).find(
          (n) => n.tagName && n.tagName.toLowerCase() === "rt"
        );
        const rtText = rtNode?.textContent ?? "";

        return (
          <span
            key={key}
            className="sc-word"
            onClick={() => base && onWord && onWord(base)}
          >
            <ruby>
              {base}
              {showFurigana && rtText ? <rt>{rtText}</rt> : null}
            </ruby>
          </span>
        );
      }

      // その他の要素（p, span, br 等）
      const children = Array.from(node.childNodes).map((n, i) =>
        toReact(n, `${key}-${i}`)
      );

      switch (tag) {
        case "br":
          return <br key={key} />;
        case "p":
          return (
            <p key={key} style={{ margin: 0 }}>
              {children}
            </p>
          );
        case "span":
          return (
            <span key={key} className={node.className || undefined}>
              {children}
            </span>
          );
        default:
          return <React.Fragment key={key}>{children}</React.Fragment>;
      }
    };

    return Array.from(container.childNodes).map((n, i) =>
      toReact(n, `n${i}`)
    );
  }, [html, showFurigana, dict, onWord]);

  return (
    <div className="sc-card">
      {cover && (
        <div className="sc-image">
          <img src={cover} alt="" loading="lazy" />
        </div>
      )}

      <div className="sc-text">{contentNodes}</div>

      {tr ? <div className="sc-tr">{tr}</div> : null}
    </div>
  );
}
