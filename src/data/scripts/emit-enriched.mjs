import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";

function readLines(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
}

function groupByLevelPart(rows) {
  const map = new Map();
  for (const r of rows) {
    const key = `${r.level}::${r.part}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({
      id: r.id,
      kanji: r.kanji,
      reading: r.reading,
      meanings: r.meanings,
      furigana: r.furigana,
      kanjiInfo: r.kanjiInfo
    });
  }
  return map;
}

async function main() {
  const rows = readLines("data/cache/enriched.jsonl");
  if (!rows.length) {
    console.error("❌ data/cache/enriched.jsonl がありません。先に `npm run vocab:enrich` を実行してください。");
    process.exit(1);
  }
  const groups = groupByLevelPart(rows);

  for (const [key, arr] of groups) {
    const [level, part] = key.split("::");
    const outDir = `src/data_enriched/${level}WordSets`;
    fs.mkdirSync(outDir, { recursive: true });
    const n = Number(part);
    const exportName = `${level}part${n}`;
    const lessonName = `Lesson${n}`;
    const code = `export const ${exportName} = {\n  ${lessonName}: ${JSON.stringify(arr, null, 2)}\n};\n`;
    const formatted = await prettier.format(code, { parser: "babel" });
    fs.writeFileSync(path.join(outDir, `${level}part${n}.js`), formatted);
  }
  console.log("✅ emitted enriched files → src/data_enriched/**");
}

main();
