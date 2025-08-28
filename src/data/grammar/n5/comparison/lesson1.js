// src/data/grammar/n5/comparison/lesson1.js

// ルビ用ショートカット
const R = {
  hon: "<ruby>本<rt>ほん</rt></ruby>",
  inu: "<ruby>犬<rt>いぬ</rt></ruby>",
  neko: "<ruby>猫<rt>ねこ</rt></ruby>",
  mise: "<ruby>店<rt>みせ</rt></ruby>",
  yasui: "<ruby>安<rt>やす</rt></ruby>い",
  takai: "<ruby>高<rt>たか</rt></ruby>い",
  fuyu: "<ruby>冬<rt>ふゆ</rt></ruby>",
  natsu: "<ruby>夏<rt>なつ</rt></ruby>",
  kurasu: "<ruby>クラス</ruby>",
  se: "<ruby>背<rt>せ</rt></ruby>",
  nihongo: "<ruby>日<rt>に</rt></ruby><ruby>本<rt>ほん</rt></ruby><ruby>語</ruby>",
  eigo: "<ruby>英<rt>えい</rt></ruby><ruby>語</ruby>",
  densha: "<ruby>電<rt>でん</rt></ruby><ruby>車<rt>しゃ</rt></ruby>",
  basu: "<ruby>バス</ruby>",
};

// ルビ入り固定選択肢
const CHOICES = {
  yori: "より",
  nohouga: "の<ruby>方<rt>ほう</rt></ruby>が",
  ichiban: "<ruby>一番<rt>いちばん</rt></ruby>",
  dochira: "どちら",
  to: "と",
  made: "まで",
  demo: "でも",
};

// Lesson1：名前付きエクスポート
export const n5ComparisonLesson1 = [
  {
    id: 1,
    sentence_ja: `この${R.hon}はその${R.hon} ___ おもしろいです。`,
    choices_ja: [CHOICES.yori, CHOICES.nohouga, CHOICES.ichiban, CHOICES.dochira],
    correct: 0,
  },
  {
    id: 2,
    sentence_ja: `${R.inu} ___ ${R.neko} ___ 好きです。`,
    choices_ja: [CHOICES.yori, CHOICES.nohouga, CHOICES.ichiban, CHOICES.dochira],
    correct: [0, 1],
  },
  {
    id: 3,
    sentence_ja: `${R.nihongo} ${CHOICES.to} ${R.eigo} ${CHOICES.to}、 ___ がむずかしいですか。`,
    choices_ja: [CHOICES.dochira, CHOICES.ichiban, CHOICES.yori, CHOICES.nohouga],
    correct: 0,
  },
  {
    id: 4,
    sentence_ja: `${R.kurasu}で、やまださんが ___ ${R.se}が${R.takai}です。`,
    choices_ja: [CHOICES.yori, CHOICES.nohouga, CHOICES.ichiban, CHOICES.dochira],
    correct: 2,
  },
  {
    id: 5,
    sentence_ja: `${R.mise}Aは${R.mise}B ___ ${R.yasui}です。`,
    choices_ja: [CHOICES.yori, CHOICES.to, CHOICES.demo, CHOICES.made],
    correct: 0,
  },
  {
    id: 6,
    sentence_ja: `${R.densha} ___ ${R.basu} ___ はやいです。`,
    choices_ja: [CHOICES.yori, CHOICES.nohouga, CHOICES.dochira, CHOICES.ichiban],
    correct: [0, 1],
  },
  {
    id: 7,
    sentence_ja: `${R.natsu}と${R.fuyu}と、 ___ が好きですか。`,
    choices_ja: [CHOICES.ichiban, CHOICES.dochira, CHOICES.yori, CHOICES.nohouga],
    correct: 1,
  },
  {
    id: 8,
    sentence_ja: `このスマホはそのスマホ ___ ${R.takai}です。`,
    choices_ja: [CHOICES.yori, CHOICES.nohouga, CHOICES.ichiban, CHOICES.to],
    correct: 0,
  },
  {
    id: 9,
    sentence_ja: `${R.inu} ___ ${R.neko} ___ かわいいとおもいます。`,
    choices_ja: [CHOICES.nohouga, CHOICES.yori, CHOICES.ichiban, CHOICES.dochira],
    correct: [1, 0],
  },
  {
    id: 10,
    sentence_ja: `三つの中で、このケーキが ___ おいしいです。`,
    choices_ja: [CHOICES.nohouga, CHOICES.yori, CHOICES.ichiban, CHOICES.dochira],
    correct: 2,
  },
];
