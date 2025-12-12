// src/utils/admobClient.js
import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";

// .env から取れればそれを使う。なければ固定値。
const BANNER_AD_ID =
  import.meta.env.VITE_ADMOB_BANNER_ID ||
  "ca-app-pub-2912474145038156/5506252748";

let initialized = false;

function isNativeIOS() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator?.userAgent || "";
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isNative = Capacitor.isNativePlatform();
  return isIOS && isNative;
}

export async function initAdMob() {
  if (initialized) return;
  if (!isNativeIOS()) {
    console.log("[AdMob] initAdMob skipped (not native iOS)");
    return;
  }

  try {
    console.log("[AdMob] initAdMob start");
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      initializationOptions: {},
    });
    initialized = true;
    console.log("[AdMob] initAdMob success");
  } catch (err) {
    console.error("[AdMob] initAdMob error", err);
  }
}

export async function showHomeBanner() {
  // まず初期化
  await initAdMob();
  if (!initialized) {
    console.warn("[AdMob] showHomeBanner: not initialized, abort");
    return;
  }
  if (!isNativeIOS()) {
    console.log("[AdMob] showHomeBanner skipped (not native iOS)");
    return;
  }

  try {
    console.log("[AdMob] showHomeBanner: calling AdMob.showBanner", {
      adId: BANNER_AD_ID,
    });

    await AdMob.showBanner({
      adId: BANNER_AD_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    });

    console.log("[AdMob] showHomeBanner: showBanner success");
  } catch (err) {
    console.error("[AdMob] showHomeBanner: showBanner error", err);
  }
}

export async function hideBanner() {
  if (!isNativeIOS()) return;
  try {
    console.log("[AdMob] hideBanner");
    await AdMob.hideBanner();
  } catch (err) {
    console.error("[AdMob] hideBanner error", err);
  }
}