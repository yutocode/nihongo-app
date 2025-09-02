import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0', // スマホや他PCからアクセス可能にする
    port: 5173,      // デフォルトポート
    strictPort: true, // ポートが埋まってたらエラーにする（自動変更しない）
    open: false,     // 起動時にブラウザ自動オープンしない
  },
})

