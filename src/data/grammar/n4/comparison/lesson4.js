// src/data/grammar/n4/comparison/lesson4.js
export const n4ComparisonLesson4 = [
  {
    id: 401,
    sentence_ja:
      "<ruby>日<rt>に</rt></ruby><ruby>本<rt>ほん</rt></ruby> と <ruby>台<rt>たい</rt></ruby><ruby>湾<rt>わん</rt></ruby> と、 ___ が好きですか。",
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "<ruby>一番<rt>いちばん</rt></ruby>", "どちら"],
    correct: 3
  },
  {
    id: 402,
    sentence_ja:
      "<ruby>春<rt>はる</rt></ruby> は <ruby>秋<rt>あき</rt></ruby> ___ すずしいです。",
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "<ruby>一番<rt>いちばん</rt></ruby>", "どちら"],
    correct: 0
  },
  {
    id: 403,
    sentence_ja:
      "<ruby>地<rt>ち</rt></ruby><ruby>下<rt>か</rt></ruby><ruby>鉄<rt>てつ</rt></ruby> ___ <ruby>徒<rt>と</rt></ruby><ruby>歩<rt>ほ</rt></ruby> ___ はやいです。",
    // 地下鉄より徒歩のほうが（速い）
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "どちら", "<ruby>一番<rt>いちばん</rt></ruby>"],
    correct: [0, 1]
  },
  {
    id: 404,
    sentence_ja:
      "<ruby>魚<rt>さかな</rt></ruby> ___ <ruby>肉<rt>にく</rt></ruby> ___ からだにいいと<ruby>思<rt>おも</rt></ruby>います。",
    // 魚より肉のほうが（〜）
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "どちら", "<ruby>一番<rt>いちばん</rt></ruby>"],
    correct: [0, 1]
  },
  {
    id: 405,
    sentence_ja:
      "<ruby>図<rt>と</rt></ruby><ruby>書<rt>しょ</rt></ruby><ruby>館<rt>かん</rt></ruby> の 中で、この ばしょ が ___ <ruby>静<rt>しず</rt></ruby>かです。",
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "<ruby>一番<rt>いちばん</rt></ruby>", "どちら"],
    correct: 2
  },
  {
    id: 406,
    sentence_ja:
      "<ruby>赤<rt>あか</rt></ruby> と <ruby>青<rt>あお</rt></ruby> と、 ___ が 好きですか。",
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "<ruby>一番<rt>いちばん</rt></ruby>", "どちら"],
    correct: 3
  },
  {
    id: 407,
    sentence_ja:
      "<ruby>台<rt>たい</rt></ruby><ruby>北<rt>ぺい</rt></ruby> と <ruby>高<rt>たか</rt></ruby><ruby>雄<rt>お</rt></ruby> と、 ___ が にぎやかですか。",
    // にぎやか：賑やか（にぎやか）だがN5配慮でかな表記中心。質問文はOK。
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "<ruby>一番<rt>いちばん</rt></ruby>", "どちら"],
    correct: 3
  },
  {
    id: 408,
    sentence_ja:
      "<ruby>荷<rt>に</rt></ruby><ruby>物<rt>もつ</rt></ruby>A は <ruby>荷<rt>に</rt></ruby><ruby>物<rt>もつ</rt></ruby>B ___ <ruby>重<rt>おも</rt></ruby>いです。",
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "<ruby>一番<rt>いちばん</rt></ruby>", "どちら"],
    correct: 0
  },
  {
    id: 409,
    sentence_ja:
      "<ruby>鳥<rt>とり</rt></ruby> ___ <ruby>魚<rt>さかな</rt></ruby> ___ かわいいと <ruby>思<rt>おも</rt></ruby>います。",
    // 鳥より魚のほうが
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "<ruby>一番<rt>いちばん</rt></ruby>", "どちら"],
    correct: [0, 1]
  },
  {
    id: 410,
    sentence_ja:
      "<ruby>日<rt>に</rt></ruby><ruby>本<rt>ほん</rt></ruby><ruby>料<rt>りょう</rt></ruby><ruby>理<rt>り</rt></ruby> の 中で、<ruby>寿<rt>す</rt></ruby><ruby>司<rt>し</rt></ruby> が ___ <ruby>有<rt>ゆう</rt></ruby><ruby>名<rt>めい</rt></ruby>です。",
    choices_ja: ["より", "の<ruby>方<rt>ほう</rt></ruby>が", "<ruby>一番<rt>いちばん</rt></ruby>", "どちら"],
    correct: 2
  }
];
