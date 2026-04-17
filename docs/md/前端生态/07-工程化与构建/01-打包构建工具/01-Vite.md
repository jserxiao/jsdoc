# Vite

## 定位

下一代前端构建工具，利用浏览器原生 ESM 能力实现极速开发体验。

## 核心特点

- **极速冷启动**：无需打包，按需编译
- **即时 HMR**：模块级别热更新，毫秒级响应
- **ESM 原生**：开发环境直接使用 ES Modules
- **开箱即用**：TypeScript、JSX、CSS 预处理器支持
- **优化构建**：生产环境使用 Rollup 打包

## 基础配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://backend-server',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          utils: ['lodash', 'dayjs']
        }
      }
    }
  }
})
```

## 常用插件

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),                    // Vue 支持
    react(),                  // React 支持
    svgr(),                   // SVG 转 React 组件
    compression(),            // Gzip 压缩
  ]
})
```

## 环境变量

```bash
# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://api.example.com
```

```javascript
// 使用环境变量
const apiUrl = import.meta.env.VITE_API_URL
```

## 库模式配置

```javascript
// vite.config.js (库模式)
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

## 适用场景

- 新项目首选
- Vue / React / Svelte 项目
- 开发体验要求高的项目
- 需要快速启动的项目

## 与 Webpack 对比

| 特性 | Vite | Webpack |
|------|------|---------|
| 启动速度 | 极快（毫秒级） | 较慢（秒级） |
| HMR | 即时 | 较快 |
| 配置复杂度 | 简单 | 复杂 |
| 生态成熟度 | 成长中 | 成熟 |
| 生产构建 | Rollup | Webpack |
