// scripts/extract-n5-from-extra.js
import fs from "fs";
import path from "path";

const KANJI_DIR = path.resolve("src/data/kanji");

const extraPath = path.join(KANJI_DIR, "extra.json");
const n5Path = path.join(KANJI_DIR, "n5.json");

if (!fs.existsSync(extraPath)) {
  console.error("❌ extra.json が見つかりません");
  process.exit(1);
}

const extra = JSON.parse(fs.readFileSync(extraPath, "utf-8"));

const n5 = {};
const remain = {};

for (const [char, data] of Object.entries(extra)) {
  const strokes = data.strokes ?? 999;

  // 🔥 超シンプルN5ルール
  if (strokes <= 4) {
    n5[char] = {
      ...data,
      jlpt: "N5",
    };
  } else {
    remain[char] = data;
  }
}

fs.writeFileSync(n5Path, JSON.stringify(n5, null, 2), "utf-8");
fs.writeFileSync(extraPath, JSON.stringify(remain, null, 2), "utf-8");

console.log("✅ N5 抽出完了（strokes <= 4）");
console.log(`  n5.json   : ${Object.keys(n5).length} 字`);
console.log(`  extra残り : ${Object.keys(remain).length} 字`);