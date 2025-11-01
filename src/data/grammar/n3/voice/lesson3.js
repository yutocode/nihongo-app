// N3: 受け身・使役受け身 Lesson3（発展：被害・自然・尊敬受け身判別・〜によって・可能との区別・完了/困惑ニュアンス）

export const N3_VOICE_Lesson3 = [
  {
    id: "n3-vp3-301",
    labelKey: "passive_higai_family",
    question:
      "<ruby>弟<rt>おとうと</rt></ruby>にパソコンを<ruby>勝手<rt>かって</rt></ruby>に<ruby>使<rt>つか</rt></ruby>わ（　）。",
    choices: ["れてこまりました", "させられてこまりました", "られてこまりました", "されてこまりました"],
    answer: 0,
    explain: "被害受け身：使う→使われて（困った）。"
  },
  {
    id: "n3-vp3-302",
    labelKey: "passive_nature_brand",
    question:
      "このブランドは<ruby>若者<rt>わかもの</rt></ruby>に<ruby>支持<rt>しじ</rt></ruby>さ（　）。",
    choices: ["れています", "せられています", "されています", "られます"],
    answer: 0,
    explain: "自然受け身：支持されている。"
  },
  {
    id: "n3-vp3-303",
    labelKey: "passive_agent_niyotte",
    question:
      "<ruby>新製品<rt>しんせいひん</rt></ruby>は<ruby>大手<rt>おおて</rt></ruby><ruby>企業<rt>きぎょう</rt></ruby>（　）<ruby>開発<rt>かいはつ</rt></ruby>された。",
    choices: ["によって", "に", "から", "で"],
    answer: 0,
    explain: "行為主体の明示→『〜によって』が最適。"
  },
  {
    id: "n3-vp3-304",
    labelKey: "passive_vs_respect",
    question:
      "<ruby>部長<rt>ぶちょう</rt></ruby>にその<ruby>件<rt>けん</rt></ruby>を<ruby>聞<rt>き</rt></ruby>か（　）。",
    choices: ["れました", "れました（尊敬）", "させられました", "されました"],
    answer: 0,
    explain: "『部長に聞かれました』＝（部長が私に）聞いた→受け身。尊敬受け身に誤解しない。"
  },
  {
    id: "n3-vp3-305",
    labelKey: "passive_potential_confuse",
    question:
      "<ruby>字<rt>じ</rt></ruby>が<ruby>小<rt>ちい</rt></ruby>さすぎて、<ruby>読<rt>よ</rt></ruby>め（　）。",
    choices: ["ません", "られません", "れません", "されません"],
    answer: 0,
    explain: "ここは『可能否定：読めません』。受け身にしない。"
  },
  {
    id: "n3-vcp3-306",
    labelKey: "causpass_made_to_wait",
    question:
      "<ruby>面接<rt>めんせつ</rt></ruby>で30分も<ruby>待<rt>ま</rt></ruby>た（　）。",
    choices: ["せられました", "されました", "させられました", "られました"],
    answer: 2,
    explain: "『待たせられる』＝待つことを強いられた（使役受け身）。"
  },
  {
    id: "n3-vcp3-307",
    labelKey: "causpass_regret",
    question:
      "<ruby>彼<rt>かれ</rt></ruby>のミスで<ruby>謝罪<rt>しゃざい</rt></ruby><ruby>文<rt>ぶん</rt></ruby>を<ruby>書<rt>か</rt></ruby>か（　）、とても<ruby>大変<rt>たいへん</rt></ruby>でした。",
    choices: ["せられ", "させられ", "され", "られ"],
    answer: 1,
    explain: "連用形＋て形の前：書か『せられ』て。"
  },
  {
    id: "n3-vp3-308",
    labelKey: "passive_result_state",
    question:
      "<ruby>重要<rt>じゅうよう</rt></ruby>な<ruby>書類<rt>しょるい</rt></ruby>が<ruby>他社<rt>たしゃ</rt></ruby>に<ruby>見<rt>み</rt></ruby>ら（　）いないか<ruby>確認<rt>かくにん</rt></ruby>してください。",
    choices: ["れて", "られて", "されて", "せられて"],
    answer: 0,
    explain: "結果状態の懸念→見られていないか。"
  },
  {
    id: "n3-vp3-309",
    labelKey: "passive_sound",
    question:
      "<ruby>隣<rt>となり</rt></ruby>の<ruby>工事<rt>こうじ</rt></ruby>の<ruby>音<rt>おと</rt></ruby>に<ruby>勉強<rt>べんきょう</rt></ruby>を<ruby>妨<rt>さまた</rt></ruby>げら（　）。",
    choices: ["れました", "させられました", "されました", "られました"],
    answer: 0,
    explain: "被害受け身：妨げられた。"
  },
  {
    id: "n3-vcp3-310",
    labelKey: "causpass_unintended",
    question:
      "<ruby>急<rt>きゅう</rt></ruby>な<ruby>予定変更<rt>よていへんこう</rt></ruby>で、<ruby>参加者<rt>さんかしゃ</rt></ruby>に<ruby>長<rt>なが</rt></ruby>く<ruby>待<rt>ま</rt></ruby>た（　）しまい、<ruby>申<rt>もう</rt></ruby>し<ruby>訳<rt>わけ</rt></ruby>ありませんでした。",
    choices: ["せられて", "されて", "させられて", "られて"],
    answer: 2,
    explain: "迷惑のニュアンス＋完了→『待たせられてしまい』が自然。"
  },
];
