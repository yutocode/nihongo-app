// src/pages/ExamPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EXAM_REGISTRY } from "@/data/exam";

// ---- 小ユーティリティ ----
const pad2 = (n) => String(n).padStart(2, "0");
const ssKey = (examId) => `exam:${examId}:endsAt`;
const ansKey = (examId) => `exam:${examId}:answers`;

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const pack = EXAM_REGISTRY[examId];

  const [idx, setIdx] = useState(0);                  // 現在の問題index
  const [answers, setAnswers] = useState({});         // { "<examId>:<QID>": choiceIndex }
  const [endsAt, setEndsAt] = useState(null);         // ミリ秒（締切時刻）
  const [now, setNow] = useState(Date.now());
  const [submitted, setSubmitted] = useState(false);

  // セーフガード
  if (!pack) {
    return <div style={{ padding: 24 }}>試験データが見つかりません。</div>;
  }
  const items = pack.items || [];
  const item = items[idx];

  // タイマー設定（リロードに強く）
  useEffect(() => {
    const saved = sessionStorage.getItem(ssKey(examId));
    const end = saved ? Number(saved) : Date.now() + (pack.meta.durationSec || 0) * 1000;
    setEndsAt(end);
    sessionStorage.setItem(ssKey(examId), String(end));
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [examId]);

  // 回答の永続化（任意：リロードで保持）
  useEffect(() => {
    const saved = sessionStorage.getItem(ansKey(examId));
    if (saved) {
      try { setAnswers(JSON.parse(saved) || {}); } catch {}
    }
  }, [examId]);

  useEffect(() => {
    sessionStorage.setItem(ansKey(examId), JSON.stringify(answers));
  }, [examId, answers]);

  // 時間切れで自動提出
  const remainSec = endsAt ? Math.max(0, Math.floor((endsAt - now) / 1000)) : 0;
  useEffect(() => {
    if (endsAt && now >= endsAt && !submitted) handleSubmit();
  }, [now, endsAt, submitted]);

  function pick(choiceIndex) {
    const gkey = `${pack.meta.id}:${item.id}`;
    setAnswers((a) => ({ ...a, [gkey]: choiceIndex }));
  }

  function next() {
    if (idx < items.length - 1) setIdx(idx + 1);
  }
  function prev() {
    if (idx > 0) setIdx(idx - 1);
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  // スコア計算（分野は sectionOf(no) or q.section を使用）
  const result = useMemo(() => {
    if (!submitted) return null;

    // 分野名の候補（meta.sectionsLabelがあればそれを基準に）
    const sectionKeys =
      (pack.meta.sectionsLabel && Object.keys(pack.meta.sectionsLabel)) ||
      ["vocab", "grammar", "reading", "listening"];

    const by = {};
    for (const k of sectionKeys) by[k] = { ok: 0, t: 0 };

    let ok = 0;
    for (const q of items) {
      const gkey = `${pack.meta.id}:${q.id}`;
      const picked = answers[gkey];
      const correct = picked === q.answer;
      ok += correct ? 1 : 0;

      let sec =
        (typeof pack.sectionOf === "function" ? pack.sectionOf(q.no) : null) ||
        q.section ||
        // 互換：旧no帯での推定
        (q.no <= 8 ? "vocab" : q.no <= 20 ? "grammar" : q.no <= 30 ? "reading" : "listening");

      if (!by[sec]) by[sec] = { ok: 0, t: 0 }; // 予備：未知キーにも対応
      by[sec].t++;
      if (correct) by[sec].ok++;
    }

    const overall = ok / items.length;

    // 合否条件
    const passCfg = pack.meta.pass || {};
    let pass = true;
    if (typeof passCfg.overall === "number") {
      pass = pass && overall >= passCfg.overall;
    }
    if (typeof passCfg.readingMin === "number" && by.reading?.t) {
      pass = pass && by.reading.ok / by.reading.t >= passCfg.readingMin;
    }
    if (typeof passCfg.listeningMin === "number" && by.listening?.t) {
      pass = pass && by.listening.ok / by.listening.t >= passCfg.listeningMin;
    }

    return { ok, total: items.length, by, overall, pass };
  }, [submitted, answers, items, pack]);

  // 表示用：stem（HTML/ruby対応）
  const stemHTML =
    item?.stem
      ? item.stem.includes("<ruby>")
        ? item.stem.replace(/\n/g, "<br/>")
        : item.stem.replace(/\n/g, "<br/>")
      : "";

  const gkey = item ? `${pack.meta.id}:${item.id}` : "";
  const pickedIndex = answers[gkey];

  return (
    <div className="exam-page" style={{ maxWidth: 840, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{pack.meta.title}</div>
          <div style={{ opacity: 0.7 }}>問題 {idx + 1} / {items.length}</div>
        </div>
        <div
          className="timer"
          style={{
            fontVariantNumeric: "tabular-nums",
            fontWeight: 700,
            color: remainSec <= 300 ? "#d33" : "#111",
          }}
        >
          残り {Math.floor(remainSec / 60)}:{pad2(remainSec % 60)}
        </div>
      </header>

      {!submitted ? (
        <>
          <div className="question" style={{ marginTop: 18, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>問題{item?.no}</div>

            {/* 聴解の音声（任意表示） */}
            {item?.section === "listening" && item.audio && (
              <div style={{ marginBottom: 12 }}>
                <audio src={item.audio} controls preload="none" />
              </div>
            )}

            {/* ふりがな等のHTMLを安全に表示（教材由来のHTMLのみ想定） */}
            <div
              style={{ whiteSpace: "normal", lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: stemHTML }}
            />
          </div>

          <div>
            {item?.choices.map((c, i) => (
              <label
                key={i}
                style={{
                  display: "block",
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  marginBottom: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name={item.id}
                  checked={pickedIndex === i}
                  onChange={() => pick(i)}
                  style={{ marginRight: 8 }}
                />
                {i + 1}. {c}
              </label>
            ))}
          </div>

          <footer style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button onClick={() => navigate(-1)} className="ghost">やめる</button>
            <div style={{ flex: 1 }} />
            {idx > 0 && <button onClick={prev}>前へ</button>}
            {idx < items.length - 1 ? (
              <button onClick={next} disabled={pickedIndex == null}>次へ</button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== items.length}
              >
                提出
              </button>
            )}
          </footer>
        </>
      ) : (
        <Result result={result} pack={pack} answers={answers} />
      )}
    </div>
  );
}

function Result({ result, pack, answers }) {
  if (!result) return null;
  const pct = Math.round(result.overall * 100);
  const labels = pack.meta.sectionsLabel || {
    vocab: "文字・語彙",
    grammar: "文法",
    reading: "読解",
    listening: "聴解",
  };

  // 分野の表示順（存在するものだけ）
  const sectionOrder = ["vocab", "grammar", "reading", "listening"].filter(
    (k) => result.by[k]?.t > 0
  );

  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 8 }}>結果</h2>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
        {pct} 点（{result.ok}/{result.total}） {result.pass ? "合格" : "不合格"}
      </div>

      <ul style={{ lineHeight: 1.8, marginBottom: 8 }}>
        {sectionOrder.map((k) => (
          <li key={k}>
            {labels[k]}：{result.by[k].ok}/{result.by[k].t}
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 20 }}>見直し</h3>
      {pack.items.map((q) => {
        const gkey = `${pack.meta.id}:${q.id}`;
        const picked = answers[gkey];
        const ok = picked === q.answer;
        const stemHTML = (q.stem || "").replace(/\n/g, "<br/>");
        return (
          <details
            key={`${pack.meta.id}:${q.id}`}
            style={{ border: "1px solid #eee", borderRadius: 8, padding: 10, marginBottom: 8 }}
          >
            <summary style={{ cursor: "pointer" }}>
              問題{q.no}：{ok ? "○" : "×"}（あなた：
              {picked != null ? q.choices[picked] : "未回答"}／正解：{q.choices[q.answer]}）
              {q.section ? `　[${(pack.meta.sectionsLabel || {})[q.section] || q.section}]` : null}
            </summary>
            <div
              style={{ marginTop: 8, whiteSpace: "normal", lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: stemHTML }}
            />
            <ol style={{ marginTop: 8 }}>
              {q.choices.map((c, i) => (
                <li key={i}>{i + 1}. {c}</li>
              ))}
            </ol>
          </details>
        );
      })}
    </div>
  );
}
