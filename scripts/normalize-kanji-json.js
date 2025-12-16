import fs from "fs";
import path from "path";

// ===== パス設定 =====
const ROOT = process.cwd();
const KANJI_JSON_PATH = path.join(
  ROOT,
  "src/data/kanji/kanji.json",
);
const BACKUP_PATH = path.join(
  ROOT,
  "src/data/kanji/kanji.backup.json",
);

// ===== 理想スキーマ =====
function normalizeKanjiEntry(key, entry = {}) {
  return {
    char: entry.char || key,
    strokes: entry.strokes ?? null,

    onyomi: entry.onyomi ?? [],
    kunyomi: entry.kunyomi ?? [],

    meaning: entry.meaning ?? "",
    jlpt: entry.jlpt ?? null,
    grade: entry.grade ?? null,
    frequency: entry.frequency ?? null,

    radical: entry.radical ?? "",
    radicals: entry.radicals ?? [],

    note: entry.note ?? "",
    hint: entry.hint ?? "",
    aiNote: entry.aiNote ?? "",
  };
}

// ===== 実行 =====
if (!fs.existsSync(KANJI_JSON_PATH)) {
  console.error("❌ kanji.json が見つかりません");
  process.exit(1);
}

const raw = fs.readFileSync(KANJI_JSON_PATH, "utf-8");
const original = JSON.parse(raw);

// バックアップ
fs.writeFileSync(
  BACKUP_PATH,
  JSON.stringify(original, null, 2),
  "utf-8",
);

// 正規化
const normalized = {};
let count = 0;

for (const [key, value] of Object.entries(original)) {
  normalized[key] = normalizeKanjiEntry(key, value);
  count++;
}

// 保存
fs.writeFileSync(
  KANJI_JSON_PATH,
  JSON.stringify(normalized, null, 2),
  "utf-8",
);

console.log(`✅ 正規化完了: ${count} 漢字`);
console.log("📦 バックアップ作成: kanji.backup.json");