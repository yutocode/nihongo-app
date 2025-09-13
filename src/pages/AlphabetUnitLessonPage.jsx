// src/pages/AlphabetUnitLessonPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiVolume2, FiRotateCcw, FiX } from "react-icons/fi";
import "../styles/AlphabetLesson.css"; // 既存スタイルを利用
// （なぞり学習を入れたい場合は、TracingCanvas をインポートしてカード中に入れてください）
import TracingCanvas from "../components/TracingCanvas";
import "../styles/TracingCanvas.css";

/** ひら⇄カタ */
const toKata = (h) =>
  h.replace(/[\u3041-\u3096]/g, (m) => String.fromCharCode(m.charCodeAt(0) + 0x60));
const toHira = (k) =>
  k.replace(/[\u30A1-\u30FA]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60));

/** ローマ字（必要なら拡張可） */
const ROMAJI = {
  "あ":"a","い":"i","う":"u","え":"e","お":"o",
  "か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
  "さ":"sa","し":"shi","す":"su","せ":"se","そ":"so",
  "た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to",
  "な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no",
  "は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho",
  "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",
  "や":"ya","ゆ":"yu","よ":"yo",
  "ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",
  "わ":"wa","を":"o","ん":"n",
  "が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",
  "ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",
  "だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do",
  "ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
  "ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po",
  "ア":"a","イ":"i","ウ":"u","エ":"e","オ":"o",
  "カ":"ka","キ":"ki","ク":"ku","ケ":"ke","コ":"ko",
  "サ":"sa","シ":"shi","ス":"su","セ":"se","ソ":"so",
  "タ":"ta","チ":"chi","ツ":"tsu","テ":"te","ト":"to",
  "ナ":"na","ニ":"ni","ヌ":"nu","ネ":"ne","ノ":"no",
  "ハ":"ha","ヒ":"hi","フ":"fu","ヘ":"he","ホ":"ho",
  "マ":"ma","ミ":"mi","ム":"mu","メ":"me","モ":"mo",
  "ヤ":"ya","ユ":"yu","ヨ":"yo",
  "ラ":"ra","リ":"ri","ル":"ru","レ":"re","ロ":"ro",
  "ワ":"wa","ヲ":"o","ン":"n",
  "ガ":"ga","ギ":"gi","グ":"gu","ゲ":"ge","ゴ":"go",
  "ザ":"za","ジ":"ji","ズ":"zu","ゼ":"ze","ゾ":"zo",
  "ダ":"da","ヂ":"ji","ヅ":"zu","デ":"de","ド":"do",
  "バ":"ba","ビ":"bi","ブ":"bu","ベ":"be","ボ":"bo",
  "パ":"pa","ピ":"pi","プ":"pu","ペ":"pe","ポ":"po"
};

/** すべてのユニット定義（清音〜濁音・半濁音） */
const ALL_UNITS = {
  1:  { hira:["あ","い","う","え","お"], kata:["ア","イ","ウ","エ","オ"] },
  2:  { hira:["か","き","く","け","こ"], kata:["カ","キ","ク","ケ","コ"] },
  3:  { hira:["さ","し","す","せ","そ"], kata:["サ","シ","ス","セ","ソ"] },
  4:  { hira:["た","ち","つ","て","と"], kata:["タ","チ","ツ","テ","ト"] },
  5:  { hira:["な","に","ぬ","ね","の"], kata:["ナ","ニ","ヌ","ネ","ノ"] },
  6:  { hira:["は","ひ","ふ","へ","ほ"], kata:["ハ","ヒ","フ","ヘ","ホ"] },
  7:  { hira:["ま","み","む","め","も"], kata:["マ","ミ","ム","メ","モ"] },
  8:  { hira:["や","ゆ","よ"],         kata:["ヤ","ユ","ヨ"] }, // 3文字
  9:  { hira:["ら","り","る","れ","ろ"], kata:["ラ","リ","ル","レ","ロ"] },
  10: { hira:["わ","を","ん"],          kata:["ワ","ヲ","ン"] }, // 3文字
  11: { hira:["が","ぎ","ぐ","げ","ご"], kata:["ガ","ギ","グ","ゲ","ゴ"] },
  12: { hira:["ざ","じ","ず","ぜ","ぞ"], kata:["ザ","ジ","ズ","ゼ","ゾ"] },
  13: { hira:["だ","ぢ","づ","で","ど"], kata:["ダ","ヂ","ヅ","デ","ド"] },
  14: { hira:["ば","び","ぶ","べ","ぼ"], kata:["バ","ビ","ブ","ベ","ボ"] },
  15: { hira:["ぱ","ぴ","ぷ","ぺ","ぽ"], kata:["パ","ピ","プ","ペ","ポ"] },
};

