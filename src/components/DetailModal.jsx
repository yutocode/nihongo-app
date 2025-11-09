// src/components/DetailModal.jsx
import React, { useMemo } from "react";
import "../styles/DetailModal.css";
import { useTranslation } from "react-i18next";

/* ========== レベル共通：WordSets を自動収集（n5/n4/n3/n2/n1） ========== */
// 例）../data/n5WordSets/index.js が export const n5WordSets = {...}
const setsModules =
  import.meta?.glob?.("../data/*WordSets/index.js", { eager: true }) || {};

// /n5WordSets/ → n5 などを抽出し、対応するエクスポートを拾う
const LEVEL_SETS = {};
for (const [path, mod] of Object.entries(setsModules)) {
  const m = path.match(/\/(n[1-5])WordSets\//i);
  const levelKey = m ? m[1].toLowerCase() : null;
  if (!levelKey) continue;
  const key = `${levelKey}WordSets`; // n5WordSets など
  const payload = mod?.[key] || mod?.default || null;
  if (payload) LEVEL_SETS[levelKey] = payload;
}

// lessons object { Lesson1:[...], Lesson2:[...] } → 配列
const flattenLessons = (partObj) => (partObj ? Object.values(partObj).flat() : []);

// 指定レベルの全語彙をまとめる（無ければ n5、n5 も無ければ空）
function gatherAllWordsByLevel(levelKey = "n5") {
  const set = LEVEL_SETS[levelKey] || LEVEL_SETS["n5"] || null;
  return set ? Object.values(set).flatMap(flattenLessons).filter(Boolean) : [];
}

/* ========== enriched.jsonl から on/kun/画数などを補完 ========== */
// プロジェクト直下: data/cache/enriched.jsonl
// Viteの ?raw でファイル文字列を読み込む
import enrichedRaw from "../../data/cache/enriched.jsonl?raw";

const ENRICHED_BY_ID = new Map();
const ENRICHED_BY_KANJI = new Map();
if (typeof enrichedRaw === "string" && enrichedRaw.length) {
  for (const line of enrichedRaw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    try {
      const o = JSON.parse(t);
      if (o?.id != null) ENRICHED_BY_ID.set(String(o.id), o);
      if (o?.kanji) ENRICHED_BY_KANJI.set(String(o.kanji), o);
    } catch {
      /* 無視（空行や途中の無効行） */
    }
  }
}

/* ========== N5クイズ由来の例文（id/kanji/reading） ========== */
// 相対パス + エイリアス(@) 双方のglobを使用
const quizModulesRel =
  import.meta?.glob?.("../data/wordquiz/n5/**/*.js", { eager: true }) || {};
const quizModulesAlias =
  import.meta?.glob?.("@/data/wordquiz/n5/**/*.js", { eager: true }) || {};

// named/default どちらでも配列を抽出
function pickAnyArray(obj) {
  if (!obj) return [];
  if (Array.isArray(obj?.default)) return obj.default;
  const arr = Object.values(obj).find((v) => Array.isArray(v));
  return Array.isArray(arr) ? arr : [];
}

// 最後の保険：存在するN5クイズ1本を直import（ファイル名は手元にあるものへ）
// 例：data/wordquiz/n5/n5part_nouns1.js が必ずある前提
import * as FallbackN5Nouns1 from "../data/wordquiz/n5/n5part_nouns1.js";

const QUIZZES = [
  ...Object.values(quizModulesRel).flatMap(pickAnyArray),
  ...Object.values(quizModulesAlias).flatMap(pickAnyArray),
  ...pickAnyArray(FallbackN5Nouns1),
].filter(Boolean);

// { id: → [question_ja,...] } の索引
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

/* ========== 任意ヒント（存在すれば使用） ========== */
const hintModules =
  import.meta?.glob?.("../data/grammar/hints/index.js", { eager: true }) || {};
const HINTS_BY_TARGET =
  Object.values(hintModules).find((m) => m?.HINTS_BY_TARGET)?.HINTS_BY_TARGET ||
  {};

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
  const norm = (v) => (Array.isArray(v) ? v.join("； ") : String(v));
  if (obj[preferred]) return norm(obj[preferred]);
  if (preferred !== "tw" && obj.tw) return norm(obj.tw);
  if (obj.ja) return norm(obj.ja);
  if (obj.en) return norm(obj.en);
  const any = Object.keys(obj)[0];
  return any ? norm(obj[any]) : null;
}

