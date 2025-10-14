# -*- coding: utf-8 -*-
"""
merge_and_dedupe_words.py

複数の 1行1語 テキストを結合し、正規化→重複除去（初出優先・順序保持）して出力します。
- 見出し/区切り（N3, ↓n4, ## など）や行内コメントを無視
- 先頭の番号・箇条書き記号（例: "12. 森", "1、森", "1) 森"）を除去
- オプションで除外リスト（1行1語）を指定可能
"""

import sys
import re
import unicodedata
import pathlib
from typing import List, Dict

ROOT = pathlib.Path(__file__).resolve().parents[2]  # nihongo-app/
OUTDIR = ROOT / "src" / "data" / "output"
OUTDIR.mkdir(parents=True, exist_ok=True)

LEVEL_TAG_RE = re.compile(r'^\s*(?:n[1-5]|N[1-5])\s*[:：]?\s*$')
NUMBER_PREFIX_RE = re.compile(r'^\s*\d+\s*[\.\u3002\uFF0E\u3001、\)\]\-]?\s*')
INLINE_COMMENT_RE = re.compile(r'\s*(?:#|//).*$')

def norm(s: str) -> str:
    """NFKC正規化 + 前後空白除去 + 全角スペース→半角"""
    s = unicodedata.normalize("NFKC", (s or "")).replace("\u3000", " ")
    return s.strip()

def is_ignorable(raw: str) -> bool:
    """見出し/区切り線/空行などは無視"""
    if not raw or not raw.strip():
        return True
    s = raw.strip()
    if s.startswith(("↓", "─", "—", "-", "＝", "==", "##")):
        return True
    if LEVEL_TAG_RE.match(s):
        return True
    head = s.lower()
    if head in {"n1", "n2", "n3", "n4", "n5", "n1 nouns", "n2 nouns", "n3 nouns", "n4 nouns", "n5 nouns"}:
        return True
    if head.startswith("section ") or head.endswith(" nouns"):
        return True
    return False

def clean_token(raw: str) -> str:
    """行内コメント除去 + 番号/箇条書き除去 + 正規化"""
    s = INLINE_COMMENT_RE.sub("", raw or "")
    s = norm(s)
    s = NUMBER_PREFIX_RE.sub("", s)
    s = norm(s)
    return s

def read_lines(path: pathlib.Path) -> List[str]:
    txt = path.read_text(encoding="utf-8", errors="ignore")
    return txt.splitlines()

def load_excludes(ex_file: pathlib.Path) -> set:
    ex = set()
    for raw in read_lines(ex_file):
        w = clean_token(raw)
        if w:
            ex.add(w)
    return ex

def pretty_path(p: pathlib.Path) -> str:
    """ROOT基準の相対表記を試み、無理なら絶対パスを返す"""
    try:
        return str(p.resolve().relative_to(ROOT))
    except Exception:
        return str(p.resolve())

def main():
    # 使い方
    if len(sys.argv) < 2:
        print("usage: python src/data-tools/merge_and_dedupe_words.py <input1.txt> [input2.txt ...] [--exclude exclude.txt] [--out out.txt] [--report report.txt]")
        sys.exit(1)

    # 引数パース
    args = sys.argv[1:]
    out_path = OUTDIR / "nouns_unique.txt"
    report_path = OUTDIR / "report.txt"
    exclude_path = None

    inputs = []
    i = 0
    while i < len(args):
        a = args[i]
        if a == "--exclude" and i + 1 < len(args):
            exclude_path = pathlib.Path(args[i + 1]); i += 2
        elif a == "--out" and i + 1 < len(args):
            out_path = pathlib.Path(args[i + 1]); i += 2
        elif a == "--report" and i + 1 < len(args):
            report_path = pathlib.Path(args[i + 1]); i += 2
        else:
            inputs.append(pathlib.Path(a)); i += 1

    if not inputs:
        print("❌ no input files")
        sys.exit(1)

    # 入力の存在確認
    missing = [p for p in inputs if not p.exists()]
    if missing:
        for m in missing:
            print(f"⚠️  not found: {m}")
        # 進めるが、存在するファイルのみ処理
        inputs = [p for p in inputs if p.exists()]
        if not inputs:
            print("❌ no existing input files")
            sys.exit(1)

    # 除外リスト読み込み
    excludes = set()
    if exclude_path:
        if exclude_path.exists():
            excludes = load_excludes(exclude_path)
        else:
            print(f"⚠️  exclude not found: {exclude_path}")

    # 集計
    seen = set()
    kept: List[str] = []
    stats: Dict[str, Dict[str, int]] = {}

    total = 0
    ignored = 0
    cleaned_empty = 0
    removed_duplicates = 0
    removed_excluded = 0

    for path in inputs:
        stats[path.name] = {"lines": 0, "kept": 0, "excluded": 0, "dup": 0, "ignored": 0, "empty": 0}
        for raw in read_lines(path):
            total += 1
            stats[path.name]["lines"] += 1
            if is_ignorable(raw):
                ignored += 1
                stats[path.name]["ignored"] += 1
                continue
            w = clean_token(raw)
            if not w:
                cleaned_empty += 1
                stats[path.name]["empty"] += 1
                continue
            if w in excludes:
                removed_excluded += 1
                stats[path.name]["excluded"] += 1
                continue
            if w in seen:
                removed_duplicates += 1
                stats[path.name]["dup"] += 1
                continue
            seen.add(w)
            kept.append(w)
            stats[path.name]["kept"] += 1

    # 出力
    out_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(kept), encoding="utf-8")

    rep = []
    rep.append("=== merge_and_dedupe_words.py REPORT ===")
    rep.append("Inputs: " + ", ".join(p.name for p in inputs))
    if exclude_path:
        rep.append(f"Exclude: {exclude_path.name} ({len(excludes)} words)")
    rep.append("")
    rep.append(f"Total (input lines): {total}")
    rep.append(f"Ignored (headers/separators): {ignored}")
    rep.append(f"Empty after clean: {cleaned_empty}")
    rep.append(f"Removed (duplicates): {removed_duplicates}")
    rep.append(f"Removed (excluded): {removed_excluded}")
    rep.append(f"Unique kept: {len(kept)}")
    rep.append("")
    rep.append("--- Per file ---")
    for name, st in stats.items():
        rep.append(f"{name}: lines={st['lines']}, kept={st['kept']}, excluded={st['excluded']}, dup={st['dup']}, ignored={st['ignored']}, empty={st['empty']}")
    report_path.write_text("\n".join(rep), encoding="utf-8")

    print("✅ Done.")
    print("   outputs:")
    print("  -", pretty_path(out_path))
    print("  -", pretty_path(report_path))
    print("   abs paths:")
    print("  -", out_path.resolve())
    print("  -", report_path.resolve())

if __name__ == "__main__":
    main()
