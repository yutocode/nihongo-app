// JLPT N4 模試 01（完成版 / N5と同じ設計）
// ルール：本文はかな中心。読み問題のみ漢字を出す（選択肢はかな）。
// 読解の本文は <ruby>出張<rt>しゅっちょう</rt></ruby> のようにふりがな対応。

export const N4_MOCK1_META = {
  id: "n4-mock1",
  level: "N4",
  title: "N4 模試 01（完成版）",
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
export const N4_MOCK1_ITEMS = [
  // ===== 文字・語彙（1-8）=====
  { id:"Q001", no:1, section:"vocab",
    stem:"かいぎの 前に【準備】を して おいてください。下せんぶの よみは？",
    choices:["じゅんび","じゅんぴ","しゅんび","じょんび"], answer:0 },
  { id:"Q002", no:2, section:"vocab",
    stem:"けがを したので【病院】へ いきます。下せんぶの よみは？",
    choices:["びょういん","びょうにん","びよういん","びょいん"], answer:0 },
  { id:"Q003", no:3, section:"vocab",
    stem:"この みち は きけんです。車に【注意】して ください。下せんぶの よみは？",
    choices:["ちゅうい","ちゅい","ちゅうぎ","ちゅいぎ"], answer:0 },
  { id:"Q004", no:4, section:"vocab",
    stem:"あしたの【会議】は ごご2じ から です。下せんぶの よみは？",
    choices:["かいぎ","かいご","かいき","がいぎ"], answer:0 },
  { id:"Q005", no:5, section:"vocab",
    stem:"りょこうの【予定】が かわりました。下せんぶの よみは？",
    choices:["よてい","よて","ゆてい","よでい"], answer:0 },
  { id:"Q006", no:6, section:"vocab",
    stem:"インターネットで じゅうしょを【調べる】。下せんぶの よみは？",
    choices:["しらべる","たべる","さだめる","きめる"], answer:0 },
  { id:"Q007", no:7, section:"vocab",
    stem:"どうぞ【遠慮】しないで ください。下せんぶの よみは？",
    choices:["えんりょ","えんりょく","えんりょう","えんりゅ"], answer:0 },
  { id:"Q008", no:8, section:"vocab",
    stem:"しりょうを 作るのに【必要】な じかんは どれくらいですか。下せんぶの よみは？",
    choices:["ひつよう","ひちょう","ひっよう","ひつよ"], answer:0 },

  // ===== 文法（9-20）=====
  { id:"Q009", no:9, section:"grammar",
    stem:"まいにち にっきを（　）ように しています。",
    choices:["かく","かいた","かける","かかせる"], answer:0 },
  { id:"Q010", no:10, section:"grammar",
    stem:"でかける まえに でんきを（　）おきました。",
    choices:["けして","けす","けした","けさない"], answer:0 },
  { id:"Q011", no:11, section:"grammar",
    stem:"あめが（　）ので、でかけません。",
    choices:["ふっている","ふる","ふった","ふらない"], answer:0 },
  { id:"Q012", no:12, section:"grammar",
    stem:"にほんへ きて（　）、さしみが たべられる ように なりました。",
    choices:["から","ので","けど","まで"], answer:0 },
  { id:"Q013", no:13, section:"grammar",
    stem:"あしたの かいぎに（　）かもしれません。",
    choices:["おくれる","おくれた","おくれない","おくらない"], answer:0 },
  { id:"Q014", no:14, section:"grammar",
    stem:"さいふを（　）ばかりなので、おかねが ありません。",
    choices:["なくした","なくす","なくして","なくさない"], answer:0 },
  { id:"Q015", no:15, section:"grammar",
    stem:"この ボタンを おせ（　）、ドアが あきます。",
    choices:["ば","と","なら","まで"], answer:0 },
  { id:"Q016", no:16, section:"grammar",
    stem:"せんせいに（　）うれしかったです。",
    choices:["ほめられて","ほめて","ほめられる","ほめ"], answer:0 },
  { id:"Q017", no:17, section:"grammar",
    stem:"あの みせは たかい（　）、りょうりは おいしいです。",
    choices:["けれども","のに","ので","しか"], answer:0 },
  { id:"Q018", no:18, section:"grammar",
    stem:"やくそくの じかんに まにあう（　）、はやく でましょう。",
    choices:["ように","ために","のに","わりに"], answer:0 },
  { id:"Q019", no:19, section:"grammar",
    stem:"もし あめが（　）、しあいは ちゅうしです。",
    choices:["ふったら","ふるなら","ふれば","ふると"], answer:0 },
  { id:"Q020", no:20, section:"grammar",
    stem:"いくら せつめいしても、たなかさんは わかって（　）。",
    choices:["くれません","もらえません","いただけません","やりません"], answer:0 },

  // ===== 読解（21-30）=====
  // 掲示
  { id:"Q021", no:21, section:"reading",
    stem:"【としょかん の おしらせ】\nてんけん の ため、あした は きゅうかん です。\nほん を かりる とき は かいいんカード が ひつよう です。\nきゅうかん は いつ ですか。",
    choices:["きょう","あした","あさって","らいしゅう"], answer:1 },
  { id:"Q022", no:22, section:"reading",
    stem:"上の おしらせ：ほん を かりる とき ひつよう な もの は なんですか。",
    choices:["おかね","かいいんカード","じゅうしょ","でんわばんごう"], answer:1 },

  // メール
  { id:"Q023", no:23, section:"reading",
    stem:"（メール）\nたなかさま\nめんせつ の にちじ が へんこう に なりました。\nもくようび ごぜん10じ30ふん、ばしょ は B かいぎしつ です。\nよろしく おねがいします。\nめんせつ は いつ ですか。",
    choices:["かようび 10:30","すいようび 10:30","もくようび 10:30","きんようび 10:30"], answer:2 },
  { id:"Q024", no:24, section:"reading",
    stem:"上の メール：なに を もって いく べき ですか。",
    choices:["りれきしょ","パスポート","みず","とくに かいて いない"], answer:3 },

  // 短文（ふりがな）
  { id:"Q025", no:25, section:"reading",
    stem:"たなかさん は かようび から もくようび まで <ruby>出張<rt>しゅっちょう</rt></ruby> です。きんようび は <ruby>会社<rt>かいしゃ</rt></ruby> に もどって、ゆうがた に <ruby>同僚<rt>どうりょう</rt></ruby> と しょくじ を します。たなかさん は なんようび の よる に しょくじ を しますか。",
    choices:["すいようび","もくようび","きんようび","どようび"], answer:2 },
  { id:"Q026", no:26, section:"reading",
    stem:"上の ぶん：たなかさん が <ruby>出張<rt>しゅっちょう</rt></ruby> に いく の は いつ から ですか。",
    choices:["げつようび","かようび","すいようび","もくようび"], answer:1 },

  // 表
  { id:"Q027", no:27, section:"reading",
    stem:"【でんしゃ じこく】 Aえき → Bえき\nへいじつ：8:05／8:20／8:35／8:50\nしつもん：8じ から 9じ まで に なんぼん ありますか。",
    choices:["2ほん","3ほん","4ほん","5ほん"], answer:2 },

  // ポスター
  { id:"Q028", no:28, section:"reading",
    stem:"【ことば こうかんかい】\nじかん：どようび 15:00〜17:00\nさんかひ：500えん（のみもの つき）\nにちようび は ありません。\nただしい の は どれ ですか。",
    choices:["にちようび に ある","さんかひ は 500えん","のみもの は ない","じかん は 17:00〜19:00"], answer:1 },

  // 回覧
  { id:"Q029", no:29, section:"reading",
    stem:"【ゴミ の だしかた】\nもえるゴミ：かようび・きんようび の あさ\nもえないゴミ：もくようび の あさ\nしつもん：もえないゴミ は いつ だせますか。",
    choices:["かようび の あさ","きんようび の あさ","もくようび の あさ","どようび の あさ"], answer:2 },

  // 張り紙
  { id:"Q030", no:30, section:"reading",
    stem:"【エレベーター てんけん】\nげつようび 9:00〜12:00 は つかえません。\nなに を いって いますか。",
    choices:["かいだん を つかわないで","エレベーター は つかえない","12:00 から つかえない","げつようび は えいぎょう しない"], answer:1 },

  // ===== 聴解（31-40）=====
  // ※ script は開発用。画面では audio 再生と設問のみ表示。
  { id:"Q031", no:31, section:"listening", audio:"/audio/n4/mock1/031.mp3",
    script:"女：かいぎ の じかん が かわりました。男：なんじ から ですか。女：ごご2じ30ふん から です。",
    stem:"かいぎ は なんじ から ですか。",
    choices:["ごご2じ","ごご2じ30ふん","ごご3じ","ごご3じ30ふん"], answer:1 },
  { id:"Q032", no:32, section:"listening", audio:"/audio/n4/mock1/032.mp3",
    script:"男：Aせん の のりば は どこ ですか。女：きょう は こうじ で、3ばん では なく 5ばん です。",
    stem:"Aせん の のりば は どこ ですか。",
    choices:["1ばん","3ばん","5ばん","7ばん"], answer:2 },
  { id:"Q033", no:33, section:"listening", audio:"/audio/n4/mock1/033.mp3",
    script:"てんいん：ペン は 1ほん 200えん、2ほん で 300えん です。きゃく：じゃあ、2ほん ください。",
    stem:"きゃく は いくら はらいますか。",
    choices:["200えん","300えん","350えん","400えん"], answer:1 },
  { id:"Q034", no:34, section:"listening", audio:"/audio/n4/mock1/034.mp3",
    script:"男：かいぎ は 30ふん えんちょう に なります。女：わかりました。",
    stem:"かいぎ は なんじ に おわりますか。（かいぎ は 14:00〜 の よてい）",
    choices:["14:30","15:00","15:30","16:00"], answer:1 },
  { id:"Q035", no:35, section:"listening", audio:"/audio/n4/mock1/035.mp3",
    script:"女：ごご は かぜ が つよく なる そうです。かさ を わすれないで ください。",
    stem:"ごご は どう なり ますか。",
    choices:["あめ が ふる","かぜ が つよく なる","ゆき が ふる","はれる"], answer:1 },
  { id:"Q036", no:36, section:"listening", audio:"/audio/n4/mock1/036.mp3",
    script:"アナウンス：この かいそく は Cえき で ふつうれっしゃ に のりかえて ください。",
    stem:"どこ で のりかえますか。",
    choices:["Aえき","Bえき","Cえき","Dえき"], answer:2 },
  { id:"Q037", no:37, section:"listening", audio:"/audio/n4/mock1/037.mp3",
    script:"男：よやく は なんめい ですか。女：4めい で、19じ に おねがいします。きんえんせき です。",
    stem:"なんにん の よやく ですか。",
    choices:["2にん","3にん","4にん","5にん"], answer:2 },
  { id:"Q038", no:38, section:"listening", audio:"/audio/n4/mock1/038.mp3",
    script:"アナウンス：コピーき は こしょう して います。3かい の コピーき を つかって ください。",
    stem:"どう すれば いい ですか。",
    choices:["つかわない","しゅうり を まつ","3かい の コピーき を つかう","1かい の コピーき を つかう"], answer:2 },
  { id:"Q039", no:39, section:"listening", audio:"/audio/n4/mock1/039.mp3",
    script:"先生：レポート の しめきり は らいしゅう かようび です。おくれない ように。",
    stem:"レポート の しめきり は いつ ですか。",
    choices:["こんしゅう かようび","らいしゅう かようび","らいしゅう もくようび","らいしゅう きんようび"], answer:1 },
  { id:"Q040", no:40, section:"listening", audio:"/audio/n4/mock1/040.mp3",
    script:"アナウンス：しけん は 9じ30ふん から です。9じ10ふん まで に あつまって ください。",
    stem:"しけん は なんじ から ですか。",
    choices:["9じ","9じ10ふん","9じ30ふん","10じ"], answer:2 },
];

// 分野取得（採点・集計で使用）
export const N4_MOCK1_SECTION_OF = (noOrSection, items = N4_MOCK1_ITEMS) => {
  if (typeof noOrSection === "string") return noOrSection;
  const it = items.find(x => x.no === noOrSection);
  return it?.section || "vocab";
};
