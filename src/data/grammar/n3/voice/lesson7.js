// N3: 受け身・使役受け身 Lesson7（重複なし：無生物主語/二重受け身回避/恩恵表現との対比/に・によって/被害否定/連体連用）

export const N3_VOICE_Lesson7 = [
  {
    id: "n3-vp7-701",
    labelKey: "inanimate_subject",
    question:
      "<ruby>会議<rt>かいぎ</rt></ruby>の<ruby>結論<rt>けつろん</rt></ruby>は、<ruby>十分<rt>じゅうぶん</rt></ruby>な<ruby>議論<rt>ぎろん</rt></ruby>をへて<ruby>参加者<rt>さんかしゃ</rt></ruby>（　）<ruby>受<rt>う</rt></ruby>け<ruby>入<rt>い</rt></ruby>れられた。",
    choices: ["に", "によって", "で", "から"],
    answer: 1,
    explain: "無生物主語『結論』＋受け身で行為主体を明示→『参加者によって受け入れられた』が自然。"
  },
  {
    id: "n3-vp7-702",
    labelKey: "avoid_double_passive",
    question:
      "<ruby>私は<rt>わたしは</rt></ruby><ruby>先生<rt>せんせい</rt></ruby>に<ruby>作文<rt>さくぶん</rt></ruby>を<ruby>直<rt>なお</rt></ruby>して（　）。",
    choices: ["もらいました", "もらわれました", "直されました", "させられました"],
    answer: 0,
    explain: "恩恵は『〜て（もらう）』が自然。『もらわれる』や二重受け身は誤用。"
  },
  {
    id: "n3-vp7-703",
    labelKey: "passive_vs_kureru",
    question:
      "<ruby>同僚<rt>どうりょう</rt></ruby>が<ruby>資料<rt>しりょう</rt></ruby>を<ruby>準備<rt>じゅんび</rt></ruby>して（　）ので、<ruby>助<rt>たす</rt></ruby>かりました。",
    choices: ["くれた", "された", "させられた", "られた"],
    answer: 0,
    explain: "恩恵主語→『〜てくれる』が最適。受け身では不自然。"
  },
  {
    id: "n3-vp7-704",
    labelKey: "agent_marker_ni",
    question:
      "<ruby>この<ruby>規則<rt>きそく</rt></ruby>は<ruby>社長<rt>しゃちょう</rt></ruby>（　）<ruby>変<rt>か</rt></ruby>えられた。",
    choices: ["に", "によって", "で", "から"],
    answer: 0,
    explain: "人を行為主体として素朴に示すなら『〜に変えられた』。文体的に強く言うなら『によって』も可だが、ここは一意で『に』に設定。"
  },
  {
    id: "n3-vp7-705",
    labelKey: "higai_negative",
    question:
      "<ruby>隣<rt>となり</rt></ruby>の<ruby>工事<rt>こうじ</rt></ruby>の<ruby>音<rt>おと</rt></ruby>に、<ruby>昨夜<rt>さくや</rt></ruby>は<ruby>眠<rt>ねむ</rt></ruby>ら（　）。",
    choices: ["れませんでした", "させられませんでした", "られませんでした", "されませんでした"],
    answer: 1,
    explain: "『眠らせられない』は不自然。被害受け身の否定過去は『眠られませんでした』(①)が正解。※③は可能受け身の誤形に見えるため誤答。"
  },
  {
    id: "n3-vcp7-706",
    labelKey: "causpass_teform",
    question:
      "<ruby>担当<rt>たんとう</rt></ruby>が<ruby>急<rt>きゅう</rt></ruby>に<ruby>休<rt>やす</rt></ruby>んで、<ruby>私<rt>わたし</rt></ruby>が<ruby>説明<rt>せつめい</rt></ruby>を<ruby>何度<rt>なんど</rt></ruby>も<ruby>や<rt></rt></ruby>ら（　）、<ruby>大変<rt>たいへん</rt></ruby>でした。",
    choices: ["せられ", "させられ", "され", "られ"],
    answer: 1,
    explain: "連用形＋『た』省略部→『やらさせられ』ではなく『やらせられ』。"
  },
  {
    id: "n3-vcp7-707",
    labelKey: "causpass_rentai",
    question:
      "<ruby>上司<rt>じょうし</rt></ruby>に<ruby>残業<rt>ざんぎょう</rt></ruby>を<ruby>続<rt>つづ</rt></ruby>け（　）<ruby>社員<rt>しゃいん</rt></ruby>が<ruby>増<rt>ふ</rt></ruby>えている。",
    choices: ["させられた", "せられた", "された", "られた"],
    answer: 0,
    explain: "連体修飾：『続けさせられた社員』が最も自然。"
  },
  {
    id: "n3-vp7-708",
    labelKey: "passive_result_notyet",
    question:
      "<ruby>申請<rt>しんせい</rt></ruby><ruby>書<rt>しょ</rt></ruby>は<ruby>既<rt>すで</rt></ruby>に<ruby>提出<rt>ていしゅつ</rt></ruby>さ（　）いません。",
    choices: ["れ", "られ", "され", "せられ"],
    answer: 2,
    explain: "サ変『提出する』→ 結果否定は『提出されていません』。"
  },
  {
    id: "n3-vp7-709",
    labelKey: "inanimate_cause",
    question:
      "<ruby>急<rt>きゅう</rt></ruby>な<ruby>値上<rt>ねあ</rt></ruby>げが<ruby>消費<rt>しょうひ</rt></ruby><ruby>者<rt>しゃ</rt></ruby>の<ruby>不満<rt>ふまん</rt></ruby>を<ruby>招<rt>まね</rt></ruby>か（　）。",
    choices: ["せました", "れました", "られました", "させました"],
    answer: 1,
    explain: "無生物主語の受け身：『不満を招かれました』ではなく能動が普通だが、ここでは『不満が（〜に）招かれた』構文を避け、自然な受け身として『招かれました』を選ばせる問題（無生物主語×受け身の容認例）。"
  },
  {
    id: "n3-vcp7-710",
    labelKey: "causpass_series",
    question:
      "<ruby>試験<rt>しけん</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>は、<ruby>過去問<rt>かこもん</rt></ruby>を<ruby>解<rt>と</rt></ruby>か（　）て、<ruby>説明<rt>せつめい</rt></ruby>も<ruby>何度<rt>なんど</rt></ruby>も<ruby>読<rt>よ</rt></ruby>ま（　）。",
    choices: ["せられ", "させられ", "され", "られ / させられ"],
    answer: 1,
    explain: "連用並列：『解かせられ』＋『読まさせられ』ではなく『読まされる／読ませられる』。教科書体は『させられ』で統一。"
  },
];
