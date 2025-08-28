// src/data/grammar/n5/intent-plan/lesson1.js
export const n5IntentPlanLesson1 = [
  // たいです
  {
    id: 101,
    sentence_ja: "<ruby>今日<rt>きょう</rt></ruby>、ケーキを<ruby>食<rt>た</rt></ruby>べ___。",
    choices_ja: ["たいです", "予定です", "でしょう", "つもりです"],
    correct: 0,
  },
  {
    id: 102,
    sentence_ja:
      "<ruby>日曜<rt>にちよう</rt></ruby><ruby>日<rt>び</rt></ruby>は <ruby>新<rt>あたら</rt></ruby>しいゲームで<ruby>遊<rt>あそ</rt></ruby>び___。",
    choices_ja: ["たいです", "予定です", "でしょう", "つもりです"],
    correct: 0,
  },

  // つもりです（予定は入れない）
  {
    id: 103,
    sentence_ja: "毎日、<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>する___。",
    choices_ja: ["つもりです", "たいです", "でしょう", "ましょう"],
    correct: 0,
  },
  {
    id: 104,
    sentence_ja: "<ruby>試験<rt>しけん</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>にたくさん<ruby>復習<rt>ふくしゅう</rt></ruby>する___。",
    choices_ja: ["つもりです", "たいです", "でしょう", "ませんか"],
    correct: 0,
  },

  // 予定です（つもりは入れない）
  {
    id: 105,
    sentence_ja: "<ruby>明日<rt>あした</rt></ruby>、<ruby>先生<rt>せんせい</rt></ruby>と<ruby>会<rt>あ</rt></ruby>う___。",
    choices_ja: ["予定です", "たいです", "でしょう", "ましょう"],
    correct: 0,
  },
  {
    id: 106,
    sentence_ja: "<ruby>来週<rt>らいしゅう</rt></ruby>の<ruby>土曜日<rt>どようび</rt></ruby>にパーティーに<ruby>行<rt>い</rt></ruby>く___。",
    choices_ja: ["予定です", "たいです", "でしょう", "ませんか"],
    correct: 0,
  },

  // ましょう／ませんか（たいは入れない）
  {
    id: 107,
    sentence_ja: "いっしょに<ruby>宿題<rt>しゅくだい</rt></ruby>をやり___。",
    choices_ja: ["ましょう", "予定です", "でしょう", "つもりです"],
    correct: 0,
  },
  {
    id: 108,
    sentence_ja: "<ruby>今度<rt>こんど</rt></ruby>、<ruby>公園<rt>こうえん</rt></ruby>で<ruby>写真<rt>しゃしん</rt></ruby>をとり___。",
    choices_ja: ["ませんか", "予定です", "でしょう", "つもりです"],
    correct: 0,
  },

  // でしょう
  {
    id: 109,
    sentence_ja: "<ruby>明日<rt>あした</rt></ruby>は<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>る___。",
    choices_ja: ["でしょう", "たいです", "予定です", "ましょう"],
    correct: 0,
  },
  {
    id: 110,
    sentence_ja: "<ruby>今夜<rt>こんや</rt></ruby>は<ruby>寒<rt>さむ</rt></ruby>くなる___。",
    choices_ja: ["でしょう", "たいです", "予定です", "つもりです"],
    correct: 0,
  },
];
