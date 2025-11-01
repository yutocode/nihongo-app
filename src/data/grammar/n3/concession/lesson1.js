// src/data/grammar/n3/concession/lesson1.js
// N3：逆接ターゲット Lesson1（が／けれども／のに／しかし／だが／わりに／くせに）
// ※ 質問文に <ruby> を使用（JSX側で ruby 許可の sanitize が必要）

export const N3_CONCESSION_Lesson1 = [
  {
    id: "n3-l1-001",
    question:
      "この<ruby>商品<rt>しょうひん</rt></ruby>は<ruby>値段<rt>ねだん</rt></ruby>が高い（　）、よく<ruby>売<rt>う</rt></ruby>れる。",
    choices: ["が", "ので", "について", "によって"],
    answer: 0,
  },
  {
    id: "n3-l1-002",
    question:
      "<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>っている（　）、<ruby>出<rt>で</rt></ruby>かけた。",
    choices: ["のに", "ので", "ために", "について"],
    answer: 0,
  },
  {
    id: "n3-l1-003",
    question:
      "<ruby>手続<rt>てつづ</rt></ruby>きは<ruby>簡単<rt>かんたん</rt></ruby>だ。（　）<ruby>時間<rt>じかん</rt></ruby>がかかる。",
    choices: ["しかし", "それで", "そこで", "つまり"],
    answer: 0,
  },
  {
    id: "n3-l1-004",
    question:
      "<ruby>彼<rt>かれ</rt></ruby>は<ruby>新人<rt>しんじん</rt></ruby>だ。（　）<ruby>判断<rt>はんだん</rt></ruby>は<ruby>的確<rt>てきかく</rt></ruby>だ。",
    choices: ["だが", "それで", "そのため", "つまり"],
    answer: 0,
  },
  {
    id: "n3-l1-005",
    question:
      "<ruby>恐<rt>おそ</rt></ruby>れ<ruby>入<rt>い</rt></ruby>ります（　）、こちらにご<ruby>記入<rt>きにゅう</rt></ruby>ください。",
    choices: ["けれども", "ので", "について", "として"],
    answer: 0,
  },
  {
    id: "n3-l1-006",
    question:
      "<ruby>彼<rt>かれ</rt></ruby>は<ruby>年齢<rt>ねんれい</rt></ruby>の（　）<ruby>体力<rt>たいりょく</rt></ruby>がある。",
    choices: ["わりに", "に対して", "について", "ので"],
    answer: 0,
  },
  {
    id: "n3-l1-007",
    question:
      "<ruby>初心者<rt>しょしんしゃ</rt></ruby>の（　）、<ruby>人<rt>ひと</rt></ruby>のやり<ruby>方<rt>かた</rt></ruby>を<ruby>批判<rt>ひはん</rt></ruby>する。",
    choices: ["くせに", "のために", "によって", "それで"],
    answer: 0,
  },
  {
    id: "n3-l1-008",
    question:
      "<ruby>説明<rt>せつめい</rt></ruby>は<ruby>分<rt>わ</rt></ruby>かりやすい（　）、<ruby>実践<rt>じっせん</rt></ruby>は<ruby>難<rt>むずか</rt></ruby>しい。",
    choices: ["が", "ために", "について", "それで"],
    answer: 0,
  },
];
