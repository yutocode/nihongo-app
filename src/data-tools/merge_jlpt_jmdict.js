// src/data-tools/merge_jlpt_jmdict.js
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("./src/data-output");
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_FILE = path.join(OUT_DIR, "jlpt_merged.csv");

// JLPT リスト
const ALL_MIN = path.resolve("./jlpt-word-list/out/all.min.csv");
const SRC_DIR = path.resolve("./jlpt-word-list/src");
const SRC_FILES = ["n1.csv","n2.csv","n3.csv","n4.csv","n5.csv"].map(f=>path.join(SRC_DIR,f));

// JMdict 候補
const JMDICT_CANDIDATES = [
  path.resolve("./jmdict-simplified/JMdict_e.json"),
  path.resolve("./jmdict-simplified/data/JMdict_e.json"),
];

function ensureJmdictPath() {
  for (const p of JMDICT_CANDIDATES) if (fs.existsSync(p)) return p;
  throw new Error("JMdict_e.json が jmdict-simplified に見つかりませんでした。配置を確認してください。");
}

function parseCsvLines(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines.shift();
  const cols = header.split(",").map(s=>s.trim().toLowerCase());
  const idxExp = cols.indexOf("expression");
  const idxRead = cols.indexOf("reading");
  if (idxExp === -1 || idxRead === -1) throw new Error("CSV ヘッダに expression / reading が見つかりません。");

  return lines.map(line => {
    const cells = line.split(",");
    return {
      expression: (cells[idxExp] ?? "").trim(),
      reading: (cells[idxRead] ?? "").trim(),
    };
  });
}

function loadJlptList() {
  if (fs.existsSync(ALL_MIN)) {
    const text = fs.readFileSync(ALL_MIN, "utf8");
    const rows = parseCsvLines(text);
    return rows.map(r => ({ ...r, level: "" }));
  }
  const merged = [];
  for (const f of SRC_FILES) {
    const level = "N" + path.basename(f).match(/n(\d)\.csv$/)[1];
    const text = fs.readFileSync(f, "utf8");
    const rows = parseCsvLines(text).map(r => ({ ...r, level }));
    merged.push(...rows);
  }
  return merged;
}

// --- JMdict ロード（あなたのJSONは root.words 配列） --- //
function loadJmdict(pathJson) {
  const raw = fs.readFileSync(pathJson, "utf8");
  const j = JSON.parse(raw);

  if (Array.isArray(j)) return j;
  if (Array.isArray(j.words)) return j.words;        // ★ ココが今回のメイン
  if (Array.isArray(j.entries)) return j.entries;
  if (Array.isArray(j.items)) return j.items;

  for (const v of Object.values(j)) {
    if (Array.isArray(v)) return v;
  }
  throw new Error("JMdict JSON: エントリ配列が見つかりませんでした");
}

// --- ここが重要：あなたのスキーマ専用の抽出 --- //
function buildDictMap(entries) {
  const m = new Map();

  for (const e of entries) {
    // kanji / kana はオブジェクト配列 → text を抽出
    const kanjis = Array.isArray(e.kanji) ? e.kanji.map(k => k?.text).filter(Boolean) : [];
    const readings = Array.isArray(e.kana) ? e.kana.map(k => k?.text).filter(Boolean) : [];

    const senses = Array.isArray(e.sense) ? e.sense : [];
    // 品詞は partOfSpeech（配列の文字列タグ）
    const posArray = senses.flatMap(s => Array.isArray(s.partOfSpeech) ? s.partOfSpeech : [])
                           .filter(Boolean);

    // 英語グロスは gloss[].text（lang==="eng" を優先）
    const gloss0 = (() => {
      if (!senses.length) return "";
      const g = senses[0].gloss || [];
      if (!Array.isArray(g)) return "";
      const en = g.find(x => x?.lang === "eng" && x?.text);
      return (en?.text) || (g[0]?.text) || "";
    })();

    const pos0 = posArray[0] || "unknown";

    // 読みだけの見出しも拾う
    if (!kanjis.length && readings.length) {
      const key = `|${readings[0]}`;
      if (!m.has(key)) m.set(key, { pos: pos0, gloss: gloss0 });
    }

    // 代表キーは (kanji|reading) の全組み合わせ
    const ks = kanjis.length ? kanjis : [""];
    const rs = readings.length ? readings : [""];
    for (const k of ks) {
      for (const r of rs) {
        const key = `${k}|${r}`;
        if (!m.has(key)) m.set(key, { pos: pos0, gloss: gloss0 });
      }
    }
  }
  return m;
}

function csvEscape(s) {
  const t = (s ?? "").toString();
  return `"${t.replace(/"/g, '""')}"`;
}

function main() {
  const jlpt = loadJlptList();
  const jmdictPath = ensureJmdictPath();
  const jmdict = loadJmdict(jmdictPath);
  const dictMap = buildDictMap(jmdict);

  const out = [];
  for (const { expression, reading, level } of jlpt) {
    const keyExact = `${expression}|${reading}`;
    const keyReadingOnly = `|${reading}`;
    const hit = dictMap.get(keyExact) || dictMap.get(keyReadingOnly) || { pos: "unknown", gloss: "" };

    out.push({
      kanji: expression,
      reading,
      level: level || "",
      pos: hit.pos,
      meaning_en: hit.gloss,
    });
  }

  const header = "kanji,reading,level,pos,meaning_en";
  const lines = out.map(w =>
    [w.kanji, w.reading, w.level, w.pos, w.meaning_en].map((v,i)=> i===4 ? csvEscape(v) : (v ?? "")).join(",")
  );

  fs.writeFileSync(OUT_FILE, [header, ...lines].join("\n"), "utf8");
  console.log("✅ Done →", OUT_FILE, `\n  (JLPT: ${jlpt.length} entries)`);
}

main();
