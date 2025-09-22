// src/data/reader/n5Levels.js
// N5 のストーリーを 3 レベル × 5 本ずつで定義
// 画像は public/images/reader/n5/<storyId>/cover.jpg に置く運用

export const n5Levels = [
  {
    id: "level1",
    title: "Level 1",
    unlocked: true,            // 最初のレベルは解放
    progressDots: 6,           // UIで使う「緑ドット」の個数（任意）
    stories: [
      { id: "story1",  tag: "School",     title: "First Day at School（学校の初日）",      time: "~5 min", img: "/images/reader/n5/story1/cover.jpg",  locked: false },
      { id: "story2",  tag: "Daily Life", title: "Morning Routine（朝のルーティン）",       time: "~5 min", img: "/images/reader/n5/story2/cover.jpg",  locked: true  },
      { id: "story3",  tag: "Shopping",   title: "Shopping at the Supermarket（スーパーで買い物）", time: "~5 min", img: "/images/reader/n5/story3/cover.jpg",  locked: true  },
      { id: "story4",  tag: "Friends",    title: "Lunch with Friends（友達と昼ごはん）",    time: "~5 min", img: "/images/reader/n5/story4/cover.jpg",  locked: true  },
      { id: "story5",  tag: "Home",       title: "Family Dinner（家族の夕食）",             time: "~5 min", img: "/images/reader/n5/story5/cover.jpg",  locked: true  },
    ],
  },
  {
    id: "level2",
    title: "Level 2",
    unlocked: false,
    progressDots: 6,
    stories: [
      { id: "story6",  tag: "Travel",     title: "Train to Kyoto（電車で京都へ）",          time: "~5 min", img: "/images/reader/n5/story6/cover.jpg",  locked: true },
      { id: "story7",  tag: "Daily Life", title: "Cleaning the Room（部屋の掃除）",         time: "~5 min", img: "/images/reader/n5/story7/cover.jpg",  locked: true },
      { id: "story8",  tag: "School",     title: "Library Visit（図書館へ行く）",           time: "~5 min", img: "/images/reader/n5/story8/cover.jpg",  locked: true },
      { id: "story9",  tag: "Shopping",   title: "Buying Clothes（服を買う）",               time: "~5 min", img: "/images/reader/n5/story9/cover.jpg",  locked: true },
      { id: "story10", tag: "Food",       title: "Making Curry（カレーを作る）",             time: "~5 min", img: "/images/reader/n5/story10/cover.jpg", locked: true },
    ],
  },
  {
    id: "level3",
    title: "Level 3",
    unlocked: false,
    progressDots: 6,
    stories: [
      { id: "story11", tag: "Daily Life", title: "Rainy Day（雨の日）",                      time: "~5 min", img: "/images/reader/n5/story11/cover.jpg", locked: true },
      { id: "story12", tag: "School",     title: "Sports Day（運動会）",                      time: "~5 min", img: "/images/reader/n5/story12/cover.jpg", locked: true },
      { id: "story13", tag: "Travel",     title: "Trip to the Sea（海への旅行）",             time: "~5 min", img: "/images/reader/n5/story13/cover.jpg", locked: true },
      { id: "story14", tag: "Food",       title: "Sushi Restaurant（寿司屋での体験）",       time: "~5 min", img: "/images/reader/n5/story14/cover.jpg", locked: true },
      { id: "story15", tag: "Friends",    title: "Birthday Party（誕生日パーティー）",       time: "~5 min", img: "/images/reader/n5/story15/cover.jpg", locked: true },
    ],
  },
];