/** 音声（Web Speech API） */
const speak = (text, rate = 1) => {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = rate;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

export default function AlphabetUnitLessonPage() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const mode = sp.get("mode") === "kata" ? "kata" : "hira"; // デフォルトひら
  const nav = useNavigate();

  // ユニットの文字配列を取得（存在しなければ空）
  const chars = useMemo(() => {
    const unit = ALL_UNITS[Number(id)];
    if (!unit) return [];
    return (unit[mode] || []).filter(Boolean);
  }, [id, mode]);

  // 現在ページ（= 現在の文字インデックス）
  const [page, setPage] = useState(0);
  const total = chars.length;

  // ページが変わるたび、対象文字を1回読み上げ（“下のスピーカーで再生”も可能）
  useEffect(() => {
    if (chars[page]) speak(chars[page], 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ナビゲーション
  const toFirst = () => setPage(0); // 「戻る」＝最初（例：あ）に戻す
  const prev = () => setPage((p) => Math.max(p - 1, 0));
  const next = () => setPage((p) => Math.min(p + 1, total - 1));
  const progress = total ? ((page + 1) / total) : 0;

  if (!total) {
    return (
      <div className="lesson-shell">
        <div className="lesson-top">
          <button className="icon-btn" onClick={() => nav("/alphabet")} aria-label="close"><FiX /></button>
          <div className="progress"><span style={{ width: "0%" }} /></div>
          <div className="dot" />
        </div>
        <div className="lesson-empty">
          <p>このユニットには文字がありません。</p>
          <button className="btn" onClick={() => nav("/alphabet")}>一覧へ戻る</button>
        </div>
      </div>
    );
  }

  const ch = chars[page];
  const hira = mode === "hira" ? ch : toHira(ch);
  const kata = mode === "kata" ? ch : toKata(ch);
  const roma = ROMAJI[ch] || "";

  return (
    <div className="lesson-shell">
      {/* トップバー */}
      <div className="lesson-top">
        <button className="icon-btn" onClick={() => nav("/alphabet")} aria-label="close"><FiX /></button>
        <div className="progress"><span style={{ width: `${progress * 100}%` }} /></div>
        <div className="dot" />
      </div>

      {/* 本体（1ページ=1文字） */}
      <div className="lesson-body">
        <div className="card" style={{ gap: 8 }}>
          {/* 見出し：カタ/ひら/ローマ字 */}
          <div className="title">
            <span className="muted">
              {kata} / {hira} / {roma}
            </span>
          </div>

         {/* トレーサー */}
             <div style={{ display:"grid", placeItems:"center" }}>
             <TracingCanvas char={ch} width={340} height={340} />
          </div>

          {/* スピーカー（下部） */}
          <button
            className="pill"
            aria-label="play audio"
            onClick={() => speak(ch, 1)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <FiVolume2 /> 発音を聞く
          </button>

          {/* ナビ（前・次・最初へ戻る） */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn" onClick={prev} disabled={page === 0}>
              <FiChevronLeft /> 前へ
            </button>
            <button className="btn" onClick={next} disabled={page === total - 1}>
              次へ <FiChevronRight />
            </button>
            <button className="btn" onClick={toFirst} title="最初の文字に戻る">
              <FiRotateCcw /> 戻る
            </button>
          </div>

          <div className="hint" style={{ marginTop: 4 }}>
            {page + 1} / {total}
          </div>
        </div>
      </div>
    </div>
  );
}

