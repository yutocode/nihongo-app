// src/components/DetailModal.jsx
import React, { useMemo } from "react";
import "../styles/DetailModal.css";
import { useTranslation } from "react-i18next";

/* ========== 語彙セットから id を自動補完するための索引 ========== */
import { n5WordSets } from "../data/n5WordSets";
const flatten = (obj) => (obj ? Object.values(obj).flat() : []);
const ALL_VERBS = [
  ...flatten(n5WordSets?.n5part_verbs1),
  ...flatten(n5WordSets?.n5part_verbs2),
  ...flatten(n5WordSets?.n5part_verbs3),
].filter(Boolean);

const BY_ID = new Map(ALL_VERBS.map(w => [String(w.id), w]));
const BY_KANJI = new Map(ALL_VERBS.filter(w => w?.kanji).map(w => [w.kanji, w]));
const BY_READING = new Map(ALL_VERBS.filter(w => w?.reading).map(w => [w.reading, w]));

/* ========== 例文（クイズの question_ja を利用） ========== */
import { n5part_verbs1 as quizPart1 } from "../data/wordquiz/n5/n5part_verbs1.js";
// 追加があれば結合：
// import { n5part_verbs2 as quizPart2 } from "../data/wordquiz/n5/n5part_verbs2.js";
// import { n5part_verbs3 as quizPart3 } from "../data/wordquiz/n5/n5part_verbs3.js";
const QUIZZES = [...(Array.isArray(quizPart1) ? quizPart1 : [])];

const SENTENCE_MAP = (() => {
  const m = new Map();
  for (const q of QUIZZES) {
    if (!q?.id || !q?.question_ja) continue;
    const k = String(q.id);
    const arr = m.get(k) || [];
    arr.push(q.question_ja);
    m.set(k, arr);
  }
  return m;
})();

/* ========== 活用データ ========== */
import { lesson1 as formsL1 } from "../data/grammar/n5/verb-forms/lesson1.js";
// 他レッスンがあれば結合：
// import { lesson2 as formsL2 } from "../data/grammar/n5/verb-forms/lesson2.js";
// const FORMS = [...(formsL1||[]), ...(formsL2||[])];
const FORMS = Array.isArray(formsL1) ? formsL1 : [];
const CONJ_MAP = new Map(FORMS.map(v => [String(v.id), v.conjugations || {}]));
const CONJ_ORDER = [
  "辞書形","ます形","ない形","た形","て形","たい形",
  "可能形","受け身形","使役形","使役受け身形",
  "意向形","命令形","条件形","たら形","連用形","進行形"
];

/* ========== 活用ヒント ========== */
import { HINTS_BY_TARGET } from "../data/grammar/hints/index.js";

/* ========== 言語ヘルパ ========== */
function useCurrentLangKey() {
  const { i18n } = useTranslation();
  const lower = String(i18n.language || "ja").toLowerCase();
  if (lower.includes("tw")) return "tw";
  if (lower.startsWith("zh")) return "zh";
  if (lower.startsWith("en")) return "en";
  if (lower.startsWith("id")) return "id";
  if (lower.startsWith("vi")) return "vi";
  if (lower.startsWith("th")) return "th";
  if (lower.startsWith("my")) return "my";
  if (lower.startsWith("ko")) return "ko";
  if (lower.startsWith("km")) return "km";
  return "ja";
}
function pickText(obj, preferred = "tw") {
  if (!obj) return null;
  if (typeof obj === "string") return obj;
  const norm = (v)=> Array.isArray(v) ? v.join("； ") : String(v);
  if (obj[preferred]) return norm(obj[preferred]);
  if (preferred !== "tw" && obj.tw) return norm(obj.tw);
  if (obj.ja) return norm(obj.ja);
  if (obj.en) return norm(obj.en);
  const any = Object.keys(obj)[0];
  return any ? norm(obj[any]) : null;
}

