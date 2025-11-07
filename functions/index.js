const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { LEAGUES, LEAGUE_CONFIG, LEAGUE_MEMBER_LIMIT } = require("./leagues-const");
admin.initializeApp();
const db = admin.firestore();

exports.recalcLeagues = functions.pubsub
  .schedule("every sunday 23:59")
  .timeZone("Asia/Tokyo") // 好きなタイムゾーン
  .onRun(async () => {
    const usersSnap = await db
      .collection("users")
      .where("privacy.showInRanking", "==", true)
      .get();

    const users = [];
    usersSnap.forEach((doc) => {
      const d = doc.data();
      users.push({
        id: doc.id,
        weeklyXP: d.weeklyXP || 0,
        league: d.league || "bronze",
      });
    });

    // リーグごとに処理
    const updates = [];
    for (const league of LEAGUES) {
      const conf = LEAGUE_CONFIG[league];
      const leagueUsers = users
        .filter((u) => u.league === league)
        .sort((a, b) => b.weeklyXP - a.weeklyXP);

      if (leagueUsers.length === 0) continue;

      // 30人ずつのグループに分割（Duolingo風）
      for (let i = 0; i < leagueUsers.length; i += LEAGUE_MEMBER_LIMIT) {
        const group = leagueUsers.slice(i, i + LEAGUE_MEMBER_LIMIT);
        const groupId = makeGroupId(league, i / LEAGUE_MEMBER_LIMIT);

        group.forEach((u, index) => {
          const rank = index + 1;
          const upCount = conf.up || 0;
          const downCount = conf.down || 0;

          let newLeague = league;

          const leagueIndex = LEAGUES.indexOf(league);
          if (upCount > 0 && rank <= upCount && leagueIndex < LEAGUES.length - 1) {
            newLeague = LEAGUES[leagueIndex + 1];
          } else if (downCount > 0 && rank > group.length - downCount && leagueIndex > 0) {
            newLeague = LEAGUES[leagueIndex - 1];
          }

          // アップデート予約（weeklyXPリセット & 新リーグ & groupId）
          updates.push({
            id: u.id,
            newLeague,
            newGroupId: groupId,
          });
        });
      }
    }

    // バッチ反映
    const batch = db.batch();
    for (const u of updates) {
      const ref = db.collection("users").doc(u.id);
      batch.update(ref, {
        league: u.newLeague,
        leagueGroupId: u.newGroupId,
        weeklyXP: 0,
      });
    }
    await batch.commit();

    console.log("Leagues recalculated", updates.length);
    return null;
  });

function makeGroupId(league, n) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const week = getWeekNumber(now); // helperで週番号
  return `${year}W${week}-${league}-${n}`;
}

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}
