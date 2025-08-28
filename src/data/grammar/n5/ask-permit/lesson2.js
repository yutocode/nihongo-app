// src/data/grammar/n5/ask-permit/lesson2.js
export const n5AskPermitLesson2 = [
  // 依頼形
  {
    id: 201,
    form: "request",
    sentence_ja: "<ruby>本<rt>ほん</rt></ruby>を とじ___。",
    choices_ja: ["てください", "てもいいですか", "なければなりません", "てはいけません"],
    correct: 0,
  },
  {
    id: 202,
    form: "request",
    sentence_ja: "<ruby>名前<rt>なまえ</rt></ruby>を ここに <ruby>書<rt>か</rt></ruby>い___。",
    choices_ja: ["てください", "なくてもいいです", "てもいいですか", "てはいけません"],
    correct: 0,
  },

  // 許可形
  {
    id: 203,
    form: "permission",
    sentence_ja: "<ruby>窓<rt>まど</rt></ruby>を しめ___？",
    choices_ja: ["てもいいですか", "てください", "なければなりません", "てはいけません"],
    correct: 0,
  },
  {
    id: 204,
    form: "permission",
    sentence_ja: "<ruby>電話<rt>でんわ</rt></ruby>を つかっ___？",
    choices_ja: ["てもいいですか", "なくてもいいです", "てください", "てはいけません"],
    correct: 0,
  },

  // 禁止形
  {
    id: 205,
    form: "prohibition",
    sentence_ja: "ここで たばこを <ruby>吸<rt>す</rt></ruby>っ___。",
    choices_ja: ["てはいけません", "てもいいですか", "てください", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 206,
    form: "prohibition",
    sentence_ja: "<ruby>駅<rt>えき</rt></ruby>で <ruby>走<rt>はし</rt></ruby>っ___。",
    choices_ja: ["てはいけません", "なくてもいいです", "てもいいですか", "なければなりません"],
    correct: 0,
  },

  // 義務形
  {
    id: 207,
    form: "obligation",
    sentence_ja: "<ruby>毎日<rt>まいにち</rt></ruby> 日本語を <ruby>復習<rt>ふくしゅう</rt></ruby>し___。",
    choices_ja: ["なければなりません", "てはいけません", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 208,
    form: "obligation",
    sentence_ja: "<ruby>会社<rt>かいしゃ</rt></ruby>へ 9<ruby>時<rt>じ</rt></ruby>までに <ruby>行<rt>い</rt></ruby>か___。",
    choices_ja: ["なければなりません", "なくてもいいです", "てもいいですか", "てください"],
    correct: 0,
  },

  // 不要形
  {
    id: 209,
    form: "unnecessary",
    sentence_ja: "この <ruby>宿題<rt>しゅくだい</rt></ruby>は <ruby>今日<rt>きょう</rt></ruby>し___。 <ruby>明日<rt>あした</rt></ruby>でもいいです。",
    choices_ja: ["なくてもいいです", "なければなりません", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 210,
    form: "unnecessary",
    sentence_ja: "<ruby>靴<rt>くつ</rt></ruby>を <ruby>脱<rt>ぬ</rt></ruby>が___。 スリッパは <ruby>要<rt>い</rt></ruby>りません。",
    choices_ja: ["なくてもいいです", "てはいけません", "てもいいですか", "てください"],
    correct: 0,
  },
];
