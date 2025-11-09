// src/data/scripts/export-min.mjs
// enriched.jsonl から最小項目だけを抽出して出力。
// 環境変数で挙動を制御：
//   LEVELS="n5"            ← 抽出対象レベル（カンマ区切り可）
//   MODE="single|all"      ← single: 単独漢字語のみ / all: 語中すべての漢字を展開
//   FORMAT="csv|jsonl|js"  ← 出力形式
//   SPLIT_BY_LEVEL="1"     ← レベルごとに別ファイルに分割
//   UID="1"                ← uid = `${level}-${id}` を付与
//   REMAP_IDS="level"      ← レベル内で id を 1..n に振り直し

import fs from "node:fs";
import path from "node:path";

const MODE = (process.env.MODE || "single").toLowerCase();      // single | all
const FORMAT = (process.env.FORMAT || "csv").toLowerCase();     // csv | jsonl | js
const SPLIT_BY_LEVEL = process.env.SPLIT_BY_LEVEL === "1";      // レベル別に出力
const UID = process.env.UID === "1";                            // uid 付与
const REMAP_IDS = (process.env.REMAP_IDS || "").toLowerCase();  // "level" | ""
const LEVELS = (process.env.LEVELS || "")
  .toLowerCase()
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean); // 例: "n5" / "n5,n4"

const IN = "data/cache/enriched.jsonl";
if (!fs.existsSync(IN)) {
  console.error("❌ data/cache/enriched.jsonl がありません。先に vocab:enrich を実行してください。");
  process.exit(1);
}

const readJSONL = (p) =>
  fs.readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);

function toRows(rows) {
  if (MODE === "single") {
    // 単独漢字の語のみ（最初の1字情報を使う）
    return rows
      .filter((r) => r.showKanjiInfo && r.kanjiInfo?.length)
      .map((r) => {
        const k0 = r.kanjiInfo[0];
        return {
          level: String(r.level),
          part: Number(r.part),
          id: Number(r.id),
          kanji: r.kanji,
          reading: r.reading,
          on: (k0.on || []).join("・"),
          kun: (k0.kun || []).join("・"),
          strokes: Number(k0.strokes || 0),
        };
      });
  } else {
    // 語中の全漢字を展開（分析用）
    const out = [];
    rows.forEach((r) => {
      (r.kanjiInfo || []).forEach((k) => {
        out.push({
          level: String(r.level),
          part: Number(r.part),
          id: Number(r.id),
          kanji: r.kanji,
          reading: r.reading,
          char: k.char,
          on: (k.on || []).join("・"),
          kun: (k.kun || []).join("・"),
          strokes: Number(k.strokes || 0),
        });
      });
    });
    return out;
  }
}

function addUidAndRemap(rows) {
  if (UID) rows.forEach((r) => (r.uid = `${r.level}-${r.id}`));
  if (REMAP_IDS === "level") {
    const byLevel = new Map();
    rows.forEach((r) => {
      const key = r.level;
      if (!byLevel.has(key)) byLevel.set(key, []);
      byLevel.get(key).push(r);
    });
    for (const arr of byLevel.values()) {
      arr.sort((a, b) => (a.part - b.part) || (a.id - b.id));
      arr.forEach((r, i) => (r.id = i + 1));
    }
  }
  return rows;
}

function toCSV(arr) {
  if (!arr.length) return "";
  const cols = Object.keys(arr[0]);
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...arr.map((o) => cols.map((c) => esc(o[c])).join(","))].join("\n");
}

function writeOne(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (FORMAT === "csv") {
    fs.writeFileSync(filePath, toCSV(rows));
  } else if (FORMAT === "jsonl") {
    fs.writeFileSync(filePath, rows.map((o) => JSON.stringify(o)).join("\n"));
  } else if (FORMAT === "js") {
    const varName = path.basename(filePath).replace(/\W+/g, "_").replace(/^(\d)/, "_$1");
    const code = `export const ${varName} = ${JSON.stringify(rows, null, 2)};\n`;
    fs.writeFileSync(filePath, code);
  } else {
    console.error("❌ FORMAT は csv/jsonl/js のいずれか");
    process.exit(1);
  }
  console.log(`✅ ${rows.length} → ${filePath}`);
}

function main() {
  const all = readJSONL(IN);
  const filtered = LEVELS.length ? all.filter((r) => LEVELS.includes(String(r.level).toLowerCase())) : all;
  let rows = toRows(filtered);
  rows = addUidAndRemap(rows);

  if (SPLIT_BY_LEVEL) {
    const map = new Map();
    rows.forEach((r) => {
      if (!map.has(r.level)) map.set(r.level, []);
      map.get(r.level).push(r);
    });
    for (const [level, arr] of map) {
      const base = MODE === "single" ? `${level}_min_single` : `${level}_min_all`;
      const outPath = `data/cache/${base}.${FORMAT}`;
      writeOne(outPath, arr);
    }
  } else {
    const base = MODE === "single" ? `min_single` : `min_all`;
    const outPath = `data/cache/${base}.${FORMAT}`;
    writeOne(outPath, rows);
  }
}

main();
