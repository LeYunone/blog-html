import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
    },
    plugins: [vue()],
    publicDir:'public',
    baseUrl: './',
    server: {
        host: 'localhost',
        port: 8888,
        open: true,
        strictPort: false,
        https: false,
        proxy: {
          '/leyuna': {
                target: 'http://127.0.0.1:9000',
                changeOrigin: true,
                secure: false,
                pathRewrite:{
                    '/leyuna':""
                }
          },
          '/blogIndex':{
              target: 'http://127.0.0.1:8001',
              changeOrigin: true,
              secure : false
          }
        }
    },
    optimizeDeps: {
        include: ['schart.js']
    },
    //生产模式打包配置
    build:{
        outDir: 'dist',//Specify the output directory (relative to project root).
    }
})