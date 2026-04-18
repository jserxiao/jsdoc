# Vite

Vite 是下一代前端构建工具，利用浏览器原生 ESM 能力实现极速开发体验。

---

## 概述

| 特性 | 说明 |
|------|------|
| 定位 | 下一代前端构建工具 |
| 作者 | Evan You（Vue.js 作者） |
| 核心优势 | 极速冷启动、即时 HMR |
| 开发环境 | 原生 ESM，无需打包 |
| 生产构建 | Rollup 打包 |

---

## 详细文档

### 基础入门

| 文档 | 说明 |
|------|------|
| [核心特性](./核心特性.md) | 极速冷启动、即时 HMR、ESM 原生 |
| [基础配置](./基础配置.md) | 项目配置、服务器、构建选项 |

### 配置详解

| 文档 | 说明 |
|------|------|
| [服务器配置详解](./服务器配置详解.md) | host、port、proxy、HMR、HTTPS 等配置 |
| [构建配置详解](./构建配置详解.md) | target、outDir、代码分割、压缩、Source Map 配置 |
| [CSS 配置详解](./CSS配置详解.md) | CSS Modules、预处理器、PostCSS、Lightning CSS 配置 |
| [资源处理详解](./资源处理详解.md) | 图片、字体、Worker、WebAssembly、JSON 处理 |
| [依赖优化配置详解](./依赖优化配置详解.md) | 预构建、缓存、依赖发现、性能优化 |

### 高级特性

| 文档 | 说明 |
|------|------|
| [插件生态](./插件生态.md) | 常用插件、插件推荐 |
| [环境变量](./环境变量.md) | .env 文件、模式配置 |
| [库模式](./库模式.md) | 库开发配置、多格式输出 |
| [插件开发](./插件开发.md) | 插件钩子、完整示例、最佳实践 |

---

## 快速开始

### 创建项目

```bash
# 使用 npm
npm create vite@latest my-app -- --template vue-ts

# 使用 yarn
yarn create vite my-app --template vue-ts

# 使用 pnpm
pnpm create vite my-app --template vue-ts
```

### 项目结构

```
my-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 基础配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 强制重新预构建依赖
vite --force
```

---

## 核心特性

### 1. 极速冷启动

Vite 利用浏览器原生 ESM 能力，无需打包即可启动开发服务器：

```typescript
// 开发环境直接加载 ESM
<script type="module" src="/src/main.ts"></script>
```

### 2. 即时 HMR

无论应用多大，HMR 总是保持极快速度：

```typescript
// Vite 只更新改变的模块
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // 模块更新后的处理
  })
}
```

### 3. 按需编译

只编译当前页面需要的代码：

```typescript
// 动态导入，按需编译
const module = await import('./heavy-module.ts')
```

### 4. 丰富的功能

- 💡 极速的服务启动
- ⚡️ 轻量快速的热重载（HMR）
- 🛠️ 丰富的功能
- 📦 优化的构建
- 🔩 通用的插件接口
- 🔑 完全类型化的 API

---

## 配置速查

### 开发服务器

```typescript
server: {
  host: '0.0.0.0',     // 监听所有地址
  port: 3000,           // 端口号
  open: true,           // 自动打开浏览器
  cors: true,           // 启用 CORS
  proxy: {              // 代理配置
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

### 构建配置

```typescript
build: {
  target: 'es2015',     // 构建目标
  outDir: 'dist',       // 输出目录
  sourcemap: true,      // 生成 Source Map
  minify: 'esbuild',    // 压缩方式
  cssCodeSplit: true,   // CSS 代码分割
  chunkSizeWarningLimit: 500  // chunk 大小警告限制
}
```

### CSS 配置

```typescript
css: {
  modules: {
    generateScopedName: '[name]__[local]__[hash:base64:5]'
  },
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/styles/variables.scss";`
    }
  }
}
```

### 路径别名

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@utils': path.resolve(__dirname, 'src/utils')
  }
}
```

---

## 适用场景

- ✅ 新项目首选
- ✅ Vue 3 项目
- ✅ React 项目
- ✅ Svelte 项目
- ✅ 开发体验要求高的项目
- ✅ 需要快速启动的项目
- ✅ 库开发
- ✅ 组件库开发

---

## 与 Webpack 对比

| 特性 | Vite | Webpack |
|------|------|---------|
| 启动速度 | 极快（毫秒级） | 较慢（秒级） |
| HMR | 即时 | 较快 |
| 配置复杂度 | 简单 | 复杂 |
| 生态成熟度 | 成长中 | 成熟 |
| 生产构建 | Rollup | Webpack |
| 原生 ESM | ✅ | ❌ |
| 按需编译 | ✅ | ❌ |
| 适用场景 | 新项目、快速开发 | 企业级复杂项目 |

---

## 常见问题

### 1. 开发环境跨域

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://api.example.com',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  }
}
```

### 2. 路径别名不生效

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src')
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 3. 生产环境报错

```typescript
// 检查 base 配置
base: '/my-app/',  // 部署在子路径

// 检查环境变量
define: {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
}
```

### 4. 依赖预构建问题

```typescript
optimizeDeps: {
  include: ['problematic-package'],
  force: true  // 强制重新预构建
}
```

### 5. 静态资源 404

```typescript
// 使用正确的导入方式
import logo from '@/assets/logo.png'

// 或使用 public 目录
<img src="/images/logo.png" />
```

---

## 学习路径

1. **入门阶段**：核心特性 → 基础配置 → 环境变量
2. **进阶阶段**：服务器配置 → 构建配置 → CSS 配置
3. **深入阶段**：资源处理 → 依赖优化 → 插件生态
4. **高级应用**：库模式 → 插件开发 → 性能优化

---

## 相关资源

- [Vite 官方文档](https://vitejs.dev/)
- [Vite 中文文档](https://cn.vitejs.dev/)
- [Vite GitHub](https://github.com/vitejs/vite)
- [Awesome Vite](https://github.com/vitejs/awesome-vite)
- [Rollup 官方文档](https://rollupjs.org/)

---

[返回上级](../)
