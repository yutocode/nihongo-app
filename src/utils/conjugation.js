// src/utils/conjugation.js
// N5レベル想定の簡易活用（五段・一段・不規則）
// 対応: plain, masu, past-plain, neg-plain, te, volitional

const HEPBURN = { う:"u", く:"ku", ぐ:"gu", す:"su", つ:"tsu", ぬ:"nu", ぶ:"bu", む:"mu", る:"ru" };
const GODAN_ENDINGS = Object.keys(HEPBURN);

// N5で頻出の一段をホワイトリスト（必要に応じて拡張）
const KNOWN_ICHIDAN = new Set([
  "見る","みる","着る","きる","借りる","かりる","信じる","しんじる","起きる","おきる",
  "落ちる","おちる","浴びる","あびる","できる","食べる","たべる","寝る","ねる",
  "教える","おしえる","開ける","あける","閉める","しめる","始める","はじめる",
  "集める","あつめる","覚える","おぼえる","忘れる","わすれる","考える","かんがえる",
]);

function isIchidan(base) {
  if (KNOWN_ICHIDAN.has(base)) return true;
  if (!base.endsWith("る")) return false;
  const pre = base.slice(-2, -1);
  const ei = "えけげせぜてでねへべめれいきぎしじちぢにひびみり".split("");
  return ei.includes(pre);
}
const isSuru = (b) => b === "する";
const isKuru = (b) => b === "来る" || b === "くる";
const isIku  = (b) => b.endsWith("行く") || b.endsWith("いく");

function classify(base) {
  if (isSuru(base)) return "suru";
  if (isKuru(base)) return "kuru";
  if (isIchidan(base)) return "ichidan";
  return "godan";
}

const stemIchidan = (base) => base.slice(0, -1); // 食べる→食べ
const stemGodan   = (base) => ({ root: base.slice(0, -1), end: base.slice(-1) });

// 五段：辞書形語尾 → い段
const GODAN_TO_I  = { う:"い",く:"き",ぐ:"ぎ",す:"し",つ:"ち",ぬ:"に",ぶ:"び",む:"み",る:"り" };
// 五段：て形
const GODAN_TE    = { う:"って",つ:"って",る:"って", む:"んで",ぶ:"んで",ぬ:"んで", く:"いて",ぐ:"いで", す:"して" };
// 五段：た形
const GODAN_TA    = { う:"った",つ:"った",る:"った", む:"んだ",ぶ:"んだ",ぬ:"んだ", く:"いた",ぐ:"いだ", す:"した" };
// 五段：未然＋ない
const GODAN_TO_A  = { う:"わ",く:"か",ぐ:"が",す:"さ",つ:"た",ぬ:"な",ぶ:"ば",む:"ま",る:"ら" };
// 五段：意向
const GODAN_VOL   = { う:"おう",く:"こう",ぐ:"ごう",す:"そう",つ:"とう",ぬ:"のう",ぶ:"ぼう",む:"もう",る:"ろう" };

export const TARGETS = ["plain","masu","past-plain","neg-plain","te","volitional"];

// 「行く／いく」例外（て/た/意向）
function replaceIku(base, kind) {
  if (base.endsWith("行く")) {
    if (kind === "te")  return base.replace(/行く$/, "行って");
    if (kind === "past")return base.replace(/行く$/, "行った");
    if (kind === "vol") return base.replace(/行く$/, "行こう");
  } else if (base.endsWith("いく")) {
    if (kind === "te")  return base.replace(/いく$/, "いって");
    if (kind === "past")return base.replace(/いく$/, "いった");
    if (kind === "vol") return base.replace(/いく$/, "いこう");
  }
  return base;
}

export function conjugate(base, target) {
  const kind = classify(base);
  if (target === "plain") return base;

  // する・来る
  if (kind === "suru") {
    switch (target) {
      case "masu": return "します";
      case "past-plain": return "した";
      case "neg-plain": return "しない";
      case "te": return "して";
      case "volitional": return "しよう";
      default: return base;
    }
  }
  if (kind === "kuru") {
    switch (target) {
      case "masu": return "来ます";
      case "past-plain": return "来た";
      case "neg-plain": return "来ない";
      case "te": return "来て";
      case "volitional": return "来よう";
      default: return "来る";
    }
  }

  // 一段
  if (kind === "ichidan") {
    const s = stemIchidan(base);
    switch (target) {
      case "masu": return s + "ます";
      case "past-plain": return s + "た";
      case "neg-plain": return s + "ない";
      case "te": return s + "て";
      case "volitional": return s + "よう";
      default: return base;
    }
  }

  // 五段
  const { root, end } = stemGodan(base);
  if (!GODAN_ENDINGS.includes(end)) return base;

  if (isIku(base)) {
    if (target === "te")         return replaceIku(base, "te");
    if (target === "past-plain") return replaceIku(base, "past");
    if (target === "volitional") return replaceIku(base, "vol");
  }

  switch (target) {
    case "masu":       return root + GODAN_TO_I[end] + "ます";
    case "past-plain": return root + GODAN_TA[end];
    case "neg-plain":  return root + GODAN_TO_A[end] + "ない";
    case "te":         return root + GODAN_TE[end];
    case "volitional": return root + GODAN_VOL[end];
    default:           return base;
  }
}

/* ───── 誤選択肢生成 ───── */

function filterCommonWrongForms(list) {
  // よく目にする不自然・誤形はここで全カット
  const drop = new Set([
    "歩って","出らない","出って","出った","働った","働って",
  ]);
  return list.filter(x => x && !drop.has(x));
}

export function generateDistractors(base, correctTarget, k = 3) {
  const out = new Set();
  const correct = conjugate(base, correctTarget);
  const kind = classify(base);

  // 他ターゲットの正解形を混ぜる（自然な紛れ）
  for (const t of TARGETS) {
    if (t !== correctTarget) out.add(conjugate(base, t));
  }

  // 紛らわしい“連用形”は自然なものだけ
  if (kind === "godan") {
    const { root, end } = stemGodan(base);
    out.add(root + GODAN_TO_I[end]); // 読み／書き／働き（自然）
  } else if (kind === "ichidan") {
    const s = stemIchidan(base);
    // 語幹だけ（見・食べ）は出さない。代わりに自然な形を補う
    if (correctTarget !== "masu")       out.add(s + "ます");
    if (correctTarget !== "volitional") out.add(s + "よう");
    if (correctTarget !== "te")         out.add(s + "て");
    if (correctTarget !== "past-plain") out.add(s + "た");
    if (correctTarget !== "neg-plain")  out.add(s + "ない");
  }

  // 重複と正解を除去
  let cand = Array.from(out).filter(v => v && v !== correct);

  // 不自然・誤形を除外
  cand = filterCommonWrongForms(cand);

  // シャッフル → 上位k件
  for (let i = cand.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cand[i], cand[j]] = [cand[j], cand[i]];
  }
  return cand.slice(0, k);
}

/* ユーティリティ */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}