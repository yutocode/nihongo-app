# generate_voicevox_audio.py
import os
import requests

readings = [
    "ひ", "つき", "ひ", "みず", "き", "かね", "つち", "やま", "かわ", "た",
    "ひと", "くち", "め", "みみ", "て", "あし", "ちから", "き", "えん", "とし",
    "さき", "せい", "がく", "こう", "とも", "ほん", "ぶん", "じ", "なに", "おとこ",
    "おんな", "こ", "ちち", "はは", "あに", "あね", "おとうと", "いもうと", "いえ", "もん",
    "なか", "うえ", "した", "おおきい", "ちいさい", "ながい", "しろ", "くろ", "あか", "あお"
]

output_dir = "public/audio/n5/lesson1"
os.makedirs(output_dir, exist_ok=True)
speaker_id = 1  # 例：ずんだもん

for i, text in enumerate(readings, 1):
    filename = f"{i}_{text}.mp3"
    filepath = os.path.join(output_dir, filename)

    try:
        query = requests.post("http://127.0.0.1:50021/audio_query", params={"text": text, "speaker": speaker_id})
        query.raise_for_status()

        audio = requests.post(
            "http://127.0.0.1:50021/synthesis",
            params={"speaker": speaker_id},
            data=query.text.encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        audio.raise_for_status()

        with open(filepath, "wb") as f:
            f.write(audio.content)

        print(f"✅ {filename} を保存しました")
    except Exception as e:
        print(f"❌ エラー: {filename} - {e}")

print("🎉 すべての音声を生成しました！")
