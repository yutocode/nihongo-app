// src/data/grammar/n5/comparison/lesson7.js
export const n5ComparisonLesson7 = [
  {
    id: 701,
    sentence_ja:
      "<ruby>空<rt>くう</rt></ruby><ruby>港<rt>こう</rt></ruby> と <ruby>駅<rt>えき</rt></ruby> と、 ___ が <ruby>遠<rt>とお</rt></ruby>いですか。",
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: 3
  },
  {
    id: 702,
    sentence_ja:
      "<ruby>飛<rt>ひ</rt></ruby><ruby>行<rt>こう</rt></ruby><ruby>機<rt>き</rt></ruby> は <ruby>電<rt>でん</rt></ruby><ruby>車<rt>しゃ</rt></ruby> ___ <ruby>速<rt>はや</rt></ruby>いです。",
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: 0
  },
  {
    id: 703,
    sentence_ja:
      "この ホテル は あの ホテル ___ <ruby>高<rt>たか</rt></ruby>いです。",
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: 0
  },
  {
    id: 704,
    sentence_ja:
      "<ruby>日<rt>に</rt></ruby><ruby>本<rt>ほん</rt></ruby> の <ruby>都<rt>と</rt></ruby><ruby>市<rt>し</rt></ruby> の 中で、<ruby>京<rt>きょう</rt></ruby><ruby>都<rt>と</rt></ruby> が ___ きれいです。",
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: 2
  },
  {
    id: 705,
    sentence_ja:
      "<ruby>地<rt>ち</rt></ruby><ruby>図<rt>ず</rt></ruby> ___ アプリ ___ <ruby>便<rt>べん</rt></ruby><ruby>利<rt>り</rt></ruby>です。",
    // 地図よりアプリのほうが
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: [0,1]
  },
  {
    id: 706,
    sentence_ja:
      "バス と タクシー と、 ___ が <ruby>高<rt>たか</rt></ruby>いですか。",
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: 3
  },
  {
    id: 707,
    sentence_ja:
      "カメラ ___ <ruby>時<rt>と</rt></ruby><ruby>計<rt>けい</rt></ruby> ___ <ruby>高<rt>たか</rt></ruby>いです。",
    // カメラより時計のほうが（文型練習用）
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: [0,1]
  },
  {
    id: 708,
    sentence_ja:
      "<ruby>新<rt>しん</rt></ruby><ruby>幹<rt>かん</rt></ruby><ruby>線<rt>せん</rt></ruby> と バス と、 ___ が <ruby>速<rt>はや</rt></ruby>いですか。",
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: 3
  },
  {
    id: 709,
    sentence_ja:
      "<ruby>野<rt>や</rt></ruby><ruby>菜<rt>さい</rt></ruby> ___ お<ruby>菓<rt>か</rt></ruby><ruby>子<rt>し</rt></ruby> ___ <ruby>体<rt>からだ</rt></ruby> に いいです。",
    // 野菜よりお菓子のほうが（→実世界の真偽より型優先）
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: [0,1]
  },
  {
    id: 710,
    sentence_ja:
      "<ruby>町<rt>まち</rt></ruby> の 中で、この <ruby>駅<rt>えき</rt></ruby> が ___ <ruby>近<rt>ちか</rt></ruby>いです。",
    choices_ja: ["より","の<ruby>方<rt>ほう</rt></ruby>が","<ruby>一番<rt>いちばん</rt></ruby>","どちら"],
    correct: 2
  }
];
