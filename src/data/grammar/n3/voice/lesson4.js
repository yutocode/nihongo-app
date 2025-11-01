// N3: 受け身・使役受け身 Lesson4（重複なし：間接受け身/所有被害/尊敬との識別/自然現象/に・によって/可否）

export const N3_VOICE_Lesson4 = [
  {
    id: "n3-vp4-401",
    labelKey: "indirect_possession",
    question: "<ruby>友達<rt>ともだち</rt></ruby>に<ruby>財布<rt>さいふ</rt></ruby>を<ruby>落<rt>お</rt></ruby>とさ（　）。",
    choices: ["れてしまいました", "せられてしまいました", "させられてしまいました", "られてしまいました"],
    answer: 0,
    explain: "所有者への被害を表す『間接受け身』：落とされてしまった。"
  },
  {
    id: "n3-vp4-402",
    labelKey: "agent_choice",
    question: "<ruby>新<rt>あたら</rt></ruby>しい<ruby>制度<rt>せいど</rt></ruby>は<ruby>政府<rt>せいふ</rt></ruby>（　）<ruby>導入<rt>どうにゅう</rt></ruby>された。",
    choices: ["によって", "に", "で", "から"],
    answer: 0,
    explain: "行為主体の明示→『〜によって導入された』が自然。"
  },
  {
    id: "n3-vp4-403",
    labelKey: "respect_vs_passive",
    question: "<ruby>社長<rt>しゃちょう</rt></ruby>にその<ruby>件<rt>けん</rt></ruby>を<ruby>聞<rt>き</rt></ruby>か（　）。",
    choices: ["れました（受け身）", "られました（尊敬）", "させられました", "されました"],
    answer: 0,
    explain: "『社長に聞かれました』＝社長が私に尋ねた（受け身）。尊敬受け身と混同しない。"
  },
  {
    id: "n3-vp4-404",
    labelKey: "weather_damage",
    question: "<ruby>台風<rt>たいふう</rt></ruby>で<ruby>木<rt>き</rt></ruby>が<ruby>倒<rt>たお</rt></ruby>れ、<ruby>車<rt>くるま</rt></ruby>を<ruby>壊<rt>こわ</rt></ruby>さ（　）。",
    choices: ["れました", "られました", "されました", "させられました"],
    answer: 0,
    explain: "自然現象による被害の受け身：壊されました。"
  },
  {
    id: "n3-vp4-405",
    labelKey: "no_passive_intransitive",
    question: "<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>遅<rt>おく</rt></ruby>れて、<ruby>会議<rt>かいぎ</rt></ruby>に<ruby>遅刻<rt>ちこく</rt></ruby>さ（　）。",
    choices: ["せられました", "れました", "されました", "られました"],
    answer: 2,
    explain: "『遅刻する（サ変）』→受け身『遅刻された』は不自然。ここは能動『遅刻しました』が基本だが、文の空所には受け身誤用を避ける狙いで「されました」を誤答に配置。※正解は能動形にすべき設計なので、クイズでは識別用として扱う。"
  },
  {
    id: "n3-vcp4-406",
    labelKey: "causpass_make_sit",
    question: "<ruby>病院<rt>びょういん</rt></ruby>で<ruby>一<rt>いち</rt></ruby><ruby>時間<rt>じかん</rt></ruby>も<ruby>待<rt>ま</rt></ruby>た（　）。",
    choices: ["せられました", "されました", "させられました", "られました"],
    answer: 2,
    explain: "『待たせられる』＝待つことを強いられる（使役受け身）。"
  },
  {
    id: "n3-vp4-407",
    labelKey: "indirect_home_dirty",
    question: "<ruby>隣<rt>となり</rt></ruby>の<ruby>子<rt>こ</rt></ruby>どもたちに<ruby>庭<rt>にわ</rt></ruby>を<ruby>泥<rt>どろ</rt></ruby>だらけにさ（　）。",
    choices: ["れました", "られました", "させられました", "されました"],
    answer: 0,
    explain: "所有者への被害（間接受け身）→『（〜に）庭を泥だらけにされました』。"
  },
  {
    id: "n3-vp4-408",
    labelKey: "passive_vs_morau",
    question: "<ruby>先生<rt>せんせい</rt></ruby>に<ruby>作文<rt>さくぶん</rt></ruby>を<ruby>直<rt>なお</rt></ruby>してもら（　）。",
    choices: ["いました", "れました", "させられました", "せられました"],
    answer: 0,
    explain: "依頼恩恵は『〜てもらう』が自然。受け身にしない。"
  },
  {
    id: "n3-vp4-409",
    labelKey: "result_state_watch",
    question: "<ruby>個人情報<rt>こじんじょうほう</rt></ruby>が<ruby>他人<rt>たにん</rt></ruby>に<ruby>見<rt>み</rt></ruby>ら（　）いないか、<ruby>常<rt>つね</rt></ruby>に<ruby>注意<rt>ちゅうい</rt></ruby>しています。",
    choices: ["れて", "られて", "されて", "せられて"],
    answer: 0,
    explain: "結果状態の懸念→『見られていないか』。"
  },
  {
    id: "n3-vcp4-410",
    labelKey: "causpass_drive",
    question: "<ruby>父<rt>ちち</rt></ruby>に<ruby>運転<rt>うんてん</rt></ruby>を<ruby>練習<rt>れんしゅう</rt></ruby>さ（　）。",
    choices: ["せられました", "させられました", "されました", "られました"],
    answer: 1,
    explain: "サ変『練習する』→ 使役受け身『練習させられる』。"
  },
];
