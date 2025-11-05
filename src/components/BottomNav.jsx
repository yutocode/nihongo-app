// src/components/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiAward,      // ← ランキング用（トロフィー/メダル）
  FiFlag,
  FiCreditCard,
  FiSettings,
} from "react-icons/fi";
import "@/styles/BottomNav.css";

/**
 * NOTE:
 * - 2番目の「本」を「ランキング」に差し替え済み
 * - セーフエリア用の余白は bn-safezone で確保（CSS で env(safe-area-inset-bottom) を利用推奨）
 * - 44px 以上のタップ領域確保は CSS 側で .bn-link に padding を設定して対応
 */
const ITEMS = [
  { to: "/home",     label: "ホーム",      Icon: FiHome },
  { to: "/ranking",  label: "ランキング",  Icon: FiAward },  // ← 差し替え
  { to: "/quiz",     label: "チャレンジ",  Icon: FiFlag, accent: true },
  { to: "/premium",  label: "Pro",        Icon: FiCreditCard },
  { to: "/settings", label: "設定",       Icon: FiSettings },
];

export default function BottomNav() {
  return (
    <>
      <nav
        className="bn-wrap"
        role="navigation"
        aria-label="Bottom navigation"
      >
        <ul className="bn-bar" role="list">
          {ITEMS.map(({ to, label, Icon, accent }) => (
            <li
              key={to}
              className={`bn-item${accent ? " bn-item--accent" : ""}`}
              role="listitem"
            >
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `bn-link ${isActive ? "is-active" : ""}`
                }
                aria-label={label}
                title={label}
                // アクセシビリティ: NavLink が aria-current="page" を自動付与
              >
                <span className="bn-icon" aria-hidden="true">
                  <Icon />
                </span>
                {/* 画面読み上げにラベルを明示したい場合は下を使う（視覚的には非表示）
                <span className="sr-only">{label}</span>
                */}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* iOS のホームインジケータ上に被らないようにセーフエリアを確保 */}
      <div className="bn-safezone" aria-hidden="true" />
    </>
  );
}
