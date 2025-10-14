// src/data/dictionary/globalDict.js
// ❶ Vite の import.meta.glob で WordSets を一括読込（パスはあなたの構成に合わせて調整）
const modules = import.meta.glob("../n*WordSets/**/*.js", { eager: true });

const _cache = { full: null };

/** 言語キーの正規化: i18n.language → story用キー（tw/zh/en/ko/vi/th/my/ja） */
export function pickLangKey(lng) {
  const l = String(lng || "").toLowerCase();
  if (l.startsWith("zh-tw") || l === "tw") return "tw";
  if (l.startsWith("zh")) return "zh";
  if (l.startsWith("en")) return "en";
  if (l.startsWith("ko")) return "ko";
  if (l.startsWith("vi")) return "vi";
  if (l.startsWith("th")) return "th";
  if (l.startsWith("my")) return "my";
  return "ja";
}

function buildOnce() {
  const dict = {}; // word → entry（多言語を含む）

  // WordSets は { LessonX: [ { kanji, reading, meanings:{en,tw,zh,...} } ] } 形式を想定
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
