// src/data-tools/split_by_pos_level.js
import fs from "fs";
import path from "path";

// 入力: merge_jlpt_jmdict.js が作った統合CSV
const IN_FILE = path.resolve("./src/data-output/jlpt_merged.csv");

// レベル補完用に元CSVを参照
const JLPT_SRC_DIR = path.resolve("./jlpt-word-list/src");
const JLPT_SRC_FILES = ["n1.csv","n2.csv","n3.csv","n4.csv","n5.csv"].map(f => path.join(JLPT_SRC_DIR, f));

// 出力先
const OUT_DIR = path.resolve("./src/data-output/splits");
fs.mkdirSync(OUT_DIR, { recursive: true });

// ────────────────────────────────
// CSVユーティリティ
function readCsv(file) {
  const text = fs.readFileSync(file, "utf8").trim();
  const lines = text.split(/\r?\n/);
  const header = lines.shift().split(",").map(s => s.trim());
  return lines.map(line => {
    const cells = line.split(",");
    const row = {};
    header.forEach((h, i) => row[h] = (cells[i] ?? "").trim());
    return row;
  });
}

function writeCsv(file, header, rows) {
  const lines = [header.join(",")];
  for (const r of rows) {
    const line = header.map(h => {
      const v = (r[h] ?? "").toString();
      return v.includes(",") || v.includes('"')
        ? `"${v.replace(/"/g, '""')}"`
        : v;
    }).join(",");
    lines.push(line);
  }
  fs.writeFileSync(file, lines.join("\n"), "utf8");
}

// レベル補完用インデックス作成
function buildLevelIndex() {
  const idx = new Map(); // key = "kanji|reading" → level
  for (const f of JLPT_SRC_FILES) {
    if (!fs.existsSync(f)) continue;
    const level = "N" + path.basename(f).match(/n(\d)\.csv$/)[1];
    const text = fs.readFileSync(f, "utf8").trim();
    const lines = text.split(/\r?\n/);
    const header = lines.shift().split(",").map(s=>s.trim().toLowerCase());
    const iExp = header.indexOf("expression");
    const iRead = header.indexOf("reading");
    if (iExp === -1 || iRead === -1) continue;
    for (const line of lines) {
      const cells = line.split(",");
      const k = `${(cells[iExp]??"").trim()}|${(cells[iRead]??"").trim()}`;
      if (!idx.has(k)) idx.set(k, level);
    }
  }
  return idx;
}

// 品詞を大分類に変換
function coarsePOS(pos) {
  const p = (pos || "").toLowerCase();
  const tags = p.split(/[;,\s]+/).filter(Boolean);
  const has = (x) => tags.some(t => t === x || t.startsWith(x));

  // verbs
  if (tags.some(t => t.startsWith("v"))) return "verbs";

  // adj
  if (has("adj-i")) return "adj-i";
  if (has("adj-na") || has("adj-no") || has("n-adj")) return "adj-na";

  // adverbs
  if (has("adv") || has("adv-to") || has("n-adv")) return "adverbs";

  // nouns
  if (tags.some(t => t.startsWith("n"))) return "nouns";

  return "other";
}

// ────────────────────────────────
// メイン処理
(function main() {
  if (!fs.existsSync(IN_FILE)) {
    console.error("❌ 入力がありません:", IN_FILE);
    process.exit(1);
  }

  const rows = readCsv(IN_FILE); // {kanji,reading,level,pos,meaning_en}
  const levelIdx = buildLevelIndex();

  // レベル補完 & coarsePOS付与
  for (const r of rows) {
    if (!r.level) {
      const key = `${r.kanji}|${r.reading}`;
      const key2 = `|${r.reading}`;
      r.level = levelIdx.get(key) || levelIdx.get(key2) || "";
    }
    r.pos_coarse = coarsePOS(r.pos);
  }

  // グループ化
  const groups = new Map(); // key = "N5:nouns"
  for (const r of rows) {
    const L = r.level || "UNKNOWN";
    const P = r.pos_coarse;
    const key = `${L}:${P}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }

  // 書き出し
  const HEADER = ["kanji","reading","level","pos","meaning_en"];
  for (const [key, list] of groups.entries()) {
    const [level, posGroup] = key.split(":");
    const safeLevel = level.replace(/[^A-Za-z0-9]/g, "");
    const filename = `jlpt_${safeLevel}_${posGroup}.csv`;
    writeCsv(path.join(OUT_DIR, filename), HEADER, list);
    console.log(`📝 ${filename}\t(${list.length} rows)`);
  }

  console.log("✅ Done →", OUT_DIR);
})();
