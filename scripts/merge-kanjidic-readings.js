import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

// ===== パス =====
const ROOT = process.cwd();
const KANJI_JSON = path.join(ROOT, "src/data/kanji/kanji.json");
const KANJIDIC_XML = path.join(ROOT, "data/kanjidic2.xml");

// ===== XML parser =====
const parser = new XMLParser({
  ignoreAttributes: false,
});

// ===== 読み抽出 =====
function extractReadings(reading) {
  if (!reading) return { onyomi: [], kunyomi: [] };
  const readings = Array.isArray(reading) ? reading : [reading];

  const onyomi = [];
  const kunyomi = [];

  for (const r of readings) {
    if (r["@_r_type"] === "ja_on") onyomi.push(r["#text"]);
    if (r["@_r_type"] === "ja_kun") kunyomi.push(r["#text"]);
  }

  return { onyomi, kunyomi };
}

// ===== load =====
const kanjiData = JSON.parse(fs.readFileSync(KANJI_JSON, "utf-8"));
const xml = fs.readFileSync(KANJIDIC_XML, "utf-8");
const dic = parser.parse(xml);

// ===== merge =====
let hit = 0;

for (const ch of dic.kanjidic2.character) {
  const literal = ch.literal;
  if (!kanjiData[literal]) continue;

  const rmgroup = ch.reading_meaning?.rmgroup;
  if (!rmgroup) continue;

  const { onyomi, kunyomi } = extractReadings(rmgroup.reading);

  kanjiData[literal].onyomi = onyomi;
  kanjiData[literal].kunyomi = kunyomi;

  hit++;
}

// ===== save =====
fs.writeFileSync(
  KANJI_JSON,
  JSON.stringify(kanjiData, null, 2),
  "utf-8",
);

console.log(`✅ 読みを追加: ${hit} 漢字`);