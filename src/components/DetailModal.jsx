// src/components/DetailModal.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "../styles/DetailModal.css";

/* =========================================
   1) JLPT 各レベルの WordSets をまとめる
   ========================================= */
const setsModules =
  import.meta?.glob?.("../data/*WordSets/index.js", { eager: true }) || {};

const LEVEL_SETS = {};
for (const [path, mod] of Object.entries(setsModules)) {
  const m = path.match(/\/(n[1-5])WordSets\//i);
  const levelKey = m ? m[1].toLowerCase() : null;
  if (!levelKey) continue;

  const exportKey = `${levelKey}WordSets`; // 例: n5WordSets
  const payload = mod?.[exportKey] || mod?.default || null;
  if (payload) LEVEL_SETS[levelKey] = payload;
}

const flattenLessons = (partObj) =>
  partObj ? Object.values(partObj).flat() : [];

function gatherAllWordsByLevel(levelKey = "n5") {
  const set = LEVEL_SETS[levelKey] || LEVEL_SETS["n5"] || null;
  if (!set) return [];
  return Object.values(set).flatMap(flattenLessons).filter(Boolean);
}

/* =========================================
   2) enriched.jsonl（on/kun/画数 など）読み込み
   ========================================= */
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
      // 無効行は無視
    }
  }
}

/* =========================================
   3) JLPT 各レベルのクイズデータ（n1〜n5）
   ========================================= */
// fallback: 各レベルの nouns1（必ず存在する前提）
import * as FallbackN1Nouns1 from "@/data/wordquiz/n1/n1part_nouns1.js";
import * as FallbackN2Nouns1 from "@/data/wordquiz/n2/n2part_nouns1.js";
import * as FallbackN3Nouns1 from "@/data/wordquiz/n3/n3part_nouns1.js";
import * as FallbackN4Nouns1 from "@/data/wordquiz/n4/n4part_nouns1.js";
import * as FallbackN5Nouns1 from "@/data/wordquiz/n5/n5part_nouns1.js";

function pickAnyArray(obj) {
  if (!obj) return [];
  if (Array.isArray(obj.default)) return obj.default;
  const arr = Object.values(obj).find((v) => Array.isArray(v));
  return Array.isArray(arr) ? arr : [];
}

const quizModulesByLevel = {
  n1:
    import.meta?.glob?.("@/data/wordquiz/n1/**/*.js", { eager: true }) || {},
  n2:
    import.meta?.glob?.("@/data/wordquiz/n2/**/*.js", { eager: true }) || {},
  n3:
    import.meta?.glob?.("@/data/wordquiz/n3/**/*.js", { eager: true }) || {},
  n4:
    import.meta?.glob?.("@/data/wordquiz/n4/**/*.js", { eager: true }) || {},
  n5:
    import.meta?.glob?.("@/data/wordquiz/n5/**/*.js", { eager: true }) || {},
};

const QUIZ_BY_LEVEL = { n1: [], n2: [], n3: [], n4: [], n5: [] };

for (const [lv, mods] of Object.entries(quizModulesByLevel)) {
  for (const mod of Object.values(mods)) {
    const arr = pickAnyArray(mod);
    if (arr.length) QUIZ_BY_LEVEL[lv].push(...arr);
  }
}

// fallback も各レベルに注入（念のため）
QUIZ_BY_LEVEL.n1.push(...pickAnyArray(FallbackN1Nouns1));
QUIZ_BY_LEVEL.n2.push(...pickAnyArray(FallbackN2Nouns1));
QUIZ_BY_LEVEL.n3.push(...pickAnyArray(FallbackN3Nouns1));
QUIZ_BY_LEVEL.n4.push(...pickAnyArray(FallbackN4Nouns1));
QUIZ_BY_LEVEL.n5.push(...pickAnyArray(FallbackN5Nouns1));

const ALL_QUIZZES = Object.values(QUIZ_BY_LEVEL).flat();

/* =========================================
   4) grammar hints
   ========================================= */
const hintModules =
  import.meta?.glob?.("../data/grammar/hints/index.js", { eager: true }) || {};

