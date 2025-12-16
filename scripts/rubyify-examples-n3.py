import json
import MeCab
import re

INPUT_PATH = "src/data/kanji/n3_with_examples.json"
OUTPUT_PATH = "src/data/kanji/n3_with_examples_ruby.json"

tagger = MeCab.Tagger()

def kata_to_hira(text):
    return "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ン" else c for c in text)

def rubyify_sentence(sentence):
    node = tagger.parseToNode(sentence)
    result = ""

    while node:
        surface = node.surface
        if surface:
            features = node.feature.split(",")
            reading = features[6] if len(features) > 6 else ""

            # 漢字を含む語だけ ruby を振る
            if reading and re.search(r"[一-龯]", surface):
                hira = kata_to_hira(reading)
                result += f"<ruby>{surface}<rt>{hira}</rt></ruby>"
            else:
                result += surface
        node = node.next

    return result

with open(INPUT_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

for k, v in data.items():
    new_examples = []
    for ex in v.get("examples", []):
        new_examples.append(rubyify_sentence(ex))
    v["examples"] = new_examples

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ N3 ruby 化 完了")
print(f"📄 出力: {OUTPUT_PATH}")