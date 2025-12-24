import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.nihongoapp.mobile",
  appName: "Nihongo app1-5",
  webDir: "dist",
  bundledWebRuntime: false,

  server: {
    /**
     * ✅ iOS(WKWebView)で Firestore の Listen/channel が
     * 「due to access control checks」になるのを避ける定番設定。
     * capacitor://localhost ではなく https://localhost 扱いにする。
     */
    hostname: "localhost",
    iosScheme: "https",

    /**
     * ▼ ローカル開発でVite dev serverをiOS/Androidから見る時だけ使う
     * （普段はコメントのままでOK）
     */
    // url: "http://192.168.0.xxx:5173",
    // cleartext: true,
  },
};

export default config;