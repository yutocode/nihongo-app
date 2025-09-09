# -*- coding: utf-8 -*-
"""
1800語（1行1語、先頭に番号や区切りがあってもOK）の重複を削除。
初出のみ残し、順序を保持します。

使い方:
  python dedupe_words.py --in words_raw.txt --out words_clean.txt --dups duplicates.csv
  # 上書き(元ファイルを~backup付きでバックアップ):
  python dedupe_words.py --in words_raw.txt --inplace
"""
import re, unicodedata, argparse, csv, shutil, sys
from collections import defaultdict
from pathlib import Path

def normalize_token(s: str) -> str:
    # 前後空白除去 + 全角/半角などを正規化（NFKC）
    return unicodedata.normalize("NFKC", s.strip())

def extract_word(line: str) -> str | None:
    """
    行から「単語本体」を取り出す。
    - 先頭に番号や記号があっても吸収: '123 語', '123. 語', '123,語', '123： 語' 等
    - CSVっぽい '123,語' の場合もOK
    - 番号が無く、単語だけの行もOK
    """
    line = normalize_token(line)
    if not line:
        return None
    # 先頭の番号+区切り（.,、,:：など）+空白 を取り除く
    m = re.match(r"^\d+\s*([.,、,:：]?\s*)?(.*)$", line)
    if m:
        word = m.group(2)
    else:
        # もし "番号,単語" 形式ならカンマで右側を採用
        if "," in line:
            parts = [p.strip() for p in line.split(",", 1)]
            if parts and parts[-1]:
                word = parts[-1]
            else:
                word = line
        else:
            word = line
    word = normalize_token(word)
    return word or None

def read_lines(path: Path) -> list[str]:
    try:
        with path.open("r", encoding="utf-8") as f:
            return [ln.rstrip("\n") for ln in f]
    except UnicodeDecodeError:
        # 万一の文字コード違いに備えて
        with path.open("r", encoding="utf-8-sig") as f:
            return [ln.rstrip("\n") for ln in f]

def write_txt(path: Path, words: list[str]):
    with path.open("w", encoding="utf-8") as f:
        for w in words:
            f.write(f"{w}\n")

def write_csv(path: Path, rows: list[tuple]):
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["word", "first_line", "duplicate_lines"])
        for row in rows:
            w.writerow(row)

def dedupe(lines: list[str]):
    seen = set()
    unique_words = []
    first_line_index = {}
    dups_map = defaultdict(list)  # word -> [dup_line_idx, ...]

    for idx, raw in enumerate(lines, start=1):
        w = extract_word(raw)
        if not w:
            continue
        if w not in seen:
            seen.add(w)
            unique_words.append(w)
            first_line_index[w] = idx
        else:
            dups_map[w].append(idx)
    # 重複一覧（単語, 最初の行, "dup1;dup2;..."）
    dup_rows = []
    for w, dup_idxs in dups_map.items():
        if dup_idxs:
            dup_rows.append((w, first_line_index[w], ";".join(map(str, dup_idxs))))
    # 最初に出てきた順に並べる
    dup_rows.sort(key=lambda r: r[1])
    return unique_words, dup_rows

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", required=True, help="入力テキスト（1行1項目）")
    ap.add_argument("--out", dest="outp", help="重複削除後の出力テキスト（任意）")
    ap.add_argument("--dups", dest="dups", default="duplicates.csv", help="重複レポートCSV（任意）")
    ap.add_argument("--inplace", action="store_true", help="同じファイルに上書き（元は .backup に退避）")
    args = ap.parse_args()

    inp = Path(args.inp)
    if not inp.exists():
        print(f"[ERROR] 入力が見つかりません: {inp}")
        sys.exit(1)

    lines = read_lines(inp)
    unique_words, dup_rows = dedupe(lines)

    if args.inplace:
        backup = inp.with_suffix(inp.suffix + ".backup")
        shutil.copyfile(inp, backup)
        write_txt(inp, unique_words)
        print(f"[OK] 上書き完了: {inp}（バックアップ: {backup.name}）")
    else:
        outp = Path(args.outp or "words_clean.txt")
        write_txt(outp, unique_words)
        print(f"[OK] 出力: {outp}（{len(unique_words)} 語）")

    dups_path = Path(args.dups)
    write_csv(dups_path, dup_rows)
    print(f"[OK] 重複レポート: {dups_path}（重複語数: {len(dup_rows)}）")

if __name__ == "__main__":
    main()
