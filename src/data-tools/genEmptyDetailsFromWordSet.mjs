// Node実行用（ESM）
// 例: node src/data-tools/genEmptyDetailsFromWordSet.mjs n5 nouns Lesson1 src/data/n5WordSets/n5part_nouns1.js

import { mkdirSync, writeFileSync, existsSync } from "fs";
import path from "path";
import url from "url";

const [, , level, category, lesson, wordSetPath] = process.argv;
if (!level || !category || !lesson || !wordSetPath) {
  console.error("使い方: node genEmptyDetailsFromWordSet.mjs <level> <category> <lesson> <wordSetPath>");
  process.exit(1);
}

const full = path.resolve(wordSetPath);
const mod = await import(url.pathToFileURL(full).href);

const exported = Object.values(mod)[0];
const list =
  exported?.[lesson] ||
  exported?.[lesson.replace(/lesson/i, (m) => m[0].toUpperCase() + m.slice(1))];

if (!Array.isArray(list)) {
  console.error(`配列が見つかりません: ${lesson} in ${wordSetPath}`);
  process.exit(1);
}

const outDir = path.resolve(`src/data/wordDetails/${level}/${category}/${lesson}`);
mkdirSync(outDir, { recursive: true });

let created = 0, skipped = 0;

for (const w of list) {
  const id = w?.id;
  if (id == null) continue;

  const fn = path.join(outDir, `${id}.json`);
  if (existsSync(fn)) { skipped++; continue; }

  const obj = {
    kanji: w.kanji || "",
    reading: w.reading || "",
    pos: "",
    meanings: {},
    examples: [],
    tags: [level.toUpperCase(), lesson]
  };

  writeFileSync(fn, JSON.stringify(obj, null, 2), "utf8");
  created++;
}

console.log(`✅ 生成: ${created} 件, ⏭ 既存スキップ: ${skipped} 件`);
console.log(`📂 出力先: ${outDir}`);
