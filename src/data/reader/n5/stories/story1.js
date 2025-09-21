// src/data/reader/n5/stories/story1.js
export const story1 = {
  id: "story1",
  level: "n5",
  title: "学校の初日",
  // カバー（初期フォールバック用）
  cover: "/images/reader/n5/story1/cover.jpg",
  // 音声ベースパス（あとで差し替え可）
  audioBase: "/audio/reader/n5/story1",

  sentences: [
    // 1 / 5
    {
      id: "s1",
      image: "/images/reader/n5/story1/1.jpg", // ★ページ専用画像
      jp: "きょうは <ruby>学校<rt>がっこう</rt></ruby>の <ruby>初日<rt>しょにち</rt></ruby>です。",
      tr: {
        ja: "今日は学校の初日です。",
        en: "Today is the first day of school.",
        zh: "今天是开学第一天。", tw: "今天是開學第一天。",
        ko: "오늘은 학교 첫날입니다。", vi: "Hôm nay là ngày đầu tiên đi học.",
        th: "วันนี้เป็นวันแรกของโรงเรียน", my: "ဒီနေ့ ကျောင်းပထမနေ့ပါ။"
      },
      dict: {
        "学校": { ja:"学校", en:"school", zh:"学校", tw:"學校", ko:"학교", vi:"trường học", th:"โรงเรียน", my:"ကျောင်း" },
        "初日": { ja:"初日", en:"first day", zh:"第一天", tw:"第一天", ko:"첫날", vi:"ngày đầu tiên", th:"วันแรก", my:"ပထမနေ့" }
      },
      audio: "sentence_001.mp3"
    },

    // 2 / 5
    {
      id: "s2",
      image: "/images/reader/n5/story1/2.jpg",
      jp: "わたしは <ruby>朝<rt>あさ</rt></ruby>、はやく おきます。",
      tr: {
        ja: "私は朝、早く起きます。",
        en: "I get up early in the morning.",
        zh: "早上我早起。", tw: "早上我早起。",
        ko: "아침에 일찍 일어납니다。", vi: "Buổi sáng tôi dậy sớm.",
        th: "ตอนเช้าฉันตื่นเช้า", my: "မနက် လွှင့်လွှင့် သွားထတယ်。"
      },
      dict: {
        "朝": { ja:"朝", en:"morning", zh:"早上", tw:"早上", ko:"아침", vi:"buổi sáng", th:"ตอนเช้า", my:"မနက်" },
        "起きる": { ja:"起きる", en:"get up", zh:"起床", tw:"起床", ko:"일어나다", vi:"dậy", th:"ตื่น", my:"အိပ်ယာက ထ" }
      },
      audio: "sentence_002.mp3"
    },

    // 3 / 5
    {
      id: "s3",
      image: "/images/reader/n5/story1/3.jpg",
      jp: "<ruby>新<rt>あたら</rt></ruby>しい <ruby>先生<rt>せんせい</rt></ruby>に あいさつします。",
      tr: {
        ja: "新しい先生にあいさつします。",
        en: "I greet the new teacher.",
        zh: "我向新老师打招呼。", tw: "我向新老師打招呼。",
        ko: "새로운 선생님께 인사합니다。", vi: "Tôi chào giáo viên mới.",
        th: "ฉันทักทายครูคนใหม่", my: "ဆရာ(မ) အသစ်ကို မင်္ဂလာပါ လုပ်တယ်။"
      },
      dict: {
        "新しい": { ja:"新しい", en:"new", zh:"新的", tw:"新的", ko:"새로운", vi:"mới", th:"ใหม่", my:"အသစ်" },
        "先生": { ja:"先生", en:"teacher", zh:"老师", tw:"老師", ko:"선생님", vi:"giáo viên", th:"ครู", my:"ဆရာ / ဆရာမ" }
      },
      audio: "sentence_003.mp3"
    },

    // 4 / 5
    {
      id: "s4",
      image: "/images/reader/n5/story1/4.jpg",
      jp: "クラスで <ruby>自己紹介<rt>じこしょうかい</rt></ruby>を します。<ruby>名前<rt>なまえ</rt></ruby>を いいます。",
      tr: {
        ja: "クラスで自己紹介をします。名前を言います。",
        en: "We do self-introductions in class. I say my name.",
        zh: "在班上做自我介绍。我说出我的名字。", tw: "在班上做自我介紹。我說出我的名字。",
        ko: "반에서 자기소개를 합니다. 이름을 말합니다。", vi: "Trong lớp, chúng tôi tự giới thiệu. Tôi nói tên của mình.",
        th: "ในห้องเรียนเราทำการแนะนำตัว ฉันบอกชื่อของฉัน", my: "အတန်းထဲမှာ ကိုယ်အကြောင်း မိတ်ဆက်ပြီး နာမည် ပြောတယ်။"
      },
      dict: {
        "自己紹介": { ja:"自己紹介", en:"self-introduction", zh:"自我介绍", tw:"自我介紹", ko:"자기소개", vi:"giới thiệu bản thân", th:"การแนะนำตัว", my:"ကိုယ်အကြောင်း မိတ်ဆက်" },
        "名前": { ja:"名前", en:"name", zh:"名字", tw:"名字", ko:"이름", vi:"tên", th:"ชื่อ", my:"နာမည်" }
      },
      audio: "sentence_004.mp3"
    },

    // 5 / 5
    {
      id: "s5",
      image: "/images/reader/n5/story1/5.jpg",
      jp: "きょう、<ruby>友<rt>とも</rt></ruby>だちが できました。たのしかったです。",
      tr: {
        ja: "今日、友達ができました。楽しかったです。",
        en: "Today, I made a friend. It was fun.",
        zh: "今天我交到了朋友。很开心。", tw: "今天我交到朋友了。很開心。",
        ko: "오늘 친구가 생겼습니다. 즐거웠습니다。", vi: "Hôm nay tôi có bạn mới. Rất vui.",
        th: "วันนี้ฉันได้เพื่อนใหม่ สนุกมาก", my: "ဒီနေ့ သူငယ်ချင်း တစ်ယောက် ရလိုက်တယ်။ ပျော်ပါတယ်။"
      },
      dict: {
        "友達": { ja:"友達", en:"friend", zh:"朋友", tw:"朋友", ko:"친구", vi:"bạn", th:"เพื่อน", my:"သူငယ်ချင်း" },
        "楽しい": { ja:"楽しい", en:"fun", zh:"有趣", tw:"有趣", ko:"즐겁다", vi:"vui", th:"สนุก", my:"ပျော်စရာကောင်း" }
      },
      audio: "sentence_005.mp3"
    }
  ]
};
