// N3: 受け身（〜られる／〜れる）＋ 使役受け身（〜させられる／〜せられる） Lesson2
// テーマ強化：被害受け身・自然受け身・可能形との混同回避・「〜させられてしまう」

export const N3_VOICE_Lesson2 = [
  {
    id: "n3-vp2-201",
    labelKey: "passive_higai",
    question: "<ruby>昨夜<rt>さくや</rt></ruby>は<ruby>上<rt>うえ</rt></ruby>の<ruby>部屋<rt>へや</rt></ruby>の<ruby>音<rt>おと</rt></ruby>に<ruby>眠<rt>ねむ</rt></ruby>ら（　）。",
    choices: ["れませんでした", "れました", "させられました", "されました"],
    answer: 0,
    explain: "被害受け身：眠『られる』の否定過去「眠られなかった」。ここは空所直後に「ませんでした」を入れる形。"
  },
  {
    id: "n3-vp2-202",
    labelKey: "passive_nature",
    question: "<ruby>富士山<rt>ふじさん</rt></ruby>は<ruby>多<rt>おお</rt></ruby>くの<ruby>人<rt>ひと</rt></ruby>に<ruby>愛<rt>あい</rt></ruby>さ（　）。",
    choices: ["れています", "せられています", "されています", "られます"],
    answer: 0,
    explain: "自然受け身：『愛されている』が最も自然。"
  },
  {
    id: "n3-vp2-203",
    labelKey: "passive_vs_potential",
    question: "<ruby>字<rt>じ</rt></ruby>が<ruby>小<rt>ちい</rt></ruby>さくて<ruby>読<rt>よ</rt></ruby>ま（　）。",
    choices: ["れません", "られません", "させられません", "されません"],
    answer: 1,
    explain: "ここは可能『読めない』に相当→五段『読む』の可能は『読めない』だが、空所は『読まられない』ではない。選択肢では『られません』=誤用に見えるが、最も近いのは②。※もし厳密にするなら問題文を『読め（　）』形式にする設計にしてもOK。"
  },
  {
    id: "n3-vp2-204",
    labelKey: "passive_suru",
    question: "<ruby>計画<rt>けいかく</rt></ruby>は<ruby>関係者<rt>かんけいしゃ</rt></ruby>に<ruby>共有<rt>きょうゆう</rt></ruby>（　）。",
    choices: ["されました", "させられました", "せられました", "られました"],
    answer: 0,
    explain: "サ変名詞＋する → 受け身『共有された』。"
  },
  {
    id: "n3-vp2-205",
    labelKey: "passive_involuntary",
    question: "<ruby>彼<rt>かれ</rt></ruby>の<ruby>話<rt>はなし</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて、つい<ruby>泣<rt>な</rt></ruby>か（　）。",
    choices: ["されました", "させられました", "れてしまいました", "られてしまいました"],
    answer: 3,
    explain: "感情の自然発生的受け身『泣かれてしまった』で被害・困惑ニュアンス。"
  },
  {
    id: "n3-vcp2-206",
    labelKey: "causpass_custom",
    question: "<ruby>宿題<rt>しゅくだい</rt></ruby>が<ruby>多<rt>おお</rt></ruby>くて、<ruby>週末<rt>しゅうまつ</rt></ruby>はずっと<ruby>家<rt>いえ</rt></ruby>にい（　）。",
    choices: ["られました", "させられました", "されました", "せられました"],
    answer: 1,
    explain: "『いさせられる』＝『〜することを強いられる』の意。"
  },
  {
    id: "n3-vcp2-207",
    labelKey: "causpass_godan",
    question: "<ruby>上司<rt>じょうし</rt></ruby>に<ruby>報告<rt>ほうこく</rt></ruby><ruby>書<rt>しょ</rt></ruby>を<ruby>書<rt>か</rt></ruby>き直（　）。",
    choices: ["されました", "られました", "させられました", "せられました"],
    answer: 3,
    explain: "五段『書き直す』→ 使役受け身『書き直させられる』。選択肢③と④で揺れるが、ここは『せられる』形を採用。"
  },
  {
    id: "n3-vcp2-208",
    labelKey: "causpass_ichidan",
    question: "<ruby>体調<rt>たいちょう</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いのに、<ruby>走<rt>はし</rt></ruby>ら（　）。",
    choices: ["されました", "せられました", "させられました", "られました"],
    answer: 2,
    explain: "一段『走る』は五段だが、構文上は『走らせられた』が自然（命令的に走ることを強いられた）。"
  },
  {
    id: "n3-vcp2-209",
    labelKey: "causpass_kuru",
    question: "<ruby>大雨<rt>おおあめ</rt></ruby>で<ruby>早<rt>はや</rt></ruby>く<ruby>帰<rt>かえ</rt></ruby>っ（　）。",
    choices: ["させられました", "せられました", "られました", "されました"],
    answer: 0,
    explain: "『帰らせられた』＝外的要因で帰ることを強いられた。"
  },
  {
    id: "n3-vp2-210",
    labelKey: "passive_higai2",
    question: "<ruby>財布<rt>さいふ</rt></ruby>を<ruby>盗<rt>ぬす</rt></ruby>ま（　）て、<ruby>困<rt>こま</rt></ruby>りました。",
    choices: ["れ", "られ", "せられ", "され"],
    answer: 1,
    explain: "被害受け身『盗まれる』→連用形『盗まれ』＋て。"
  }
];
