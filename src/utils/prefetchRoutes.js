// src/utils/prefetchRoutes.js
export const prefetchMap = {
  "/home": () => import("@/pages/Home"),
  "/ranking": () => import("@/pages/RankingPage"),
  "/level": () => import("@/pages/LevelSelectPage"),
  // 主要遷移先だけでOK。増やすほど効果↑
};

export function prefetchByHref(href = "") {
  const path = href.split("?")[0];
  if (prefetchMap[path]) prefetchMap[path]();
}
