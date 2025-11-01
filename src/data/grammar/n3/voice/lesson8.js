// N3: 受け身・使役受け身 Lesson8（重複なし・ruby対応・一意解）

export const N3_VOICE_Lesson8 = [
  {
    id: "n3-vp8-801",
    labelKey: "newspaper_tosareru",
    question:
      "<ruby>今回<rt>こんかい</rt></ruby>の<ruby>事故<rt>じこ</rt></ruby>の<ruby>原因<rt>げんいん</rt></ruby>は、ブレーキの<ruby>不具合<rt>ふぐあい</rt></ruby>だと（　）。",
    choices: ["されます", "とされます", "にされます", "されました"],
    answer: 1,
    explain: "新聞体：『〜だとされる』＝一般にそう考えられている。"
  },
  {
    id: "n3-vp8-802",
    labelKey: "newspaper_tomirareru",
    question:
      "<ruby>売上<rt>うりあげ</rt></ruby>の<ruby>回復<rt>かいふく</rt></ruby>は、<ruby>来期<rt>らいき</rt></ruby>からだと（　）。",
    choices: ["見られます", "見せられます", "見られました", "見せられました"],
    answer: 0,
    explain: "『〜と見られる』＝推定の受け身（みなされるの意）。"
  },
  {
    id: "n3-vp8-803",
    labelKey: "koto_ni_sareru",
    question:
      "<ruby>会議<rt>かいぎ</rt></ruby>は<ruby>来週<rt>らいしゅう</rt></ruby><ruby>火曜<rt>かよう</rt></ruby>に<ruby>開<rt>ひら</rt></ruby>くことに（　）。",
    choices: ["されました", "なりました", "させられました", "されます"],
    answer: 0,
    explain: "他者による決定の受け身的表現→『〜ことにされる』。"
  },
  {
    id: "n3-vp8-804",
    labelKey: "agent_marker_niyotte",
    question:
      "<ruby>式<rt>しき</rt></ruby>は<ruby>学長<rt>がくちょう</rt></ruby>（　）<ruby>執<rt>と</rt></ruby>り<ruby>行<rt>おこな</rt></ruby>われた。",
    choices: ["によって", "に", "から", "で"],
    answer: 0,
    explain: "儀式・公式動作＋行為主体明示→『〜によって執り行われる』が定型。"
  },
  {
    id: "n3-vp8-805",
    labelKey: "passive_vs_respect_potential",
    question:
      "<ruby>社長<rt>しゃちょう</rt></ruby>に<ruby>名刺<rt>めいし</rt></ruby>を<ruby>見<rt>み</rt></ruby>ら（　）、<ruby>緊張<rt>きんちょう</rt></ruby>しました。",
    choices: ["れて", "られて", "させられて", "されて"],
    answer: 0,
    explain: "受け身『見られて』。尊敬『ご覧になる』や可能『見られる（＝見える）』と混同しない。"
  },
  {
    id: "n3-vp8-806",
    labelKey: "indirect_possession2",
    question:
      "<ruby>弟<rt>おとうと</rt></ruby>に<ruby>私<rt>わたし</rt></ruby>の<ruby>ノート<rt></rt></ruby>を<ruby>破<rt>やぶ</rt></ruby>ら（　）、<ruby>困<rt>こま</rt></ruby>った。",
    choices: ["れて", "られて", "されて", "させられて"],
    answer: 0,
    explain: "所有物への被害＝間接受け身『破られて困った』。"
  },
  {
    id: "n3-vcp8-807",
    labelKey: "causpass_rentai_series",
    question:
      "<ruby>新人<rt>しんじん</rt></ruby>に<ruby>資料<rt>しりょう</rt></ruby>を<ruby>作成<rt>さくせい</rt></ruby>さ（　）<ruby>時間<rt>じかん</rt></ruby>どおりに<ruby>提出<rt>ていしゅつ</rt></ruby>さ（　）た。",
    choices: ["せられ／れ", "させられ／され", "され／させられ", "させられ／させられ"],
    answer: 1,
    explain: "連体『作成させられた資料』＋連用『提出され（た）』の並行。"
  },
  {
    id: "n3-vp8-808",
    labelKey: "result_state_done",
    question:
      "<ruby>設定<rt>せってい</rt></ruby>はすでに<ruby>完了<rt>かんりょう</rt></ruby>（　）います。",
    choices: ["されて", "させられて", "られて", "れています"],
    answer: 0,
    explain: "サ変＋結果状態→『完了されています』より『完了されています』も可だが、ここは基本『されている』の連用形を選択肢化。"
  },
  {
    id: "n3-vp8-809",
    labelKey: "inanimate_subject2",
    question:
      "<ruby>この<rt></rt></ruby><ruby>規約<rt>きやく</rt></ruby>は、<ruby>利用者<rt>りようしゃ</rt></ruby>の<ruby>安全<rt>あんぜん</rt></ruby>を<ruby>守<rt>まも</rt></ruby>るために<ruby>作成<rt>さくせい</rt></ruby>（　）。",
    choices: ["されました", "させられました", "されます", "せられました"],
    answer: 0,
    explain: "無生物主語×受け身の定型『規約は作成された』。"
  },
  {
    id: "n3-vcp8-810",
    labelKey: "causpass_te_shimai",
    question:
      "<ruby>担当<rt>たんとう</rt></ruby>が<ruby>休<rt>やす</rt></ruby>んで、<ruby>私<rt>わたし</rt></ruby>が<ruby>説明<rt>せつめい</rt></ruby>を<ruby>全部<rt>ぜんぶ</rt></ruby>やら（　）てしまいました。",
    choices: ["せられ", "させられ", "され", "られ"],
    answer: 1,
    explain: "使役受け身＋完了『やらせられてしまった』。"
  },
];
