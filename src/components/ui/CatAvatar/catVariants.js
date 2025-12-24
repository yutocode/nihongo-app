// src/components/ui/CatAvatar/catVariants.js
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
const pub = (p) => `${BASE}${String(p).replace(/^\//, "")}`;

export const CAT_VARIANTS = {
  base: {
    label: "Base",
    head: pub("assets/avatars/base/cat-head.png"),
    body: pub("assets/avatars/base/cat-body.png"),
  },
};

export const CAT_VARIANT_KEYS = Object.keys(CAT_VARIANTS);

export function isVariantKey(key) {
  return Object.prototype.hasOwnProperty.call(CAT_VARIANTS, key);
}

export function getCatVariant(key = "base") {
  const k = String(key || "base");
  return CAT_VARIANTS[k] || CAT_VARIANTS.base;
}