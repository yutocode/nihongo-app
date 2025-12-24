// src/components/ui/CatAvatar/CatAvatar.jsx
import React, { useMemo } from "react";
import "@/styles/CatAvatar.css";

/** BASE_URL 対応（GitHub Pages / Capacitor でも崩れにくい） */
function assetUrl(path) {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = String(path || "").replace(/^\/+/, "");
  return `${cleanBase}${cleanPath}`;
}

/** ===== アセット定義（public/assets/avatars 構成に合わせる） ===== */
export const AVATAR_PART_KEYS = ["base", "athlete", "dino", "hero"];

/**
 * ✅ head.png = 頭 / body.png = 体（通常どおり）
 * ※ ここを入れ替えると、いまのスクショみたいに反対になる
 */
export const CAT_PARTS = {
  base: {
    label: "Base",
    head: assetUrl("assets/avatars/base/head.png"),
    body: assetUrl("assets/avatars/base/body.png"),
  },
  athlete: {
    label: "Athlete",
    head: assetUrl("assets/avatars/athlete/head.png"),
    body: assetUrl("assets/avatars/athlete/body.png"),
  },
  dino: {
    label: "Dino",
    head: assetUrl("assets/avatars/dino/head.png"),
    body: assetUrl("assets/avatars/dino/body.png"),
  },
  hero: {
    label: "Hero",
    head: assetUrl("assets/avatars/hero/head.png"),
    body: assetUrl("assets/avatars/hero/body.png"),
  },
};

export function isPartKey(key) {
  return Object.prototype.hasOwnProperty.call(CAT_PARTS, String(key || ""));
}

export function normalizePartKey(key, fallback = "base") {
  const k = String(key || "");
  return isPartKey(k) ? k : String(fallback || "base");
}

export function getPart(key, fallback = "base") {
  const k = normalizePartKey(key, fallback);
  return CAT_PARTS[k] || CAT_PARTS.base;
}

/**
 * CatAvatar
 * part:
 *  - "full": body + head（プレビュー/プロフィール用）
 *  - "head": head のみ（頭選択用）
 *  - "body": body のみ（体選択用）
 */
export default function CatAvatar({
  headKey = "base",
  bodyKey = "base",
  part = "full", // "full" | "head" | "body"
  className = "",
  title = "cat avatar",
}) {
  const head = useMemo(() => getPart(headKey, "base"), [headKey]);
  const body = useMemo(() => getPart(bodyKey, "base"), [bodyKey]);

  const safePart = part === "head" || part === "body" ? part : "full";
  const rootClass = ["catPng", `catPng--${safePart}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} role="img" aria-label={title}>
      {(safePart === "full" || safePart === "body") && body?.body ? (
        <img
          className="catPng__body"
          src={body.body}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      ) : null}

      {(safePart === "full" || safePart === "head") && head?.head ? (
        <img
          className="catPng__head"
          src={head.head}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      ) : null}
    </div>
  );
}