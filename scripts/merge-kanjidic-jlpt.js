import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

const ROOT = process.cwd();
const KANJI_JSON = path.join(ROOT, "src/data/kanji/kanji.json");
const KANJIDIC_XML = path.join(ROOT, "data/kanjidic2.xml");

const parser = new XMLParser({ ignoreAttributes: false });

const kanjiData = JSON.parse(fs.readFileSync(KANJI_JSON, "utf-8"));
const xml = fs.readFileSync(KANJIDIC_XML, "utf-8");
const dic = parser.parse(xml);

let hit = 0;

for (const ch of dic.kanjidic2.character) {
  const literal = ch.literal;
  if (!kanjiData[literal]) continue;

  const jlpt = ch.misc?.jlpt;
  if (!jlpt) continue;

  kanjiData[literal].jlpt = `N${jlpt}`;
  hit++;
}

fs.writeFileSync(
  KANJI_JSON,
  JSON.stringify(kanjiData, null, 2),
  "utf-8"
);

console.log(`✅ JLPT を付与: ${hit} 漢字`);