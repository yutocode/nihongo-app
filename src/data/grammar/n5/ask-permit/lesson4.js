// src/data/grammar/n5/ask-permit/lesson4.js
export const n5AskPermitLesson4 = [
  // 依頼形（〜てください）
  {
    id: 401,
    form: "request",
    sentence_ja: "<ruby>住所<rt>じゅうしょ</rt></ruby>を ここに <ruby>書<rt>か</rt></ruby>い___。",
    choices_ja: ["てください", "てもいいですか", "てはいけません", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 402,
    form: "request",
    sentence_ja: "<ruby>ドア</ruby>を しめ___。",
    choices_ja: ["てください", "てもいいですか", "なければなりません", "てはいけません"],
    correct: 0,
  },

  // 許可形（〜てもいいですか）
  {
    id: 403,
    form: "permission",
    sentence_ja: "この <ruby>ペン</ruby>を つかっ___？",
    choices_ja: ["てもいいですか", "てください", "てはいけません", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 404,
    form: "permission",
    sentence_ja: "ここで <ruby>音楽<rt>おんがく</rt></ruby>を <ruby>聞<rt>き</rt></ruby>い___？",
    choices_ja: ["てもいいですか", "なければなりません", "てください", "てはいけません"],
    correct: 0,
  },

  // 禁止形（〜てはいけません）
  {
    id: 405,
    form: "prohibition",
    sentence_ja: "<ruby>授業中<rt>じゅぎょうちゅう</rt></ruby>に <ruby>スマホ</ruby>を つかっ___。",
    choices_ja: ["てはいけません", "てもいいですか", "てください", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 406,
    form: "prohibition",
    sentence_ja: "<ruby>公園<rt>こうえん</rt></ruby>で ゴミを <ruby>捨<rt>す</rt></ruby>て___。",
    choices_ja: ["てはいけません", "なくてもいいです", "てもいいですか", "なければなりません"],
    correct: 0,
  },

  // 義務形（〜なければなりません）
  {
    id: 407,
    form: "obligation",
    sentence_ja: "<ruby>薬<rt>くすり</rt></ruby>を <ruby>寝<rt>ね</rt></ruby>る <ruby>前<rt>まえ</rt></ruby>に <ruby>飲<rt>の</rt></ruby>ま___。",
    choices_ja: ["なければなりません", "てはいけません", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 408,
    form: "obligation",
    sentence_ja: "<ruby>明日<rt>あした</rt></ruby>の <ruby>会議<rt>かいぎ</rt></ruby>に <ruby>資料<rt>しりょう</rt></ruby>を <ruby>持<rt>も</rt></ruby>って <ruby>行<rt>い</rt></ruby>か___。",
    choices_ja: ["なければなりません", "なくてもいいです", "てもいいですか", "てください"],
    correct: 0,
  },

  // 不要形（〜なくてもいいです）
  {
    id: 409,
    form: "unnecessary",
    sentence_ja: "<ruby>予約<rt>よやく</rt></ruby>は し___。そのまま <ruby>入<rt>はい</rt></ruby>れます。",
    choices_ja: ["なくてもいいです", "なければなりません", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 410,
    form: "unnecessary",
    sentence_ja: "<ruby>土曜日<rt>どようび</rt></ruby>は <ruby>学校<rt>がっこう</rt></ruby>に <ruby>行<rt>い</rt></ruby>か___。",
    choices_ja: ["なくてもいいです", "てはいけません", "てもいいですか", "てください"],
    correct: 0,
  },
];
