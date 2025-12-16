import json
import MeCab

# ===============================
# 設定
# ===============================
INPUT_JSON = "src/data/kanji/n4_with_examples.json"
OUTPUT_JSON = "src/data/kanji/n4_with_examples_ruby.json"

tagger = MeCab.Tagger()

# ===============================
# ユーティリティ
# ===============================
def is_kanji(ch):
    return "\u4e00" <= ch <= "\u9fff"

def kata_to_hira(text):
    return "".join(
        chr(ord(c) - 0x60) if "ァ" <= c <= "ン" else c
        for c in text
    )

def normalize_long_vowel(text):
    rules = {
        "きょー": "きょう",
        "ぎょー": "ぎょう",
        "しょー": "しょう",
        "じょー": "じょう",
        "ちょー": "ちょう",
        "にょー": "にょう",
        "ひょー": "ひょう",
        "みょー": "みょう",
        "りょー": "りょう",
        "ほー": "ほう",
        "こー": "こう",
        "そー": "そう",
        "とー": "とう",
        "どー": "どう",
        "おー": "おう",
        "じゅー": "じゅう",
        "しゅー": "しゅう",
        "ちゅー": "ちゅう",
        "きゅー": "きゅう",
        "にゅー": "にゅう",
        "りゅー": "りゅう",
        "ゆー": "ゆう",
    }

    for k, v in rules.items():
        text = text.replace(k, v)

    return text

# ===============================
# ruby 化
# ===============================
def rubyify_sentence(sentence):
    node = tagger.parseToNode(sentence)
    result = ""

    while node:
        surface = node.surface
        features = node.feature.split(",")

        if surface and any(is_kanji(c) for c in surface):
            reading = features[9] if len(features) > 9 else ""

            if reading and reading != "*":
                reading = kata_to_hira(reading)
                reading = normalize_long_vowel(reading)
                result += f"<ruby>{surface}<rt>{reading}</rt></ruby>"
            else:
                result += surface
        else:
            result += surface

        node = node.next

    return result

# ===============================
# メイン処理
# ===============================
def main():
    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    count = 0

    for _, entry in data.items():
        if "examples" not in entry:
            continue

        new_examples = []
        for ex in entry["examples"]:
            # 日本語文だけ抽出（タブ以降は無視）
            ja = ex.split("\t")[0]
            ruby = rubyify_sentence(ja)
            new_examples.append(ruby)

        entry["examples"] = new_examples
        count += 1

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ ruby 付与完了: {count} 漢字")
    print(f"📄 出力: {OUTPUT_JSON}")

if __name__ == "__main__":
    main()