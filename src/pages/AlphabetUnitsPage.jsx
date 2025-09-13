// src/pages/AlphabetUnitsPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import "../styles/AlphabetUnitsPage.css";

/** 表示用に null/空 を除外して「・」で連結 */
const joinRow = (arr = []) => arr.filter(Boolean).join("・");

/** 清音 + 濁音 + 半濁音（全部入り） */
const UNITS_STATIC = [
  // 清音
  { id: 1,  hira: ["あ","い","う","え","お"],             kata: ["ア","イ","ウ","エ","オ"] },
  { id: 2,  hira: ["か","き","く","け","こ"],             kata: ["カ","キ","ク","ケ","コ"] },
  { id: 3,  hira: ["さ","し","す","せ","そ"],             kata: ["サ","シ","ス","セ","ソ"] },
  { id: 4,  hira: ["た","ち","つ","て","と"],             kata: ["タ","チ","ツ","テ","ト"] },
  { id: 5,  hira: ["な","に","ぬ","ね","の"],             kata: ["ナ","ニ","ヌ","ネ","ノ"] },
  { id: 6,  hira: ["は","ひ","ふ","へ","ほ"],             kata: ["ハ","ヒ","フ","ヘ","ホ"] },
  { id: 7,  hira: ["ま","み","む","め","も"],             kata: ["マ","ミ","ム","メ","モ"] },
  { id: 8,  hira: ["や", null, "ゆ", null, "よ"],         kata: ["ヤ", null, "ユ", null, "ヨ"] },
  { id: 9,  hira: ["ら","り","る","れ","ろ"],             kata: ["ラ","リ","ル","レ","ロ"] },
  { id: 10, hira: ["わ","を","ん"],                       kata: ["ワ","ヲ","ン"] },

  // 濁音
  { id: 11, hira: ["が","ぎ","ぐ","げ","ご"],             kata: ["ガ","ギ","グ","ゲ","ゴ"] },
  { id: 12, hira: ["ざ","じ","ず","ぜ","ぞ"],             kata: ["ザ","ジ","ズ","ゼ","ゾ"] },
  { id: 13, hira: ["だ","ぢ","づ","で","ど"],             kata: ["ダ","ヂ","ヅ","デ","ド"] },
  { id: 14, hira: ["ば","び","ぶ","べ","ぼ"],             kata: ["バ","ビ","ブ","ベ","ボ"] },

  // 半濁音（◯）
  { id: 15, hira: ["ぱ","ぴ","ぷ","ぺ","ぽ"],             kata: ["パ","ピ","プ","ペ","ポ"] }
];

export default function AlphabetUnitsPage() {
  const [mode, setMode] = useState("hira"); // "hira" | "kata"
  const nav = useNavigate();

  const units = useMemo(
    () => UNITS_STATIC.map(u => ({ ...u, locked: false })), // 全解放
    []
  );

  const goUnit = (u) => nav(`/alphabet/unit/${u.id}?mode=${mode}`);

  const onKeyOpen = (e, u) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goUnit(u);
    }
  };

  return (
    <div className="alpha-page">
      {/* ヘッダー */}
      <header className="alpha-header">
        <h1>Alphabet</h1>
        <div className="segment" role="tablist" aria-label="Kana type">
          <button
            className={`seg-btn ${mode === "hira" ? "active" : ""}`}
            aria-pressed={mode === "hira"}
            role="tab"
            onClick={() => setMode("hira")}
          >
            Hira
          </button>
          <button
            className={`seg-btn ${mode === "kata" ? "active" : ""}`}
            aria-pressed={mode === "kata"}
            role="tab"
            onClick={() => setMode("kata")}
          >
            Kata
          </button>
        </div>
      </header>

      {/* ユニット一覧 */}
      <div className="unit-list">
        {units.map((u) => (
          <div
            key={u.id}
            className="unit-card"
            onClick={() => goUnit(u)}
            onKeyDown={(e) => onKeyOpen(e, u)}
            role="button"
            tabIndex={0}
            aria-label={`Unit ${u.id}: ${joinRow(mode === "hira" ? u.hira : u.kata)}`}
          >
            <div className="unit-left">
              <div className="unit-title">Unit {u.id}</div>
              <div className="row primary">
                {joinRow(mode === "hira" ? u.hira : u.kata)}
              </div>
              <div className="row secondary">
                {joinRow(mode === "hira" ? u.kata : u.hira)}
              </div>
            </div>

            <div className="unit-right">
              <div className="go-btn" aria-hidden="true">
                <FiChevronRight />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 下部CTA（任意） */}
      <div className="cta-wrap">
        <button className="cta-pill" onClick={() => nav("/alphabet")}>
          JAPANESE ALPHABET
        </button>
      </div>

      <div className="ad-slot" />
    </div>
  );
}