/* ========== 出現頻度★（1–5、簡易推定） ========== */
const clamp5 = (n) => Math.max(1, Math.min(5, Math.round(n)));
function getFrequencyStars(item) {
  if (!item) return 1;
  const k0 = item?.kanjiInfo?.[0] || {};
  const levelMap = { n5: 4.6, n4: 4.0, n3: 3.2, n2: 2.4, n1: 1.8 };
  const base = levelMap[String(item.level || "n5").toLowerCase()] ?? 3.0;
  const strokes = Number(k0.strokes || 0);
  let strokeBonus = 0;
  if (strokes > 0 && strokes <= 5) strokeBonus = 0.6;
  else if (strokes <= 8) strokeBonus = 0.3;
  const pos = String(item.posLabel || item.pos || "名詞");
  const posBonus = /名詞|形容|副詞/.test(pos) ? 0.2 : 0.0;
  return clamp5(base + strokeBonus + posBonus);
}

/* ========== 下線<u>…</u> を ruby に置換（kun > on） ========== */
function decorateQuizSentence(html, word) {
  const k0 = (word?.kanjiInfo && word.kanjiInfo[0]) || {};
  const kunFirst = (k0.kun && k0.kun[0]) || word?.reading || "";
  const onFirst = (k0.on && k0.on[0]) || "";
  const rt = kunFirst || onFirst || ""; // 既定は訓
  return html.replace(
    /<u>(.+?)<\/u>/g,
    (_m, tgt) => `<ruby>${tgt}<rt>${rt}</rt></ruby>`
  );
}

/* ========== 例文（id→kanji→reading の順で探索） ========== */
function getQuizSentences({ id, kanji, reading }) {
  const key = id != null ? String(id) : null;
  if (key && SENTENCE_MAP.has(key)) return SENTENCE_MAP.get(key);
  const out = [];
  if (kanji) {
    const needle = `<u>${kanji}</u>`;
    for (const q of QUIZZES) {
      const s = q?.question_ja || "";
      if (s.includes(needle) || s.includes(kanji)) out.push(s);
    }
  }
  if (!out.length && reading) {
    for (const q of QUIZZES) {
      const s = q?.question_ja || "";
      if (s.includes(reading)) out.push(s);
    }
  }
  return out;
}

/* ========== 本体 ========== */
/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {Object} props.data - { id?, kanji?, reading?, level? ... }
 * @param {string} [props.level="n5"] - レベルを直接指定したい場合（data.level より優先）
 */
