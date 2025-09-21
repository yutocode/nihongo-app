// src/components/SentenceCard.jsx
import React from "react";
import "@/styles/SentenceCard.css";

export default function SentenceCard({ cover, html, sentence, tr, showFurigana=true }) {
  const content = html ?? sentence ?? "";                   // ruby付きHTMLをそのまま描画
  const transText = typeof tr === "string"
    ? tr
    : tr && typeof tr === "object"
    ? (tr.tw || tr.ja || tr.en || "")
    : "";

  return (
    <div className="sc-card">
      {cover ? <img src={cover} alt="" className="sc-img" /> : null}
      <div
        className={`sc-jp ${showFurigana ? "show-ruby" : "hide-ruby"}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {transText ? <div className="tr">{transText}</div> : null}
    </div>
  );
}
