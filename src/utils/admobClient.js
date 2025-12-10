// src/utils/admobClient.js
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";

const BANNER_AD_ID = import.meta.env.VITE_ADMOB_IOS_BANNER_ID;

console.log("[AdMob] BANNER_AD_ID at import =", BANNER_AD_ID);

/** アプリ起動時に1回だけ呼ぶ（App.jsx から） */
export async function initAdMob() {
  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,        // ATT ダイアログ
      initializeForTesting: import.meta.env.DEV // 開発中はテストモード
    });
  } catch (e) {
    console.warn("[AdMob] initialize failed", e);
  }
}

/** Home画面用バナーを表示 */
export async function showHomeBanner() {
  if (!BANNER_AD_ID) {
    console.warn("[AdMob] banner ad id not set");
    return;
  }

  try {
    await AdMob.showBanner({
      adId: BANNER_AD_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    });
  } catch (e) {
    console.warn("[AdMob] showBanner failed", e);
  }
}

/** バナーを隠す */
export async function hideBanner() {
  try {
    await AdMob.hideBanner();
  } catch (e) {
    console.warn("[AdMob] hideBanner failed", e);
  }
}