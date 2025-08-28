// src/data/grammar/n5/ask-permit/lesson3.js
export const n5AskPermitLesson3 = [
  // 依頼形（〜てください）
  {
    id: 301,
    form: "request",
    sentence_ja: "<ruby>写真<rt>しゃしん</rt></ruby>を みせ___。",
    choices_ja: ["てください", "てもいいですか", "てはいけません", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 302,
    form: "request",
    sentence_ja: "<ruby>少<rt>すこ</rt></ruby>し <ruby>手伝<rt>てつだ</rt></ruby>っ___。",
    choices_ja: ["てください", "てもいいですか", "なければなりません", "てはいけません"],
    correct: 0,
  },

  // 許可形（〜てもいいですか）
  {
    id: 303,
    form: "permission",
    sentence_ja: "<ruby>トイレ</ruby>を つかっ___？",
    choices_ja: ["てもいいですか", "てください", "てはいけません", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 304,
    form: "permission",
    sentence_ja: "ここに <ruby>座<rt>すわ</rt></ruby>っ___？",
    choices_ja: ["てもいいですか", "なければなりません", "てください", "てはいけません"],
    correct: 0,
  },

  // 禁止形（〜てはいけません）
  {
    id: 305,
    form: "prohibition",
    sentence_ja: "ここに <ruby>車<rt>くるま</rt></ruby>を <ruby>止<rt>と</rt></ruby>め___。",
    choices_ja: ["てはいけません", "てもいいですか", "てください", "なくてもいいです"],
    correct: 0,
  },
  {
    id: 306,
    form: "prohibition",
    sentence_ja: "<ruby>宿題<rt>しゅくだい</rt></ruby>を <ruby>忘<rt>わす</rt></ruby>れ___。",
    choices_ja: ["てはいけません", "なくてもいいです", "てもいいですか", "なければなりません"],
    correct: 0,
  },

  // 義務形（〜なければなりません）
  {
    id: 307,
    form: "obligation",
    sentence_ja: "<ruby>毎朝<rt>まいあさ</rt></ruby> 6<ruby>時<rt>じ</rt></ruby>に おき___。",
    choices_ja: ["なければなりません", "てはいけません", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 308,
    form: "obligation",
    sentence_ja: "<ruby>レポート</ruby>を <ruby>先生<rt>せんせい</rt></ruby>に <ruby>出<rt>だ</rt></ruby>さ___。",
    choices_ja: ["なければなりません", "なくてもいいです", "てもいいですか", "てください"],
    correct: 0,
  },

  // 不要形（〜なくてもいいです）
  {
    id: 309,
    form: "unnecessary",
    sentence_ja: "今日は <ruby>コート</ruby>を <ruby>着<rt>き</rt></ruby>___。<ruby>外<rt>そと</rt></ruby>は <ruby>暖<rt>あたた</rt></ruby>かいです。",
    choices_ja: ["なくてもいいです", "なければなりません", "てもいいですか", "てください"],
    correct: 0,
  },
  {
    id: 310,
    form: "unnecessary",
    sentence_ja: "今日は <ruby>お金<rt>おかね</rt></ruby>を <ruby>払<rt>はら</rt></ruby>わ___。<ruby>友達<rt>ともだち</rt></ruby>が <ruby>払<rt>はら</rt></ruby>います。",
    choices_ja: ["なくてもいいです", "てはいけません", "てもいいですか", "てください"],
    correct: 0,
  },
];
