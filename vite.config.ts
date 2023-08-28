import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'
function resolve(dir) {
  return path.join(__dirname, dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:{
      '@/': resolve('src/'),
      'pages': resolve('src/pages'),
    }
  },
  server:{
    proxy:{
      '/api':{
        target: 'http://hdkq.sugarat.top',
        changeOrigin: true,
      }
    }
  }
})
