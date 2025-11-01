// N3: 受け身・使役受け身 Lesson6（重複なし・ruby対応・一意解）

export const N3_VOICE_Lesson6 = [
  {
    id: "n3-vp6-601",
    labelKey: "passive_indirect_clean",
    question: "<ruby>同僚<rt>どうりょう</rt></ruby>に<ruby>会議室<rt>かいぎしつ</rt></ruby>の<ruby>予約<rt>よやく</rt></ruby>を<ruby>勝手<rt>かって</rt></ruby>に<ruby>取<rt>と</rt></ruby>ら（　）、<ruby>困<rt>こま</rt></ruby>りました。",
    choices: ["れて", "られて", "されて", "させられて"],
    answer: 0,
    explain: "所有者側の不利益＝間接受け身『取られて困った』。"
  },
  {
    id: "n3-vp6-602",
    labelKey: "agent_by",
    question: "<ruby>この<rt></rt></ruby><ruby>研究<rt>けんきゅう</rt></ruby>は<ruby>大学<rt>だいがく</rt></ruby>の<ruby>専門家<rt>せんもんか</rt></ruby>（　）<ruby>行<rt>おこな</rt></ruby>われました。",
    choices: ["によって", "に", "で", "から"],
    answer: 0,
    explain: "行為主体の明示→『〜によって行われる』が最適。"
  },
  {
    id: "n3-vp6-603",
    labelKey: "result_state",
    question: "<ruby>鍵<rt>かぎ</rt></ruby>がどこかに<ruby>置<rt>お</rt></ruby>か（　）いないか、もう一度<ruby>確<rt>たし</rt></ruby>かめてください。",
    choices: ["れて", "られて", "されて", "せられて"],
    answer: 0,
    explain: "結果状態の受け身『置かれていないか』。"
  },
  {
    id: "n3-vp6-604",
    labelKey: "progress_state",
    question: "<ruby>新<rt>あたら</rt></ruby>しい<ruby>規則<rt>きそく</rt></ruby>が<ruby>社内<rt>しゃない</rt></ruby>で<ruby>徹底<rt>てってい</rt></ruby>さ（　）います。",
    choices: ["れ", "られ", "れ", "され"],
    answer: 3,
    explain: "サ変名詞＋されている：『徹底されている』。"
  },
  {
    id: "n3-vp6-605",
    labelKey: "potential_confuse",
    question: "<ruby>音<rt>おと</rt></ruby>が<ruby>小<rt>ちい</rt></ruby>さすぎて、よく<ruby>聞<rt>き</rt></ruby>こえ（　）。",
    choices: ["ません", "られません", "れません", "されません"],
    answer: 0,
    explain: "ここは可能否定（受け身不可）→『聞こえません』。"
  },
  {
    id: "n3-vcp6-606",
    labelKey: "causpass_make_write",
    question: "<ruby>急<rt>きゅう</rt></ruby>な<ruby>連絡<rt>れんらく</rt></ruby>で、<ruby>上司<rt>じょうし</rt></ruby>に<ruby>案内文<rt>あんないぶん</rt></ruby>を<ruby>至急<rt>しきゅう</rt></ruby><ruby>書<rt>か</rt></ruby>か（　）。",
    choices: ["されました", "せられました", "させられました", "られました"],
    answer: 2,
    explain: "五段『書く』→ 使役受け身『書かせられる』。"
  },
  {
    id: "n3-vcp6-607",
    labelKey: "causpass_chain_te",
    question: "<ruby>体調<rt>たいちょう</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いのに、<ruby>走<rt>はし</rt></ruby>ら（　）て、さらに<ruby>報告書<rt>ほうこくしょ</rt></ruby>まで<ruby>書<rt>か</rt></ruby>か（　）。",
    choices: ["され", "せられ", "させられ", "られ"],
    answer: 2,
    explain: "連用形×2：『走らせられ』＋『書かせられ』。"
  },
  {
    id: "n3-vp6-608",
    labelKey: "respect_vs_passive",
    question: "<ruby>部長<rt>ぶちょう</rt></ruby>にこの<ruby>件<rt>けん</rt></ruby>を<ruby>聞<rt>き</rt></ruby>か（　）。",
    choices: ["れました（受け身）", "られました（尊敬）", "させられました", "されました"],
    answer: 0,
    explain: "『〜に聞かれました』＝（部長が私に）尋ねた → 受け身。"
  },
  {
    id: "n3-vcp6-609",
    labelKey: "benefit_vs_causpass",
    question: "<ruby>先生<rt>せんせい</rt></ruby>に<ruby>論文<rt>ろんぶん</rt></ruby>を<ruby>直<rt>なお</rt></ruby>してもら（　）、とても<ruby>助<rt>たす</rt></ruby>かりました。",
    choices: ["いました", "れました", "させられました", "せられました"],
    answer: 0,
    explain: "恩恵受け取り＝『〜てもらいました』。使役受け身ではない。"
  },
  {
    id: "n3-vp6-610",
    labelKey: "passive_from",
    question: "<ruby>後輩<rt>こうはい</rt></ruby>（　）<ruby>間違<rt>まちが</rt></ruby>いを<ruby>指摘<rt>してき</rt></ruby>され、<ruby>驚<rt>おどろ</rt></ruby>きました。",
    choices: ["に", "から", "で", "より"],
    answer: 1,
    explain: "口語では行為主『から』も可：『後輩から指摘され』。フォーマルなら『〜に』でも可。"
  },
];
