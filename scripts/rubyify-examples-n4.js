import fs from "fs";
import { spawnSync } from "child_process";

const INPUT = "src/data/kanji/n4_with_examples.json";
const OUTPUT = "src/data/kanji/n4_with_examples_ruby.json";

// 日本語だけ抽出（英語・ID除去）
function extractJapanese(line) {
  return line.split("\t")[0].trim();
}

// MeCab で ruby 化
function rubyify(sentence) {
  const py = spawnSync(
    "python3",
    ["-"],
    {
      input: `
import MeCab
tagger = MeCab.Tagger()
sentence = """${sentence.replace(/"/g, '\\"')}"""
node = tagger.parseToNode(sentence)
out = []
while node:
    surf = node.surface
    feat = node.feature.split(",")
    if surf and feat[0] != "BOS/EOS":
        reading = feat[7] if len(feat) > 7 else ""
        if reading and any("\\u4e00" <= c <= "\\u9fff" for c in surf):
            hira = reading.translate(str.maketrans(
                "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
                "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん"
            ))
            out.append(f"<ruby>{surf}<rt>{hira}</rt></ruby>")
        else:
            out.append(surf)
    node = node.next
print("".join(out))
`
    }
  );

  return py.stdout.toString().trim();
}

// ===== main =====
const data = JSON.parse(fs.readFileSync(INPUT, "utf-8"));
let total = 0;

for (const k of Object.keys(data)) {
  const item = data[k];
  if (!Array.isArray(item.examples)) continue;

  const cleaned = item.examples
    .map(extractJapanese)
    .filter(Boolean)
    .slice(0, 4) // 最大4文
    .map(rubyify);

  item.examples = cleaned;
  total += cleaned.length;
}

fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), "utf-8");

console.log(`✅ ruby 化完了: ${total} 例文`);
console.log(`📄 出力: ${OUTPUT}`);