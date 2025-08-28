// src/data/grammar/n5/ask-permit/lesson5.js
export const n5AskPermitLesson5 = [
  // 依頼形（〜てください）
  {
    id: 501,
    form: "request",
    sentence_ja: "<ruby>エアコン</ruby>を つけ___。",
    choices_ja: ["てください", "てもいいですか", "てはいけません", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 502,
    form: "request",
    sentence_ja: "<ruby>道<rt>みち</rt></ruby>を <ruby>教<rt>おし</rt></ruby>え___。",
    choices_ja: ["てください", "てもいいですか", "なければなりません", "てはいけません"],
    correct: 0,
  },

  // 許可形（〜てもいいですか）
  {
    id: 503,
    form: "permission",
    sentence_ja: "この <ruby>本<rt>ほん</rt></ruby>を <ruby>借<rt>か</rt></ruby>り___？",
    choices_ja: ["てもいいですか", "てください", "てはいけません", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 504,
    form: "permission",
    sentence_ja: "<ruby>外<rt>そと</rt></ruby>へ すこし <ruby>出<rt>で</rt></ruby>かけ___？",
    choices_ja: ["てもいいですか", "なければなりません", "てください", "てはいけません"],
    correct: 0,
  },

  // 禁止形（〜てはいけません）
  {
    id: 505,
    form: "prohibition",
    sentence_ja: "<ruby>立入禁止<rt>たちいきんし</rt></ruby>です。ここに <ruby>入<rt>はい</rt></ruby>っ___。",
    choices_ja: ["てはいけません", "てもいいですか", "てください", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 506,
    form: "prohibition",
    sentence_ja: "<ruby>夜中<rt>よなか</rt></ruby>に <ruby>大<rt>おお</rt></ruby>きい <ruby>音<rt>おと</rt></ruby>を <ruby>出<rt>だ</rt></ruby>し___。",
    choices_ja: ["てはいけません", "なくてもいいです", "てもいいですか", "なければなりません"],
    correct: 0,
  },

  // 義務形（〜なければなりません）
  {
    id: 507,
    form: "obligation",
    sentence_ja: "<ruby>ゴミ</ruby>は よく <ruby>分<rt>わ</rt></ruby>け___。",
    choices_ja: ["なければなりません", "てはいけません", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 508,
    form: "obligation",
    sentence_ja: "<ruby>図書館<rt>としょかん</rt></ruby>の <ruby>本<rt>ほん</rt></ruby>を <ruby>明日<rt>あした</rt></ruby>までに <ruby>返<rt>かえ</rt></ruby>さ___。",
    choices_ja: ["なければなりません", "なくてもいいです", "てもいいですか", "てください"],
    correct: 0,
  },

  // 不要形（〜なくてもいいです）
  {
    id: 509,
    form: "unnecessary",
    sentence_ja: "<ruby>上着<rt>うわぎ</rt></ruby>は <ruby>着<rt>き</rt></ruby>___。きょうは <ruby>暖<rt>あたた</rt></ruby>かいです。",
    choices_ja: ["なくてもいいです", "なければなりません", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 510,
    form: "unnecessary",
    sentence_ja: "きょうは もう <ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>に <ruby>行<rt>い</rt></ruby>か___。",
    choices_ja: ["なくてもいいです", "てはいけません", "てもいいですか", "てください"],
    correct: 0,
  },
];
