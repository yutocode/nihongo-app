// src/components/BottomNav.jsx
import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiAward, FiFlag, FiLock, FiSettings } from "react-icons/fi";
import { useAppStore } from "../store/useAppStore";
import { EXAM_REGISTRY } from "@/data/exam";
import "@/styles/BottomNav.css";

const LEVEL_KEYS = ["n5", "n4", "n3", "n2", "n1"];

// ✅ ランキング復活
const ENABLE_RANKING_NAV = true;

// iOS審査中ならここだけ false のままでOK
const ENABLE_EXAM_NAV = false;

const AUTO_EXAM_BY_LEVEL = (() => {
  const map = { n5: null, n4: null, n3: null, n2: null, n1: null };
  for (const [examId, pack] of Object.entries(EXAM_REGISTRY)) {
    const lv = (pack?.meta?.level || "").toLowerCase();
    if (LEVEL_KEYS.includes(lv) && !map[lv]) map[lv] = examId;
  }
  return map;
})();

export default function BottomNav() {
  const level = useAppStore((s) => s.level) || "n5";

  const examId = useMemo(() => AUTO_EXAM_BY_LEVEL[level] || null, [level]);
  const examPath = examId ? `/exam/${examId}` : "/quiz";

  const items = [
    { to: "/home", label: "ホーム", Icon: FiHome },
    {
      to: "/ranking",
      label: "ランキング",
      Icon: FiAward,
      disabled: !ENABLE_RANKING_NAV,
    },
    {
      to: examPath,
      label: "チャレンジ",
      Icon: FiFlag,
      accent: true,
      disabled: !ENABLE_EXAM_NAV || !examId,
    },
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
      <nav className="bn-wrap" role="navigation" aria-label="Bottom navigation">
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
      <div className="bn-safezone" aria-hidden="true" />
    </>
  );
}