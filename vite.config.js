import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/yk3dshow/', // 必须与你的仓库名一致，前后都要有斜杠
  plugins: [react()],
  server: {
    host: true, // 允许外部访问
    port: 5173
  }
})