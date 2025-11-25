// src/components/BottomNav.jsx
import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiAward, // ランキング
  FiFlag, // チャレンジ（模試）
  FiLock, // Premium ロック中
  FiSettings,
} from "react-icons/fi";
import { useAppStore } from "../store/useAppStore";
import { EXAM_REGISTRY } from "@/data/exam";
import "@/styles/BottomNav.css";

/**
 * 各レベルごとの「最初の模試ID」を取得（Home.jsx と同じロジック）
 */
const LEVEL_KEYS = ["n5", "n4", "n3", "n2", "n1"];

// ★ iOS 審査中はここを false にして模試タブを完全ロック
const ENABLE_EXAM_NAV = false;
// ★ iOS 審査中はランキングもロック
const ENABLE_RANKING_NAV = false;

const AUTO_EXAM_BY_LEVEL = (() => {
  const map = { n5: null, n4: null, n3: null, n2: null, n1: null };

  for (const [examId, pack] of Object.entries(EXAM_REGISTRY)) {
    const lv = (pack?.meta?.level || "").toLowerCase(); // "N5" → "n5"
    if (LEVEL_KEYS.includes(lv) && !map[lv]) {
      map[lv] = examId; // そのレベルで最初に見つかった模試を採用
    }
  }

  return map;
})();

export default function BottomNav() {
  const level = useAppStore((s) => s.level) || "n5";

  // 現在レベルの模試IDと、その遷移先パス
  const examId = useMemo(
    () => AUTO_EXAM_BY_LEVEL[level] || null,
    [level]
  );
  const examPath = examId ? `/exam/${examId}` : "/quiz"; // 将来用に残しておく

  const items = [
    { to: "/home", label: "ホーム", Icon: FiHome },
    {
      to: "/ranking",
      label: "ランキング",
      Icon: FiAward,
      disabled: !ENABLE_RANKING_NAV,
    },
    // ★ 真ん中：チャレンジ（いまは完全ロック）
    {
      to: examPath,
      label: "チャレンジ",
      Icon: FiFlag,
      accent: true,
      // examId があっても ENABLE_EXAM_NAV=false の間は押せない
      disabled: !ENABLE_EXAM_NAV || !examId,
    },
    // ★ Premium：鍵マーク＋ロック中（近日公開）＝タップできない
    {
      to: "/premium",
      label: "Premium",
      Icon: FiLock,
      disabled: true,
    },
    { to: "/settings", label: "設定", Icon: FiSettings },
  ];

  return (
    <>
      <nav
        className="bn-wrap"
        role="navigation"
        aria-label="Bottom navigation"
      >
        <ul className="bn-bar" role="list">
          {items.map(({ to, label, Icon, accent, disabled }) => {
            const itemClass = [
              "bn-item",
              accent ? "bn-item--accent" : "",
              disabled ? "bn-item--disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const ariaLabel = disabled ? `${label}（近日公開）` : label;

            return (
              <li key={to + label} className={itemClass} role="listitem">
                {disabled ? (
                  // 🔒 ロック中タブ：見た目は他と同じ / クリック・フォーカス不可
                  <span
                    className="bn-link bn-link--disabled"
                    aria-label={ariaLabel}
                    aria-disabled="true"
                  >
                    <span className="bn-icon" aria-hidden="true">
                      <Icon />
                    </span>
                  </span>
                ) : (
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `bn-link ${isActive ? "is-active" : ""}`
                    }
                    aria-label={ariaLabel}
                    title={label}
                  >
                    <span className="bn-icon" aria-hidden="true">
                      <Icon />
                    </span>
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* iOS のホームインジケータ上に被らないようにセーフエリアを確保 */}
      <div className="bn-safezone" aria-hidden="true" />
    </>
  );
}