/* ========== 例文取得（id優先→kanji/reading フォールバック） ========== */
function getSentences({ id, kanji, reading }) {
  const key = id != null ? String(id) : null;
  if (key && SENTENCE_MAP.has(key)) return SENTENCE_MAP.get(key);
  const out = [];
  if (kanji) {
    const needle = `<u>${kanji}</u>`;
    for (const q of QUIZZES) {
      const s = q.question_ja || "";
      if (s.includes(needle) || s.includes(kanji)) out.push(s);
    }
  }
  if (!out.length && reading) {
    for (const q of QUIZZES) {
      const s = q.question_ja || "";
      if (s.includes(reading)) out.push(s);
    }
  }
  return out;
}

export default function DetailModal({ open, onClose, data }) {
  if (!open || !data) return null;

  /* ===== ここが重要：data の id を自動補完 ===== */
  const word = useMemo(() => {
    const idStr = data?.id != null ? String(data.id) : null;
    const byId = idStr ? BY_ID.get(idStr) : null;
    const byKanji = !byId && data?.kanji ? BY_KANJI.get(data.kanji) : null;
    const byReading = !byId && !byKanji && data?.reading ? BY_READING.get(data.reading) : null;
    const resolved = byId || byKanji || byReading || {};
    const finalId = data?.id ?? resolved?.id ?? null;
    return { ...resolved, ...data, id: finalId };
  }, [data]);

  const langKey = useCurrentLangKey(); // 固定なら: const langKey = "tw";

  const meaningText = useMemo(
    () => pickText(word.meanings, langKey),
    [word.meanings, langKey]
  );

  const sentences = useMemo(
    () => getSentences({ id: word.id, kanji: word.kanji, reading: word.reading }),
    [word.id, word.kanji, word.reading]
  );

  const conjugations = useMemo(
    () => (word?.id != null ? CONJ_MAP.get(String(word.id)) || null : null),
    [word?.id]
  );
  const conjEntries = useMemo(() => {
    if (!conjugations) return [];
    return CONJ_ORDER.map(k => [k, conjugations[k]]).filter(([, v]) => !!v);
  }, [conjugations]);

  const hintFor = useMemo(() => {
    const cache = new Map();
    return (targetName) => {
      if (!targetName) return null;
      if (cache.has(targetName)) return cache.get(targetName);
      const hintObj = HINTS_BY_TARGET?.[targetName];
      const text = pickText(hintObj, langKey);
      cache.set(targetName, text || null);
      return text || null;
    };
  }, [langKey]);

  // console.log("CONJ:", word?.id, "hit:", !!conjugations);

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>×</button>

        {/* 見出し */}
        <div className="detail-header">
          <div className="detail-kanji">{word.kanji || "—"}</div>
          <div className="detail-reading">{word.reading || ""}</div>
          {word.pos && <div className="detail-pos">{word.pos}</div>}
        </div>

        {/* 意味（TW優先） */}
        <div className="detail-meanings">
          <div className="detail-meaning">
            <b>{langKey.toUpperCase()}:</b> {meaningText || "—"}
          </div>
        </div>

        {/* 例文 */}
        {sentences.length > 0 && (
          <div className="detail-examples">
            <h3>例文</h3>
            {sentences.map((html, i) => (
              <div key={i} className="example-block">
                <p className="example-ja" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            ))}
          </div>
        )}

        {/* 活用（常に見出し。未登録時は案内） */}
        <div className="detail-conjugations">
          <h3>活用</h3>

          {conjEntries.length > 0 ? (
            <div className="conj-table">
              {conjEntries.map(([k, v]) => {
                const hint = hintFor(k);
                return (
                  <div className="conj-row" key={k}>
                    <div className="conj-key">{k}</div>
                    <div className="conj-val">
                      <div>{v}</div>
                      {hint && <div className="conj-hint">{hint}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="conj-empty">
              この単語（id: <code>{String(word.id ?? "—")}</code>）の活用データが見つかりません。<br/>
              <small>verb-forms の結合漏れ／id 不一致を確認してください。</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
