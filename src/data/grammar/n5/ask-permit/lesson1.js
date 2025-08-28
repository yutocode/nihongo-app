// src/data/grammar/n5/ask-permit/lesson1.js
export const n5AskPermitLesson1 = [
  // 依頼形
  {
    id: 101,
    form: "request",
    sentence_ja: "<ruby>窓<rt>まど</rt></ruby>を あけ___。",
    choices_ja: ["てください", "てもいいですか", "てはいけません", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 102,
    form: "request",
    sentence_ja: "<ruby>電気<rt>でんき</rt></ruby>を けし___。",
    choices_ja: ["てください", "てもいいですか", "なければなりません", "てはいけません"],
    correct: 0,
  },

  // 許可形
  {
    id: 103,
    form: "permission",
    sentence_ja: "ここで <ruby>写真<rt>しゃしん</rt></ruby>を とっ___？",
    choices_ja: ["てもいいですか", "てください", "てはいけません", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 104,
    form: "permission",
    sentence_ja: "<ruby>教室<rt>きょうしつ</rt></ruby>に <ruby>入<rt>はい</rt></ruby>っ___？",
    choices_ja: ["てもいいですか", "なければなりません", "てください", "てはいけません"],
    correct: 0,
  },

  // 禁止形
  {
    id: 105,
    form: "prohibition",
    sentence_ja: "<ruby>図書館<rt>としょかん</rt></ruby>で <ruby>大<rt>おお</rt></ruby>きい <ruby>声<rt>こえ</rt></ruby>で <ruby>話<rt>はな</rt></ruby>し___。",
    choices_ja: ["てはいけません", "てもいいですか", "てください", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 106,
    form: "prohibition",
    sentence_ja: "<ruby>教室<rt>きょうしつ</rt></ruby>で <ruby>食<rt>た</rt></ruby>べ<ruby>物<rt>もの</rt></ruby>を <ruby>食<rt>た</rt></ruby>べ___。",
    choices_ja: ["てはいけません", "てもいいですか", "なければなりません", "てください"],
    correct: 0,
  },

  // 義務形
  {
    id: 107,
    form: "obligation",
    sentence_ja: "<ruby>宿題<rt>しゅくだい</rt></ruby>を <ruby>今日<rt>きょう</rt></ruby>のうちに し___。",
    choices_ja: ["なければなりません", "なくてもいいです", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 108,
    form: "obligation",
    sentence_ja: "<ruby>明日<rt>あした</rt></ruby>の テストに <ruby>鉛筆<rt>えんぴつ</rt></ruby>を <ruby>持<rt>も</rt></ruby>って <ruby>行<rt>い</rt></ruby>か___。",
    choices_ja: ["なければなりません", "てはいけません", "てもいいですか", "なくてもいいです"],
    correct: 0,
  },

  // 不要形
  {
    id: 109,
    form: "unnecessary",
    sentence_ja: "<ruby>靴<rt>くつ</rt></ruby>を <ruby>脱<rt>ぬ</rt></ruby>が___。 そのままで <ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。",
    choices_ja: ["なくてもいいです", "なければなりません", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 110,
    form: "unnecessary",
    sentence_ja: "かばんを <ruby>持<rt>も</rt></ruby>って <ruby>来<rt>こ</rt></ruby>なくても <ruby>学校<rt>がっこう</rt></ruby>に <ruby>行<rt>い</rt></ruby>けます。だから <ruby>持<rt>も</rt></ruby>って <ruby>来<rt>き</rt></ruby>___。",
    choices_ja: ["なくてもいいです", "てはいけません", "てもいいですか", "てください"],
    correct: 0,
  },
];
