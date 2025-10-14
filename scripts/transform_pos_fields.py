import os, re, json, argparse
from typing import Any, Dict, Tuple

POS_MAP = {
    "adverbs": "副詞",
    "iAdjectives": "い形容詞",
    "naAdjectives": "な形容詞",
    "nouns": "名詞",
    "verbs": "動詞",
    "others": "その他",
}

def detect_pos_from_filename(filename: str) -> str:
    for key, pos in POS_MAP.items():
        if key.lower() in filename.lower():
            return pos
    return ""

def strip_js_export(text: str) -> Tuple[str, str]:
    # export const <name> = ...
    m = re.search(r'export\s+const\s+([A-Za-z0-9_]+)\s*=\s*', text)
    if not m:
        text_nc = re.sub(r"//.*?$|/\*.*?\*/", "", text, flags=re.M | re.S)
        m = re.search(r'export\s+const\s+([A-Za-z0-9_]+)\s*=\s*', text_nc)
        if not m:
            raise ValueError("Could not find `export const <name> =` in file.")
        base_text = text_nc
    else:
        base_text = text
    export_name = m.group(1)
    start = m.end()
    # find first { or [
    bracket_pos = None
    for ch in "[{":
        p = base_text.find(ch, start)
        if p != -1 and (bracket_pos is None or p < bracket_pos):
            bracket_pos = p
    if bracket_pos is None:
        raise ValueError("Could not find array/object start.")
    payload = base_text[bracket_pos:]
    # match closing
    stack, end_idx = [], None
    for i, ch in enumerate(payload):
        if ch in "[{":
            stack.append(ch)
        elif ch in "]}":
            if not stack: raise ValueError("Bracket mismatch.")
            left = stack.pop()
            if (left == "[" and ch == "]") or (left == "{" and ch == "}"):
                if not stack:
                    end_idx = i + 1
                    break
    if end_idx is None:
        raise ValueError("Could not find end of payload.")
    return export_name, payload[:end_idx]

def sanitize_js_like(text: str) -> str:
    t = text
    # 全角スペース -> 半角
    t = t.replace("\u3000", " ")
    # JSコメント削除
    t = re.sub(r"//.*?$|/\*.*?\*/", "", t, flags=re.M | re.S)
    # ← や → で始まる行末メモを削除（例: [ ← ここだけ、など）
    t = re.sub(r"[←→].*$", "", t, flags=re.M)
    # バッククォート文字列やテンプレは想定外なので残ってたら除去（安全側に）
    t = t.replace("`", '"')
    # シングルクォート -> ダブル
    t = t.replace("'", '"')
    # 未引用キーにダブルクォート（日本語/数字/アンダースコア等もOK）
    t = re.sub(r'([{\s,])([^\s:{}\[\]"]+)\s*:', r'\1"\2":', t)
    # 末尾カンマ削除
    t = re.sub(r',\s*([}\]])', r'\1', t)
    # 複数のカンマやカンマ直後の閉じを正規化
    t = re.sub(r',\s*(,|\])', r'\1', t)
    return t

def js_like_to_json(text: str, for_debug_path: str = None) -> Any:
    t = sanitize_js_like(text)
    try:
        return json.loads(t)
    except json.JSONDecodeError as e:
        # デバッグ用に失敗したテキストを保存
        if for_debug_path:
            dbg = for_debug_path + ".debug.json.txt"
            with open(dbg, "w", encoding="utf-8") as f:
                f.write(t)
        raise

def inject_pos(obj: Any, pos_label: str) -> Any:
    if not isinstance(obj, dict):
        return obj
    def reorder(entry: Dict[str, Any]) -> Dict[str, Any]:
        new_entry: Dict[str, Any] = {}
        if "id" in entry: new_entry["id"] = entry["id"]
        new_entry["pos"] = pos_label
        for k in ["kanji", "reading", "meanings"]:
            if k in entry: new_entry[k] = entry[k]
        for k, v in entry.items():
            if k not in new_entry: new_entry[k] = v
        return new_entry
    out = {}
    for lesson, arr in obj.items():
        if isinstance(arr, list):
            out[lesson] = [reorder(e) if isinstance(e, dict) else e for e in arr]
        else:
            out[lesson] = arr
    return out

def to_js(export_name: str, obj: Any) -> str:
    return f"export const {export_name} = {json.dumps(obj, ensure_ascii=False, indent=2)}\n"

def process_and_render(src_path: str) -> Tuple[str, str]:
    with open(src_path, "r", encoding="utf-8") as f:
        src = f.read()
    export_name, payload_str = strip_js_export(src)
    pos_label = detect_pos_from_filename(os.path.basename(src_path))
    data = js_like_to_json(payload_str, for_debug_path=src_path)
    data2 = inject_pos(data, pos_label)
    return to_js(export_name, data2), pos_label

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--indir", help="Input directory (process all .js)")
    ap.add_argument("--outdir", required=True, help="Output directory")
    ap.add_argument("--glob", help="Only files matching this pattern (e.g. n1part_nouns*.js)")
    ap.add_argument("--infile", help="Process a single JS file")
    ap.add_argument("--skip-on-error", action="store_true", help="Skip files that fail to parse")
    args = ap.parse_args()

    os.makedirs(args.outdir, exist_ok=True)

    def want(name: str) -> bool:
        if not args.glob: return True
        # 簡易グロブ: * だけサポート
        pat = "^" + re.escape(args.glob).replace("\\*", ".*") + "$"
        return re.match(pat, name) is not None

    if args.infile:
        name = os.path.basename(args.infile)
        if not want(name): return
        try:
            rendered, pos = process_and_render(args.infile)
            dst = os.path.join(args.outdir, name)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            with open(dst, "w", encoding="utf-8") as f:
                f.write(rendered)
            print(f"✅ Processed (single): {name} → {pos}")
        except Exception as e:
            print(f"❌ Failed (single): {name} :: {e}")
        return

    if not args.indir:
        raise SystemExit("Either --infile or --indir must be provided.")

    for root, _, files in os.walk(args.indir):
        for name in files:
            if not name.endswith(".js"): continue
            if not want(name): continue
            src_path = os.path.join(root, name)
            rel = os.path.relpath(src_path, args.indir)
            try:
                rendered, pos = process_and_render(src_path)
                dst = os.path.join(args.outdir, rel)
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                with open(dst, "w", encoding="utf-8") as f:
                    f.write(rendered)
                print(f"✅ Processed: {rel} → {pos}")
            except Exception as e:
                print(f"❌ Failed: {rel} :: {e}")
                if not args.skip_on_error:
                    raise

if __name__ == "__main__":
    main()