const HINTS_BY_TARGET =
  Object.values(hintModules).find((m) => m?.HINTS_BY_TARGET)?.HINTS_BY_TARGET ||
  {};

/* =========================================
   5) 言語・テキストヘルパ
   ========================================= */
function getLangKey(i18n) {
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

/* =========================================
   6) 出現頻度 ★★★★★（ざっくり推定）
   ========================================= */
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

/* =========================================
   7) <u>…</u> を <ruby>…</ruby> に変換
   ========================================= */
function decorateQuizSentence(html, word) {
  const k0 = (word?.kanjiInfo && word.kanjiInfo[0]) || {};
  const readingFirst = word?.reading || "";
  const kunFirst = (k0.kun && k0.kun[0]) || "";
  const onFirst = (k0.on && k0.on[0]) || "";
  const rt = readingFirst || kunFirst || onFirst || "";

  return html.replace(
    /<u>(.+?)<\/u>/g,
    (_m, tgt) => `<ruby>${tgt}<rt>${rt}</rt></ruby>`
  );
}

/* =========================================
   8) 例文取得
   ========================================= */
function searchSentencesInPool(pool, { id, kanji, reading }) {
  if (!pool || !pool.length) return [];
  const out = [];
  const key = id != null ? String(id) : null;

  if (key) {
    for (const q of pool) {
      if (String(q?.id) === key && q?.question_ja) out.push(q.question_ja);
    }
    if (out.length) return out;
  }

  if (kanji) {
    const needle = `<u>${kanji}</u>`;
    for (const q of pool) {
      const s = q?.question_ja || "";
      if (!s) continue;
      if (s.includes(needle) || s.includes(kanji)) out.push(s);
    }
    if (out.length) return out;
  }

  if (reading) {
    for (const q of pool) {
      const s = q?.question_ja || "";
      if (!s) continue;
      if (s.includes(reading)) out.push(s);
    }
  }

  return out;
}

function getQuizSentences(levelKey, { id, kanji, reading }) {
  const lv = (levelKey || "n5").toLowerCase();
  const primary = searchSentencesInPool(QUIZ_BY_LEVEL[lv], { id, kanji, reading });
  if (primary.length) return primary;
  return searchSentencesInPool(ALL_QUIZZES, { id, kanji, reading });
}

/* =========================================
   9) 本体コンポーネント
   ========================================= */
export default function DetailModal({ open, onClose, data, level = "n5" }) {
  const { i18n } = useTranslation();
  const langKey = getLangKey(i18n);

  const overlayRef = useRef(null);
  const scrollRef = useRef(null);
  const lastActiveElRef = useRef(null);

  const safeData = data || {};
  const levelKey = String(level || safeData.level || "n5").toLowerCase();

  const ALL_WORDS = useMemo(() => gatherAllWordsByLevel(levelKey), [levelKey]);

  const BY_ID = useMemo(() => new Map(ALL_WORDS.map((w) => [String(w.id), w])), [ALL_WORDS]);
  const BY_KANJI = useMemo(
    () => new Map(ALL_WORDS.filter((w) => w?.kanji).map((w) => [String(w.kanji), w])),
    [ALL_WORDS]
  );
  const BY_READING = useMemo(
    () => new Map(ALL_WORDS.filter((w) => w?.reading).map((w) => [String(w.reading), w])),
    [ALL_WORDS]
  );

  const word = useMemo(() => {
    const idStr = safeData?.id != null ? String(safeData.id) : null;
    const byId = idStr ? BY_ID.get(idStr) : null;
    const byKanji = !byId && safeData?.kanji ? BY_KANJI.get(String(safeData.kanji)) : null;
    const byReading =
      !byId && !byKanji && safeData?.reading ? BY_READING.get(String(safeData.reading)) : null;

    const resolved = byId || byKanji || byReading || {};
    const finalId = safeData?.id ?? resolved?.id ?? null;

    let enriched = null;
    if (finalId != null) enriched = ENRICHED_BY_ID.get(String(finalId)) || null;
    if (!enriched && (safeData?.kanji || resolved?.kanji)) {
      const keyKanji = String(safeData?.kanji || resolved?.kanji);
      enriched = ENRICHED_BY_KANJI.get(keyKanji) || null;
    }

    return { ...(enriched || {}), ...resolved, ...safeData, id: finalId, level: levelKey };
  }, [safeData, BY_ID, BY_KANJI, BY_READING, levelKey]);

  const meaningText = useMemo(() => pickText(word.meanings, langKey), [word.meanings, langKey]);

  const k0 = useMemo(() => word?.kanjiInfo?.[0] || {}, [word]);
  const onList = useMemo(() => (Array.isArray(k0.on) ? k0.on : []).join("・"), [k0]);
  const kunList = useMemo(() => (Array.isArray(k0.kun) ? k0.kun : []).join("・"), [k0]);

  const inlineReading = useMemo(() => {
    const kunFirst = (k0.kun && k0.kun[0]) || word.reading || "";
    const onFirst = (k0.on && k0.on[0]) || "";
    return onFirst ? `${kunFirst}、${onFirst}` : `${kunFirst}`;
  }, [k0, word.reading]);

  const sentences = useMemo(() => {
    const raw = getQuizSentences(levelKey, { id: word.id, kanji: word.kanji, reading: word.reading });
    return raw.map((h) => decorateQuizSentence(h, word));
  }, [word.id, word.kanji, word.reading, levelKey]);

  const freqStars = useMemo(() => getFrequencyStars(word), [word]);

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

  const kanjiStr = String(word.kanji || "");
  const isMultiKanji = kanjiStr.length >= 2;

  // ✅ open中：背景(.app-content)のスクロールをロック + ESCで閉じる + スクロール位置リセット
  useEffect(() => {
    if (!open) return;

    lastActiveElRef.current = document.activeElement;

    document.documentElement.classList.add("is-modal-open");

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    // 先頭へ（「下まで行くと戻る」系の体感も減る）
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("is-modal-open");

      // フォーカスを戻す
      const last = lastActiveElRef.current;
      if (last && typeof last.focus === "function") last.focus();
    };
  }, [open, onClose]);

  if (!open || !data) return null;

  const modalUi = (
    <div
      ref={overlayRef}
      className="detail-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="detail-modal" role="document">
        <div className="detail-header">
          <button className="detail-close" onClick={onClose} aria-label="閉じる">
            ×
          </button>

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

        {/* ✅ ここが “唯一のスクロール領域” */}
        <div ref={scrollRef} className="detail-scroll" aria-label="詳細内容">
          <div className="detail-meta">
            <div>
              <div className="meta__label">意味</div>
              <div className="meta__value" lang={langKey}>
                {meaningText || "-"}
              </div>
            </div>

            {!isMultiKanji && (
              <>
                <div>
                  <div className="meta__label">on</div>
                  <div className="meta__value" lang="ja">
                    {onList || "-"}
                  </div>
                </div>
                <div>
                  <div className="meta__label">kun</div>
                  <div className="meta__value" lang="ja">
                    {kunList || word.reading || "-"}
                  </div>
                </div>
              </>
            )}

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
                  例文は準備中です。<code>src/data/wordquiz/{levelKey}/**</code> に
                  <code>question_ja</code> を追加すると自動表示されます。
                </p>
              </div>
            )}
          </div>

          {Array.isArray(word.conjugations) || word.conjugations ? (
            <div className="detail-conjugations">
              <h3>活用</h3>
              <div className="conj-empty">活用データがあります（描画は形式に合わせて差し込み）</div>
            </div>
          ) : null}

          {hintFor("ます形") && (
            <div className="detail-hints">
              <h3>学習ヒント</h3>
              <p className="hint-line">{hintFor("ます形")}</p>
            </div>
          )}

          <div className="detail-bottomSpace" aria-hidden="true" />
        </div>
      </div>
    </div>
  );

  // ✅ 重要：app-content の中じゃなく body 直下へ
  return createPortal(modalUi, document.body);
}