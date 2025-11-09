// scripts/collect-vocab.mjs
// 目的: 既存の語彙JSファイル群を走査して、1本の master.jsonl に集計します。
// 入力想定: src/data/*WordSets/**/n?part*.js など（例: n5part1.js, n5part_nouns1.js）
// 形式想定: export const nXpartY = { LessonY: [ {id,kanji,reading,meanings}, ... ] }

import fs from "node:fs";
import path from "node:path";
import { globby } from "globby";
import { pathToFileURL } from "node:url";

function normalizeMeaning(m) {
  const langs = ["ja", "en", "zh", "tw", "ko", "vi", "th", "my", "km"];
  const out = {};
  for (const l of langs) out[l] = (m?.[l] ?? "").toString();
  return out;
}

function guessLevel(filePath) {
  const p = filePath.replace(/\\/g, "/");
  const m = p.match(/src\/data\/(n[1-5])WordSets/i);
  return m ? m[1].toLowerCase() : "n?";
}

function guessPartFromFilename(filePath) {
  const base = path.basename(filePath);
  // ex) n5part1.js / n5part_nouns1.js / part12.js
  const r1 = base.match(/n\d+part(?:_[a-z]+)?(\d+)/i);
  if (r1) return Number(r1[1]);
  const r2 = base.match(/part(\d+)/i);
  if (r2) return Number(r2[1]);
  return 0;
}

function extractArrayAndLessonNo(mod) {
  // export の最初のキーを取り、その中の LessonX を探す
  const expKeys = Object.keys(mod);
  if (!expKeys.length) return { arr: [], lessonNo: 0 };
  const pack = mod[expKeys[0]];
  if (!pack || typeof pack !== "object") return { arr: [], lessonNo: 0 };

  const lessonKey = Object.keys(pack)[0]; // "Lesson1" などを想定
  const arr = Array.isArray(pack[lessonKey]) ? pack[lessonKey] : [];
  const m = String(lessonKey || "").match(/lesson\s*(\d+)/i);
  const lessonNo = m ? Number(m[1]) : 0;

  return { arr, lessonNo };
}

async function main() {
  const patterns = [
    "src/data/*WordSets/n?part*.js",
    "src/data/*WordSets/*/n?part*.js",
  ];
  const files = await globby(patterns);
  if (!files.length) {
    console.warn("⚠️ データファイルが見つかりません: src/data/*WordSets/n?part*.js");
  }

  const rows = [];
  for (const f of files) {
    try {
      const mod = await import(pathToFileURL(path.resolve(f)));
      const { arr, lessonNo } = extractArrayAndLessonNo(mod);
      const level = guessLevel(f);
      const part = lessonNo || guessPartFromFilename(f); // Lesson優先

      for (const w of arr) {
        rows.push({
          level,
          part,
          id: Number(w?.id ?? 0),
          kanji: String(w?.kanji ?? ""),
          reading: String(w?.reading ?? ""),
          meanings: normalizeMeaning(w?.meanings || {}),
        });
      }
    } catch (e) {
      console.error(`❌ 読み込み失敗: ${f}`);
      console.error(e);
    }
  }

  fs.mkdirSync("data/raw", { recursive: true });
  fs.writeFileSync(
    "data/raw/master.jsonl",
    rows.map((r) => JSON.stringify(r)).join("\n")
  );
  console.log(`✅ collected ${rows.length} entries → data/raw/master.jsonl`);
}

main().catch((e) => (console.error(e), process.exit(1)));
