// src/data/exam/n3/n3_mock1.js
// JLPT N3 模試 01（完成版 / かな中心 / 本試験寄り）
// ルール：本文はかな中心。読み問題のみ漢字を出す（選択肢はかな）。
// 読解の本文は <ruby>途中<rt>とちゅう</rt></ruby> のようにふりがな対応。

export const N3_MOCK1_META = {
  id: "n3-mock1",
  level: "N3",
  title: "N3 模試 01（完成版）",
  durationSec: 45 * 60,
  pass: { overall: 0.6, readingMin: 0.5, listeningMin: 0.5 },
  sectionsLabel: {
    vocab: "文字・語彙",
    grammar: "文法",
    reading: "読解",
    listening: "聴解",
  },
};

// 40問：文字語彙 8 / 文法 12 / 読解 10 / 聴解 10
export const N3_MOCK1_ITEMS = [
  // ===== 文字・語彙（1-8）=====
  { id:"Q001", no:1, section:"vocab",
    stem:"この しごと は【経験】が ひつようです。下せんぶの よみは？",
    choices:["けいけん","けんけい","けいげん","けんげん"], answer:0 },
  { id:"Q002", no:2, section:"vocab",
    stem:"なにか あったら すぐ【連絡】して ください。下せんぶの よみは？",
    choices:["れんらく","れんらき","れいらく","れんろく"], answer:0 },
  { id:"Q003", no:3, section:"vocab",
    stem:"もっと【詳しい】 せつめい を おねがいします。下せんぶの よみは？",
    choices:["くわしい","こまかしい","きびしい","つよい"], answer:0 },
  { id:"Q004", no:4, section:"vocab",
    stem:"この きょうしつ は 先生【以外】 だれも はいれません。下せんぶの よみは？",
    choices:["いがい","いない","いかい","いおう"], answer:0 },
  { id:"Q005", no:5, section:"vocab",
    stem:"かいぎの【途中】で でんき が きえました。下せんぶの よみは？",
    choices:["とちゅう","とちょう","とじゅう","とうちゅう"], answer:0 },
  { id:"Q006", no:6, section:"vocab",
    stem:"【環境】に やさしい せいひん を えらびます。下せんぶの よみは？",
    choices:["かんきょう","かんけい","かんぎょう","かんこう"], answer:0 },
  { id:"Q007", no:7, section:"vocab",
    stem:"しっぱい の【原因】を しらべています。下せんぶの よみは？",
    choices:["げんいん","げんにん","げいいん","げんえん"], answer:0 },
  { id:"Q008", no:8, section:"vocab",
    stem:"この ぶんしょう は【表現】が おもしろいです。下せんぶの よみは？",
    choices:["ひょうげん","ひょうげい","ひょげん","びょうげん"], answer:0 },

  // ===== 文法（9-20）=====
  { id:"Q009", no:9, section:"grammar",
    stem:"つかう まえに せつめいしょを（　）おいて ください。",
    choices:["よんで","よめて","よませて","よまれて"], answer:0 },
  { id:"Q010", no:10, section:"grammar",
    stem:"やくそく の じかん に（　）ように、はやめ に でかけます。",
    choices:["まにあう","まにあった","まにあえる","まにあわない"], answer:0 },
  { id:"Q011", no:11, section:"grammar",
    stem:"でんきを（　）まま、ねて しまいました。",
    choices:["つけた","つけて","ついて","つける"], answer:0 },
  { id:"Q012", no:12, section:"grammar",
    stem:"たなかさん に しゅくだい を だす（　） いわれました。",
    choices:["ように","らしい","はずに","つもりに"], answer:0 },
  { id:"Q013", no:13, section:"grammar",
    stem:"べんきょう している（　）、でんわ が ありました。",
    choices:["さいちゅうに","あいだに","うちに","とちゅうで"], answer:0 },
  { id:"Q014", no:14, section:"grammar",
    stem:"あめ（　）、イベント は ちゅうし に なりました。",
    choices:["のせいで","のおかげで","について","にくらべて"], answer:0 },
  { id:"Q015", no:15, section:"grammar",
    stem:"この もんだい は かんたん（　）わけでは ありません。",
    choices:["という","な","というほど","というわけ"], answer:0 },
  { id:"Q016", no:16, section:"grammar",
    stem:"きょう は いそがしい（　）。まだ 来て いません。",
    choices:["にちがいない","わけではない","らしい","ように"], answer:0 },
  { id:"Q017", no:17, section:"grammar",
    stem:"ともだち に あう（　） えき へ いきます。",
    choices:["ために","ように","ことに","のに"], answer:0 },
  { id:"Q018", no:18, section:"grammar",
    stem:"（せいじょ） A とおりに　B 先生が いった　C レポートを　D つくって ください",
    choices:["B→A→C→D","B→C→A→D","A→B→C→D","C→B→A→D"], answer:0 },
  { id:"Q019", no:19, section:"grammar",
    stem:"いくら せつめいして（　）、わかって もらえません。",
    choices:["も","まで","しか","こそ"], answer:0 },
  { id:"Q020", no:20, section:"grammar",
    stem:"（せいじょ） A おわった　B ばかりで　C しごとが　D つかれて いる",
    choices:["C→A→B→D","A→C→B→D","C→B→A→D","B→C→A→D"], answer:0 },

  // ===== 読解（21-30）=====
  // 掲示
  { id:"Q021", no:21, section:"reading",
    stem:"【ビル ていでん の おしらせ】\nらいしゅう もくようび 9:00〜12:00 は ていでん を おこないます。\nエレベーター は つかえません。\nていでん は いつ ですか。",
    choices:["らいしゅう かようび 9:00〜12:00","らいしゅう すいようび 9:00〜12:00","らいしゅう もくようび 9:00〜12:00","らいしゅう きんようび 9:00〜12:00"], answer:2 },
  { id:"Q022", no:22, section:"reading",
    stem:"上の おしらせ：ていでん の あいだ、なに が できませんか。",
    choices:["エレベーター","かいだん","トイレ","かいぎ"], answer:0 },

  // メール
  { id:"Q023", no:23, section:"reading",
    stem:"（メール）\nさとうさま\nあした の かいぎ は じかん が かわり、14:30 から に なりました。\nばしょ は 3F A かいぎしつ の まま です。\nよろしく おねがいします。\nかいぎ は いつ から ですか。",
    choices:["14:00","14:30","15:00","15:30"], answer:0 },
  { id:"Q024", no:24, section:"reading",
    stem:"上の メール：ばしょ は どこ ですか。",
    choices:["1F ロビー","2F B かいぎしつ","3F A かいぎしつ","オンライン"], answer:3 },

  // 短文（ふりがな）
  { id:"Q025", no:25, section:"reading",
    stem:"きょう は <ruby>途中<rt>とちゅう</rt></ruby> で じこ が あって、でんしゃ が おくれました。その <ruby>影響<rt>えいきょう</rt></ruby> で、わたし は <ruby>約束<rt>やくそく</rt></ruby> に おくれて しまいました。なぜ おくれましたか。",
    choices:["ねぼう した から","じこ の えいきょう で","みち に まよった から","でんしゃ に のりまちがえた から"], answer:1 },
  { id:"Q026", no:26, section:"reading",
    stem:"上の ぶん：なに に おくれましたか。",
    choices:["しごと","やくそく","しけん","かいぎ"], answer:1 },

  // 表
  { id:"Q027", no:27, section:"reading",
    stem:"【バス じこく】 X こう → Y えき\nA：7:10／7:25／7:40／7:55\nB：8:05／8:20\nしつもん：7じ だい に なんぼん ありますか。",
    choices:["2ほん","3ほん","4ほん","5ほん"], answer:2 },

  // ポスター
  { id:"Q028", no:28, section:"reading",
    stem:"【にほんご スピーチ たいかい】\nさんかひ：1000えん（しりょう つき）\nていん：20めい（よやく ひつよう）\nただしい の は どれ ですか。",
    choices:["さんかひ は 500えん","ていん は 20めい","よやく は ひつよう ない","しりょう は つかない"], answer:1 },

  // 回覧
  { id:"Q029", no:29, section:"reading",
    stem:"【ゴミ の だしかた】\nしげんゴミ：すいようび の あさ\nもえるゴミ：かようび・きんようび の あさ\nもえないゴミ：もくようび の あさ\nもえないゴミ は いつ ですか。",
    choices:["かようび の あさ","きんようび の あさ","もくようび の あさ","どようび の あさ"], answer:2 },

  // 案内
  { id:"Q030", no:30, section:"reading",
    stem:"【セミナー の あんない】\nテーマ：ビジネス マナー\nひ：らいしゅう かようび 10:00〜11:30\nばしょ：301 きょうしつ\nもうしこみ：オンライン\nただしい の は どれ ですか。",
    choices:["かようび の ごご","オンライン では もうしこめない","301 きょうしつ で おこなう","9:00〜11:30"], answer:2 },

  // ===== 聴解（31-40）=====
  // ※ script は開発用。画面では audio 再生と設問のみ表示。
  { id:"Q031", no:31, section:"listening", audio:"/audio/n3/mock1/031.mp3",
    script:"女：かいぎ の ばしょ、かわりました？ 男：はい、A かいぎしつ から B かいぎしつ に なりました。",
    stem:"かいぎ の ばしょ は どこ ですか。",
    choices:["A かいぎしつ","B かいぎしつ","C かいぎしつ","オンライン"], answer:1 },
  { id:"Q032", no:32, section:"listening", audio:"/audio/n3/mock1/032.mp3",
    script:"男：しゅっぱつ は なんじ ですか。 女：9じですが、10ぷん まえ に あつまって ください。",
    stem:"あつまる じかん は？",
    choices:["8:40","8:50","9:00","9:10"], answer:1 },
  { id:"Q033", no:33, section:"listening", audio:"/audio/n3/mock1/033.mp3",
    script:"てんいん：コーヒー は 1はい 300えん、セット で 500えん です。 きゃく：じゃ、セット に します。",
    stem:"きゃく は いくら はらいますか。",
    choices:["300えん","400えん","500えん","600えん"], answer:2 },
  { id:"Q034", no:34, section:"listening", audio:"/audio/n3/mock1/034.mp3",
    script:"女：でんしゃ が おくれて いる ようです。 男：じゃ、タクシー で いきましょう。",
    stem:"ふたり は どう しますか。",
    choices:["でんしゃ を まつ","タクシー で いく","さんぽ する","やめる"], answer:1 },
  { id:"Q035", no:35, section:"listening", audio:"/audio/n3/mock1/035.mp3",
    script:"男：この しりょう、あした まで に おねがい できますか。 女：はい、よる まで に つくります。",
    stem:"しりょう は いつ まで に できますか。",
    choices:["きょう の あさ","きょう の よる","あした の あさ","あした の ごご"], answer:1 },
  { id:"Q036", no:36, section:"listening", audio:"/audio/n3/mock1/036.mp3",
    script:"アナウンス：つぎ は <ruby>名古屋<rt>なごや</rt></ruby>、名古屋 です。 のりかえ は 1ばん です。",
    stem:"のりかえ は どこ ですか。",
    choices:["2ばん","3ばん","1ばん","のりかえ なし"], answer:2 },
  { id:"Q037", no:37, section:"listening", audio:"/audio/n3/mock1/037.mp3",
    script:"男：よやく は なんめい ですか。 女：5めい で、19じ から おねがいします。",
    stem:"なんにん の よやく ですか。",
    choices:["3にん","4にん","5にん","6にん"], answer:2 },
  { id:"Q038", no:38, section:"listening", audio:"/audio/n3/mock1/038.mp3",
    script:"アナウンス：きょう は かぜ が つよい ため、屋上 は しめきり です。",
    stem:"なに が できません か。",
    choices:["おくじょう に いく","カフェ を つかう","ロビー で まつ","エレベーター に のる"], answer:0 },
  { id:"Q039", no:39, section:"listening", audio:"/audio/n3/mock1/039.mp3",
    script:"先生：レポート は 木曜日 まで に 出して ください。 遅れない ように。",
    stem:"しめきり は いつ ですか。",
    choices:["火曜日","水曜日","木曜日","金曜日"], answer:2 },
  { id:"Q040", no:40, section:"listening", audio:"/audio/n3/mock1/040.mp3",
    script:"アナウンス：午後3じ から 試験 を 行います。 受付 は 2じ30ふん まで です。",
    stem:"試験 は なんじ から ですか。",
    choices:["2:30","3:00","3:30","4:00"], answer:1 },
];

// 分野取得（採点・集計で使用）
export const N3_MOCK1_SECTION_OF = (noOrSection, items = N3_MOCK1_ITEMS) => {
  if (typeof noOrSection === "string") return noOrSection;
  const it = items.find(x => x.no === noOrSection);
  return it?.section || "vocab";
};
