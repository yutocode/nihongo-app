// src/data/dictionary/globalDict.js
// ❶ Vite の import.meta.glob で WordSets を一括読込（パスはあなたの構成に合わせて調整）
const modules = import.meta.glob("../n*WordSets/**/*.js", { eager: true });

const _cache = { full: null };

/** 言語キーの正規化: i18n.language → story用キー（ja/en/zh/tw/id/ko/vi/th/my/km） */
export function pickLangKey(lng) {
  const l = String(lng || "").toLowerCase();

  // 先に繁体（台湾華語）を判定
  if (l === "tw" || l.startsWith("zh-tw") || l.startsWith("zh_hant") || l.includes("hant")) return "tw";

  // 中国語（簡体）
  if (l === "zh" || l.startsWith("zh")) return "zh";

  // 英語
  if (l === "en" || l.startsWith("en-")) return "en";

  // インドネシア語
  if (l === "id" || l.startsWith("id-")) return "id";

  // 韓国語
  if (l === "ko" || l.startsWith("ko-")) return "ko";

  // ベトナム語
  if (l === "vi" || l.startsWith("vi-")) return "vi";

  // タイ語
  if (l === "th" || l.startsWith("th-")) return "th";

  // ビルマ語（ミャンマー語）
  if (l === "my" || l.startsWith("my-") || l.startsWith("my_mm")) return "my";

  // クメール語（カンボジア語）
  if (l === "km" || l.startsWith("km-")) return "km";

  // 既定は日本語
  return "ja";
}

function buildOnce() {
  const dict = {}; // word → entry（多言語を含む）

  // WordSets は { LessonX: [ { kanji, reading, meanings:{ja,en,zh,tw,id,ko,vi,th,my,km} } ] } 形式を想定
  Object.values(modules).forEach((mod) => {
    // 各モジュールの全エクスポートを見る（n5part_adverbs1 などの名前は任意）
    Object.values(mod).forEach((exported) => {
      if (!exported || typeof exported !== "object") return;

      // exported = { Lesson10: [ ... ], Lesson11: [ ... ] } の想定
      Object.values(exported).forEach((arr) => {
        if (!Array.isArray(arr)) return;

        arr.forEach((item) => {
          // 表記は kanji（なければ reading）を優先キーに
          const surface = item.kanji || item.reading;
          if (!surface) return;

          const entry = {
            // 多言語訳（meanings に入っているキーをそのまま採用）
            ...(item.meanings || {}),
            // 参考表示用
            ja: item.kanji || item.reading,
            reading: item.reading || null,
          };

          // 代表キー
          dict[surface] = entry;

          // よみでも引けるように alias を追加（表記揺れ対策）
          if (item.reading && item.reading !== surface) {
            dict[item.reading] = entry;
          }
        });
      });
    });
  });

  return dict;
}

/** ❷ 5000語まとめた「共通辞書」を返す（初回だけビルドしてキャッシュ） */
export function getGlobalDict() {
  if (!_cache.full) _cache.full = buildOnce();
  return _cache.full;
}

/**（任意）言語別に簡易ビューを作りたい場合 */
export function getDictForLang(langKey) {
  const full = getGlobalDict();
  const out = {};
  for (const [w, entry] of Object.entries(full)) {
    out[w] = entry; // WordPopup 側で lang に応じて抽出表示するのでそのまま渡す
  }
  return out;
}
