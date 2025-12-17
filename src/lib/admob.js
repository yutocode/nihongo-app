// src/lib/admob.js
import { AdMob, BannerAdSize, BannerAdPosition } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

let initialized = false;

export async function showBanner() {
  // Web（ブラウザ）では何もしない
  if (!Capacitor.isNativePlatform()) return;

  // 初期化は1回だけ
  if (!initialized) {
    await AdMob.initialize();
    initialized = true;
  }

  await AdMob.showBanner({
    adId: "ca-app-pub-3940256099942544/6300978111", // まずはテストIDでOK
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
  });
}

export async function hideBanner() {
  if (!Capacitor.isNativePlatform()) return;
  await AdMob.hideBanner();
}