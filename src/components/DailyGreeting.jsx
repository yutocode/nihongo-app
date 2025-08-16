// src/components/DailyGreeting.jsx
import React, { useMemo } from "react";

function pickDaily(arr) {
  // その日のみ固定で変わるように（安定した擬似ランダム）
  const key = new Date().toISOString().slice(0,10); // YYYY-MM-DD
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

export default function DailyGreeting() {
  const message = useMemo(() => {
    const hour = new Date().getHours();
    const timeHello =
      hour < 11 ? "おはよう！" :
      hour < 18 ? "こんにちは！" : "こんばんは！";

    const lines = [
      "今日もがんばりましょう💪",
      "一歩ずつ、確実に📚",
      "継続は力なり🔥",
      "小さな積み重ねが力になる✨",
      "習慣が未来をつくる🌱",
      "昨日の自分を超えよう🚀",
      "コツコツいこう👍",
    ];
    return `${timeHello} ${pickDaily(lines)}`;
  }, []);

  return (
    <div className="home-greeting">
      <div className="home-hello">{message}</div>
    </div>
  );
}