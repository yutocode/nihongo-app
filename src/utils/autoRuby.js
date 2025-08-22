// src/utils/autoRuby.js
// 「漢字だけにルビ」を付けるユーティリティ（連続漢字ブロック対応）

const KANJI_RX = /[\u4E00-\u9FFF]/;
const isKanji = (ch) => KANJI_RX.test(ch);

// "<ruby>飲<rt>の</rt></ruby>む" → "飲む"
export function stripRuby(html) {
  if (typeof html !== "string") return html ?? "";
  // <ruby>飲<rt>の</rt></ruby> → 飲
  let s = html.replace(/<ruby>(.*?)<rt>.*?<\/rt><\/ruby>/g, "$1");
  // 念のため個別タグも除去
  s = s.replace(/<\/?rb>|<\/?rt>|<\/?ruby>/g, "");
  return s;
}

/** 文字列を「漢字ブロック / 非漢字ブロック」に分割 */
function splitKanjiBlocks(str) {
  const arr = Array.from(str || "");
  const blocks = [];
  if (!arr.length) return blocks;

  let cur = { text: arr[0], isKanji: isKanji(arr[0]) };
  for (let i = 1; i < arr.length; i++) {
    const ch = arr[i];
    const k = isKanji(ch);
    if (k === cur.isKanji) {
      cur.text += ch;
    } else {
      blocks.push(cur);
      cur = { text: ch, isKanji: k };
    }
  }
  blocks.push(cur);
  return blocks;
}

/**
 * base と yomi をざっくり合わせて、漢字ブロックに読みを割り当てる
 * 例: base="財布の中に1000円", yomi="さいふのなかにせんえん"
 *  → ["財布"(さいふ)] ["の"] ["中"(なか)] ["に"] ["1000"] ["円"(えん)]
 */
function assignYomiToKanjiBlocks(base, yomi) {
  const blocks = splitKanjiBlocks(base);
  const ys = Array.from(yomi || "");
  let k = 0;

  return blocks.map((b) => {
    if (!b.isKanji) {
      // 非漢字ブロックは読みを消費しないが、「同じ文字が連続」するなら同期を試みる
      const text = b.text;
      for (let i = 0; i < text.length && k < ys.length; i++) {
        if (ys[k] === text[i]) k++; else break;
      }
      return { t: text }; // 読みは付けない
    }

    // 次に来る非漢字ブロックの最初の1文字を“境界マーカー”として探す
    // 例: 「財布の」なら境界は「の」
    let boundary = null;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].isKanji === false) {
        // より先の境界で、今のブロックより後にある最初の非漢字ブロック
        // → 呼び出し側で現在ブロック位置を渡さないので、この関数では最初の非漢字を使う簡易版
        boundary = blocks[i].text[0] || null;
        break;
      }
    }

    let reading = "";
    if (boundary) {
      let p = k;
      while (p < ys.length && ys[p] !== boundary) p++;
      reading = ys.slice(k, p).join("");
      k = p; // boundary は非漢字側で消費させる
    } else {
      // 文末まで読みを全部割り当て
      reading = ys.slice(k).join("");
      k = ys.length;
    }

    // 漢字ブロック全体に読み（単漢字ごとの割り振りはしない＝「財布」に「さいふ」のようにブロック単位）
    return reading ? { t: b.text, r: reading } : { t: b.text };
  });
}

/**
 * 自動ルビ化の最終API
 * - kanjiOnly=true: {segments:[{t, r?}...]} を返す（連続漢字はブロック単位）
 * - kanjiOnly=false: {text, ruby}（全文にふりがな）
 * - options.preserveMarker: ベース中の「＿＿」をマーカー退避/復元（ページ側でやっているなら false のままでOK）
 */
export function makeRubyValue(baseText, yomi, { kanjiOnly = true, preserveMarker = false } = {}) {
  if (!baseText || !yomi) return baseText;

  let base = String(baseText);
  let yom  = String(yomi);

  let marker = null;
  if (preserveMarker) {
    marker = "◻◻";
    base = base.replace(/＿+/g, marker);
    yom  = yom.replace(/＿+/g, marker);
  }

  if (!kanjiOnly) {
    // 全文ルビ（念のためマーカー復元）
    const res = { text: base, ruby: yom };
    if (preserveMarker) {
      res.text = res.text.replaceAll(marker, "＿＿");
      res.ruby = res.ruby.replaceAll(marker, "＿＿");
    }
    return res;
  }

  // 連続漢字ブロック単位で割り当て
  const segs = assignYomiToKanjiBlocks(base, yom);

  // マーカー復元
  if (preserveMarker && Array.isArray(segs)) {
    for (const s of segs) {
      s.t = s.t.replaceAll(marker, "＿＿");
      if (s.r) s.r = s.r.replaceAll(marker, "＿＿");
    }
  }

  return { segments: segs };
}
