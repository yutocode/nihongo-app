import json
import sys
import MeCab
import re
from pathlib import Path

# ===== 引数 =====
LEVEL = sys.argv[1]  # n1 or n2

INPUT_PATH = Path(f"src/data/kanji/{LEVEL}_with_examples.json")
OUTPUT_PATH = Path(f"src/data/kanji/{LEVEL}_with_examples_ruby.json")

# ===== MeCab（unidic-lite 強制）=====
tagger = MeCab.Tagger()

KANJI_RE = re.compile(r"[一-龯]")

def kata_to_hira(text: str) -> str:
    return "".join(
        chr(ord(c) - 0x60) if "ァ" <= c <= "ン" else c
        for c in text
    )

def rubyify_sentence(sentence: str) -> str:
    node = tagger.parseToNode(sentence)
    result = []

    while node:
        surface = node.surface
        features = node.feature.split(",")

        reading = ""
        # unidic / ipadic 両対応：カタカナを探す
        for f in features:
            if re.fullmatch(r"[ァ-ンー]+", f):
                reading = f
                break

        if surface and reading and KANJI_RE.search(surface):
            hira = kata_to_hira(reading)
            result.append(f"<ruby>{surface}<rt>{hira}</rt></ruby>")
        else:
            result.append(surface)

        node = node.next

    return "".join(result)

# ===== 実行 =====
with open(INPUT_PATH, encoding="utf-8") as f:
    data = json.load(f)

converted = 0

for kanji in data.values():
    new_examples = []
    for ex in kanji.get("examples", []):
        ja = ex.split("\t")[0].strip()  # 日本語だけ
        ruby = rubyify_sentence(ja)
        new_examples.append(ruby)
        converted += 1
    kanji["examples"] = new_examples

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ {LEVEL} ruby 化完了 / 変換文数: {converted}")
print(f"📄 出力: {OUTPUT_PATH}")