export default function DetailModal({ open, onClose, data, level = "n5" }) {
  if (!open || !data) return null;

  // レベル確定（props > data.level > "n5"）
  const levelKey = String(level || data?.level || "n5").toLowerCase();

  // レベル別の語彙を集約し、索引を作成
  const ALL_WORDS = useMemo(() => gatherAllWordsByLevel(levelKey), [levelKey]);
  const BY_ID = useMemo(
    () => new Map(ALL_WORDS.map((w) => [String(w.id), w])),
    [ALL_WORDS]
  );
  const BY_KANJI = useMemo(
    () => new Map(ALL_WORDS.filter((w) => w?.kanji).map((w) => [w.kanji, w])),
    [ALL_WORDS]
  );
  const BY_READING = useMemo(
    () =>
      new Map(
        ALL_WORDS.filter((w) => w?.reading).map((w) => [w.reading, w])
      ),
    [ALL_WORDS]
  );

  // id → kanji → reading で補完 + enriched をマージ
  const word = useMemo(() => {
    const idStr = data?.id != null ? String(data.id) : null;
    const byId = idStr ? BY_ID.get(idStr) : null;
    const byKanji = !byId && data?.kanji ? BY_KANJI.get(data.kanji) : null;
    const byReading =
      !byId && !byKanji && data?.reading ? BY_READING.get(data.reading) : null;
    const resolved = byId || byKanji || byReading || {};
    const finalId = data?.id ?? resolved?.id ?? null;

    // enriched を id / 漢字で補完（data/辞書 が最優先）
    let enriched = null;
    if (finalId != null) enriched = ENRICHED_BY_ID.get(String(finalId)) || null;
    if (!enriched && (data?.kanji || resolved?.kanji)) {
      const keyKanji = String(data?.kanji || resolved?.kanji);
      enriched = ENRICHED_BY_KANJI.get(keyKanji) || null;
    }
    return { ...(enriched || {}), ...resolved, ...data, id: finalId, level: levelKey };
  }, [data, BY_ID, BY_KANJI, BY_READING, levelKey]);

  const langKey = useCurrentLangKey();
  const meaningText = useMemo(
    () => pickText(word.meanings, langKey),
    [word.meanings, langKey]
  );

  // on/kun/画数
  const k0 = useMemo(() => word?.kanjiInfo?.[0] || {}, [word]);
  const onList = useMemo(
    () => (Array.isArray(k0.on) ? k0.on : []).join("・"),
    [k0]
  );
  const kunList = useMemo(
    () => (Array.isArray(k0.kun) ? k0.kun : []).join("・"),
    [k0]
  );

  // あお, セイ の並置（kun優先）
  const inlineReading = useMemo(() => {
    const kunFirst = (k0.kun && k0.kun[0]) || word.reading || "";
    const onFirst = (k0.on && k0.on[0]) || "";
    return onFirst ? `${kunFirst}、${onFirst}` : `${kunFirst}`;
  }, [k0, word.reading]);

  // クイズ由来例文（ruby 付与）
  const sentences = useMemo(() => {
    const raw = getQuizSentences({
      id: word.id,
      kanji: word.kanji,
      reading: word.reading,
    });
    return raw.map((h) => decorateQuizSentence(h, word));
  }, [word.id, word.kanji, word.reading, word.kanjiInfo]);

  const freqStars = useMemo(() => getFrequencyStars(word), [word]);

  // 任意ヒント
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

  return (
    <div className="detail-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="閉じる">×</button>

        {/* 見出し */}
        <div className="detail-header">
          <div className="detail-kanji" lang="ja" aria-label="見出し語">
            {word.kanji || "—"}
          </div>
          <div className="detail-reading" lang="ja">
            {word.reading || ""}
          </div>
          {inlineReading && (
            <div className="detail-inline" lang="ja" aria-label="訓・音">
              {inlineReading}
            </div>
          )}
          {word.pos && <div className="detail-pos">{word.pos}</div>}
        </div>

        {/* メタ情報 */}
        <div className="detail-meta">
          <div>
            <div className="meta__label">意味</div>
            <div className="meta__value" lang={langKey}>{meaningText || "-"}</div>
          </div>
          <div>
            <div className="meta__label">on</div>
            <div className="meta__value" lang="ja">{onList || "-"}</div>
          </div>
          <div>
            <div className="meta__label">kun</div>
            <div className="meta__value" lang="ja">{kunList || word.reading || "-"}</div>
          </div>
          <div>
            <div className="meta__label">画数</div>
            <div className="meta__value">{k0.strokes ?? "-"}</div>
          </div>
          <div>
            <div className="meta__label">出現頻度</div>
            <div className="meta__value stars" aria-label={`出現頻度 ${freqStars}/5`}>
              {"★".repeat(freqStars)}
              {"☆".repeat(5 - freqStars)}
            </div>
          </div>
        </div>

        {/* 例文（クイズ由来／下線をruby化） */}
        <div className="detail-examples" aria-label="例文">
          <h3>例文</h3>
          {sentences.length > 0 ? (
            sentences.slice(0, 3).map((html, i) => (
              <div key={i} className="example-block">
                <p className="example-ja" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            ))
          ) : (
            <div className="example-block">
              <p className="example-ja">
                例文は準備中です。<code>data/wordquiz/n5/**</code> に
                <code>question_ja</code> を追加すると自動表示されます。
              </p>
            </div>
          )}
        </div>

        {/* 活用（必要時） */}
        {Array.isArray(word.conjugations) || word.conjugations ? (
          <div className="detail-conjugations">
            <h3>活用</h3>
            <div className="conj-empty">活用データがあります（描画はプロジェクト形式に合わせて差し込み）</div>
          </div>
        ) : null}

        {/* ヒント（任意） */}
        {hintFor("ます形") && (
          <div className="detail-hints">
            <h3>学習ヒント</h3>
            <p className="hint-line">{hintFor("ます形")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
