// N3: 受け身・使役受け身 Lesson5（重複なし）

export const N3_VOICE_Lesson5 = [
  {
    id: "n3-vp5-501",
    labelKey: "passive_indirect_loss",
    question: "<ruby>兄<rt>あに</rt></ruby>に<ruby>私<rt>わたし</rt></ruby>の<ruby>予定<rt>よてい</rt></ruby>を<ruby>勝手<rt>かって</rt></ruby>に<ruby>決<rt>き</rt></ruby>めら（　）、<ruby>困<rt>こま</rt></ruby>りました。",
    choices: ["れて", "せられて", "させられて", "されて"],
    answer: 0,
    explain: "所有者への被害の受け身（間接受け身）。"
  },
  {
    id: "n3-vp5-502",
    labelKey: "passive_nature_media",
    question: "<ruby>この<rt></rt></ruby><ruby>映画<rt>えいが</rt></ruby>は<ruby>世界<rt>せかい</rt></ruby><ruby>中<rt>じゅう</rt></ruby>で<ruby>高<rt>たか</rt></ruby>く<ruby>評価<rt>ひょうか</rt></ruby>さ（　）。",
    choices: ["れています", "せられています", "されています", "られます"],
    answer: 0,
    explain: "自然受け身：『評価されている』。"
  },
  {
    id: "n3-vp5-503",
    labelKey: "agent_choice_niyotte",
    question: "<ruby>論文<rt>ろんぶん</rt></ruby>は<ruby>専門家<rt>せんもんか</rt></ruby>（　）<ruby>査読<rt>さどく</rt></ruby>された。",
    choices: ["によって", "に", "から", "で"],
    answer: 0,
    explain: "行為主体の明示→『〜によって』。"
  },
  {
    id: "n3-vp5-504",
    labelKey: "potential_vs_passive",
    question: "<ruby>暗<rt>くら</rt></ruby>すぎて、<ruby>字<rt>じ</rt></ruby>が<ruby>読<rt>よ</rt></ruby>め（　）。",
    choices: ["ません", "られません", "れません", "されません"],
    answer: 0,
    explain: "ここは可能否定『読めません』。受け身にしない。"
  },
  {
    id: "n3-vcp5-505",
    labelKey: "causpass_force_join",
    question: "<ruby>上司<rt>じょうし</rt></ruby>に<ruby>飲<rt>の</rt></ruby>み<ruby>会<rt>かい</rt></ruby>に<ruby>参加<rt>さんか</rt></ruby>さ（　）。",
    choices: ["せられました", "されました", "られました", "させられました"],
    answer: 3,
    explain: "サ変『参加する』→ 使役受け身『参加させられる』。"
  },
  {
    id: "n3-vcp5-506",
    labelKey: "causpass_regret_finish",
    question: "<ruby>担当<rt>たんとう</rt></ruby>が<ruby>休<rt>やす</rt></ruby>みで、<ruby>私<rt>わたし</rt></ruby>が<ruby>全部<rt>ぜんぶ</rt></ruby><ruby>仕<rt>し</rt></ruby>事<rt>ごと</rt></ruby>を<ruby>終<rt>お</rt></ruby>わら（　）。",
    choices: ["されました", "せられました", "させられました", "られました"],
    answer: 2,
    explain: "『終わらせられた』＝やむなくさせられた（使役受け身）。"
  },
  {
    id: "n3-vp5-507",
    labelKey: "passive_result_check",
    question: "<ruby>個人情報<rt>こじんじょうほう</rt></ruby>が<ruby>外部<rt>がいぶ</rt></ruby>に<ruby>漏<rt>も</rt></ruby>ら（　）いないか、<ruby>再<rt>さい</rt></ruby><ruby>確認<rt>かくにん</rt></ruby>してください。",
    choices: ["れて", "られて", "されて", "せられて"],
    answer: 0,
    explain: "結果状態への懸念→『漏られていないか』。"
  },
  {
    id: "n3-vp5-508",
    labelKey: "passive_vs_morau",
    question: "<ruby>先生<rt>せんせい</rt></ruby>に<ruby>発音<rt>はつおん</rt></ruby>を<ruby>直<rt>なお</rt></ruby>してもら（　）。",
    choices: ["いました", "れました", "させられました", "せられました"],
    answer: 0,
    explain: "恩恵受け取りは『〜てもらう』が自然。"
  },
  {
    id: "n3-vp5-509",
    labelKey: "passive_sound_damage",
    question: "<ruby>隣<rt>となり</rt></ruby>の<ruby>犬<rt>いぬ</rt></ruby>の<ruby>鳴<rt>な</rt></ruby>き<ruby>声<rt>ごえ</rt></ruby>に<ruby>眠<rt>ねむ</rt></ruby>ら（　）。",
    choices: ["れませんでした", "させられませんでした", "されませんでした", "られませんでした"],
    answer: 0,
    explain: "被害受け身の否定過去：眠られなかった。"
  },
  {
    id: "n3-vcp5-510",
    labelKey: "causpass_polite_series",
    question: "<ruby>新入社員<rt>しんにゅうしゃいん</rt></ruby>は<ruby>自己紹介<rt>じこしょうかい</rt></ruby>を<ruby>何度<rt>なんど</rt></ruby>も<ruby>練習<rt>れんしゅう</rt></ruby>さ（　）。",
    choices: ["せられました", "させられました", "されました", "られました"],
    answer: 1,
    explain: "サ変『練習する』→ させられる。"
  },
];
