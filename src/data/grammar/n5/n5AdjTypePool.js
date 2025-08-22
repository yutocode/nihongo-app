// 二択判定クイズ用：N5中心の形容詞プール
// type: "i" = い形容詞, "na" = な形容詞
// 補助: "i_opt" = 余力用い形容詞, "na_hint" = 誤学習防止ヒント

export const n5AdjTypePool = [
  // ---- い形容詞 ----
  { id: "i-01", word: "あつい（暑い／熱い）", yomi: "あつい", type: "i" },
  { id: "i-02", word: "さむい（寒い）", yomi: "さむい", type: "i" },
  { id: "i-03", word: "たかい（高い）", yomi: "たかい", type: "i" },
  { id: "i-04", word: "ひくい（低い）", yomi: "ひくい", type: "i" },
  { id: "i-05", word: "おおきい（大きい）", yomi: "おおきい", type: "i" },
  { id: "i-06", word: "ちいさい（小さい）", yomi: "ちいさい", type: "i" },
  { id: "i-07", word: "ながい（長い）", yomi: "ながい", type: "i" },
  { id: "i-08", word: "みじかい（短い）", yomi: "みじかい", type: "i" },
  { id: "i-09", word: "あたらしい（新しい）", yomi: "あたらしい", type: "i" },
  { id: "i-10", word: "ふるい（古い）", yomi: "ふるい", type: "i" },
  { id: "i-11", word: "やすい（安い）", yomi: "やすい", type: "i" },
  { id: "i-12", word: "たのしい（楽しい）", yomi: "たのしい", type: "i" },
  { id: "i-13", word: "いそがしい（忙しい）", yomi: "いそがしい", type: "i" },
  { id: "i-14", word: "むずかしい（難しい）", yomi: "むずかしい", type: "i" },

  // 誤学習防止ヒント（選択肢には使わないならフィルタ可能）
  { id: "i-15", word: "かんたんだ（×）→かんたん は“な”", yomi: "かんたん", type: "na_hint" },

  { id: "i-16", word: "おもしろい", yomi: "おもしろい", type: "i" },
  { id: "i-17", word: "つまらない", yomi: "つまらない", type: "i" },
  { id: "i-18", word: "いたい（痛い）", yomi: "いたい", type: "i" },
  { id: "i-19", word: "こわい（怖い）", yomi: "こわい", type: "i" },
  { id: "i-20", word: "すごい", yomi: "すごい", type: "i" },
  { id: "i-21", word: "おいしい", yomi: "おいしい", type: "i" },
  { id: "i-22", word: "にがい（苦い）", yomi: "にがい", type: "i" },
  { id: "i-23", word: "からい（辛い）", yomi: "からい", type: "i" },
  { id: "i-24", word: "すっぱい（酸っぱい）", yomi: "すっぱい", type: "i" },
  { id: "i-25", word: "しょっぱい", yomi: "しょっぱい", type: "i" },
  { id: "i-26", word: "あまい（甘い）", yomi: "あまい", type: "i" },
  { id: "i-27", word: "はやい（早い／速い）", yomi: "はやい", type: "i" },
  { id: "i-28", word: "おそい（遅い）", yomi: "おそい", type: "i" },

  // 余力用
  { id: "i-29", word: "たのもしい（N5外より）", yomi: "たのもしい", type: "i_opt" },

  // ---- な形容詞 ----
  { id: "na-01", word: "しずか（静か）", yomi: "しずか", type: "na" },
  { id: "na-02", word: "にぎやか", yomi: "にぎやか", type: "na" },
  { id: "na-03", word: "きれい", yomi: "きれい", type: "na" },
  { id: "na-04", word: "べんり（便利）", yomi: "べんり", type: "na" },
  { id: "na-05", word: "ゆうめい（有名）", yomi: "ゆうめい", type: "na" },
  { id: "na-06", word: "かんたん（簡単）", yomi: "かんたん", type: "na" },
  { id: "na-07", word: "げんき（元気）", yomi: "げんき", type: "na" },
  { id: "na-08", word: "ひま（暇）", yomi: "ひま", type: "na" },
  { id: "na-09", word: "じょうず（上手）", yomi: "じょうず", type: "na" },
  { id: "na-10", word: "へた（下手）", yomi: "へた", type: "na" },
  { id: "na-11", word: "すき（好き）", yomi: "すき", type: "na" },
  { id: "na-12", word: "きらい（嫌い）", yomi: "きらい", type: "na" },
  { id: "na-13", word: "たいへん（大変）", yomi: "たいへん", type: "na" },
  { id: "na-14", word: "たいせつ（大切）", yomi: "たいせつ", type: "na" },
  { id: "na-15", word: "あんぜん（安全）", yomi: "あんぜん", type: "na" },
];
