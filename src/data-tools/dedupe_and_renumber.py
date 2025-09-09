# -*- coding: utf-8 -*-
"""
1800語から重複を削除して 1 から番号を振り直す（自動追加はしない）
出力:
- unique_renumbered.txt  ...  "1 語" 形式
- unique_renumbered.csv  ...  index,word
- duplicates.csv          ...  word,first_line,duplicate_lines

使い方:
  python dedupe_and_renumber.py --in all_words_raw.txt
"""
import re, unicodedata, argparse, csv, sys
from collections import defaultdict
from pathlib import Path

def norm(s: str) -> str:
    return unicodedata.normalize("NFKC", s.strip())

def extract_word(line: str) -> str | None:
    """
    行から単語本体を取り出す。
    - '123 語' / '123. 語' / '123,語' / '123： 語' 等の番号・区切りは無視
    - 単語だけの行にも対応
    """
    line = norm(line)
    if not line:
        return None
    m = re.match(r"^\d+\s*([.,、,:：]?\s*)?(.*)$", line)
    if m:
        word = m.group(2)
    else:
        if "," in line:  # "123,語" のようなCSV風
            word = line.split(",", 1)[-1].strip()
        else:
            word = line
    word = norm(word)
    return word or None

def read_lines(path: Path) -> list[str]:
    # UTF-8 / UTF-8 BOM の両方に耐性
    try:
        return [ln.rstrip("\n") for ln in path.open("r", encoding="utf-8")]
    except UnicodeDecodeError:
        return [ln.rstrip("\n") for ln in path.open("r", encoding="utf-8-sig")]

def write_txt(path: Path, rows: list[tuple[int,str]]):
    with path.open("w", encoding="utf-8") as f:
        for idx, w in rows:
            f.write(f"{idx} {w}\n")

def write_csv(path: Path, rows: list[tuple[int,str]], header=("index","word")):
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(header); w.writerows(rows)

def write_dup_csv(path: Path, dup_rows: list[tuple[str,int,str]]):
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["word","first_line","duplicate_lines"])
        w.writerows(dup_rows)

def dedupe_and_report(lines: list[str]):
    seen = set()
    unique = []
    first_idx = {}
    dup_map = defaultdict(list)
    for i, raw in enumerate(lines, start=1):
        w = extract_word(raw)
        if not w:
            continue
        if w not in seen:
            seen.add(w)
            unique.append(w)
            first_idx[w] = i
        else:
            dup_map[w].append(i)
    dup_rows = []
    for w, dups in dup_map.items():
        if dups:
            dup_rows.append((w, first_idx[w], ";".join(map(str, dups))))
    dup_rows.sort(key=lambda r: r[1])
    return unique, dup_rows

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", required=True, help="1800語の入力TXT（1行1語。番号付きでもOK）")
    args = ap.parse_args()

    inp = Path(args.inp)
    if not inp.exists():
        print(f"[ERROR] 入力が見つかりません: {inp}"); sys.exit(1)

    lines = read_lines(inp)
    unique, dup_rows = dedupe_and_report(lines)

    # 1から再番号
    renum = [(i, w) for i, w in enumerate(unique, start=1)]

    # 出力
    write_txt(Path("unique_renumbered.txt"), renum)
    write_csv(Path("unique_renumbered.csv"), renum)
    write_dup_csv(Path("duplicates.csv"), dup_rows)

    total_in = sum(1 for ln in lines if extract_word(ln))
    total_out = len(unique)
    removed = total_in - total_out
    shortage = max(0, 1800 - total_out)  # 目標1800想定の不足数

    print(f"[OK] 入力語数（有効行）: {total_in}")
    print(f"[OK] 重複削除後: {total_out} 語（-{removed}）")
    print(f"[OK] 1 から再番号を付与 → unique_renumbered.txt / .csv")
    print(f"[OK] 重複レポート: duplicates.csv（重複語数: {len(dup_rows)}）")
    print(f"[INFO] 目標1800としての不足数: {shortage}")

if __name__ == "__main__":
    main()
