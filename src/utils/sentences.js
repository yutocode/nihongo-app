// 例文抽出ユーティリティ（N5用）
// - data/wordquiz/n5/** から question_ja を収集
// - id / kanji / reading で絞り込み
// - 下線 <u>…</u> を <ruby>…<rt>…</rt></ruby> に置換（kun優先、なければon）

// enriched.jsonl を raw で読み込み（kun/on の決定に使う）
import enrichedRaw from "../../data/cache/enriched.jsonl?raw";

const ENRICHED_BY = (() => {
  const byId = new Map();
  const byKanji = new Map();
  if (typeof enrichedRaw === "string") {
    for (const line of enrichedRaw.split(/\r?\n/)) {
      const s = line.trim();
      if (!s) continue;
      try {
        const o = JSON.parse(s);
        if (o?.id != null) byId.set(String(o.id), o);
        if (o?.kanji) byKanji.set(String(o.kanji), o);
      } catch {}
    }
  }
  return { byId, byKanji };
})();

// N5クイズを全部読み込む（default / named どちらでも配列を拾う）
const quizModules = import.meta.glob("../data/wordquiz/n5/**/*.js", { eager: true });
const QUIZZES = Object.values(quizModules)
  .flatMap((m) =>
    Array.isArray(m?.default)
      ? m.default
      : Object.values(m || {}).find(Array.isArray) || []
  )
  .filter(Boolean);

// 下線を ruby に変換（kun > on）
function underlineToRuby(html, fallbackFurigana) {
  return html.replace(/<u>(.+?)<\/u>/g, (_m, tgt) => {
    const rt = String(fallbackFurigana || "").trim();
    return rt ? `<ruby>${tgt}<rt>${rt}</rt></ruby>` : tgt;
  });
}

// id / kanji / reading でヒットするクイズ文を返す（最大 max 件）
export function getQuizExamples({ id, kanji, reading }, { max = 3 } = {}) {
  const out = [];
  const idStr = id != null ? String(id) : null;

  // ふりがな候補を enriched から作る（kun優先、なければon）
  let furigana = "";
  const enriched = idStr
    ? ENRICHED_BY.byId.get(idStr)
    : (kanji && ENRICHED_BY.byKanji.get(String(kanji))) || null;
  if (enriched?.kanjiInfo?.[0]) {
    const k0 = enriched.kanjiInfo[0];
    furigana = (k0.kun && k0.kun[0]) || (k0.on && k0.on[0]) || enriched.reading || "";
  }

  // 1) id で一致
  if (idStr) {
    for (const q of QUIZZES) {
      if (String(q?.id) === idStr && q?.question_ja) out.push(q.question_ja);
      if (out.length >= max) break;
    }
  }

  // 2) kanji / 3) reading でテキスト検索
  if (out.length < max && kanji) {
    const needle = `<u>${kanji}</u>`;
    for (const q of QUIZZES) {
      const s = q?.question_ja || "";
      if (s.includes(needle) || s.includes(kanji)) out.push(s);
      if (out.length >= max) break;
    }
  }
  if (out.length < max && reading) {
    for (const q of QUIZZES) {
      const s = q?.question_ja || "";
      if (s.includes(reading)) out.push(s);
      if (out.length >= max) break;
    }
  }

  // 下線→ruby 置換
  return out.slice(0, max).map((h) => underlineToRuby(h, furigana));
}
