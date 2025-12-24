// src/components/ui/CatAvatar/outfits.js
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
const pub = (p) => `${BASE}${String(p).replace(/^\//, "")}`;

export const OUTFITS = {
  none: { label: "None", head: null, body: null },

  athlete: {
    label: "Athlete",
    head: pub("assets/avatars/athlete/head.png"),
    body: pub("assets/avatars/athlete/body.png"),
  },

  hero: {
    label: "Hero",
    head: pub("assets/avatars/hero/head.png"),
    body: pub("assets/avatars/hero/body.png"),
  },

  dino: {
    label: "Dino",
    head: pub("assets/avatars/dino/head.png"),
    body: pub("assets/avatars/dino/body.png"),
  },
};

export const OUTFIT_KEYS = Object.keys(OUTFITS);

export function isOutfitKey(key) {
  return Object.prototype.hasOwnProperty.call(OUTFITS, key);
}

export function getOutfit(key = "none") {
  const k = String(key || "none");
  return OUTFITS[k] || OUTFITS.none;
}