import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 這裡設定部署在 GitHub Pages 的路徑，
  // 通常是 https://<username>.github.io/<repo-name>/
  // 如果你的 Repo 名稱是 morning-card，這裡應設為 /morning-card/
  base: './', 
})
