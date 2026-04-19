# 常用 CLI 对比

> 前端脚手架 CLI 工具帮助开发者快速初始化项目、生成代码模板、统一项目结构，是提升开发效率的重要工具。

## 学习要点

- 🔍 了解主流脚手架工具的特点
- ⚖️ 掌握各工具的优缺点对比
- 🎯 学会根据场景选择合适的工具
- 📦 理解 Monorepo 工具的应用

---

## 1. 脚手架工具分类

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  前端脚手架工具分类                                                                    │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  项目初始化脚手架                                                                │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ create-vite        - Vite 官方脚手架，多框架支持                         │  │ │
│  │  │ create-react-app   - React 官方脚手架，零配置开箱即用                     │  │ │
│  │  │ Vue CLI            - Vue 生态脚手架，插件体系完善                         │  │ │
│  │  │ Angular CLI        - Angular 官方脚手架，功能完备                        │  │ │
│  │  │ create-next-app    - Next.js 官方脚手架                                  │  │ │
│  │  │ create-nuxt-app    - Nuxt.js 官方脚手架                                  │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Monorepo 管理工具                                                              │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ Nx                 - 企业级 Monorepo，功能全面                           │  │ │
│  │  │ Turborepo          - 高性能构建系统，增量构建                            │  │ │
│  │  │ pnpm workspaces    - 轻量级 Monorepo 方案                                │  │ │
│  │  │ Lerna              - 经典 Monorepo 工具                                  │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  代码生成工具                                                                    │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ plop               - 交互式代码生成器                                     │  │ │
│  │  │ hygen              - 快速代码生成器                                       │  │ │
│  │  │ yeoman             - 通用脚手架生成器                                     │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 项目初始化脚手架对比

### 2.1 create-vite

```bash
# 创建项目
npm create vite@latest my-project

# 选择模板
# vanilla, vue, vue-ts, react, react-ts, react-swc, react-swc-ts, preact, preact-ts
# lit, lit-ts, svelte, svelte-ts, solid, solid-ts, qwik, qwik-ts
```

| 特性 | 说明 |
|------|------|
| **定位** | Vite 官方脚手架，多框架支持 |
| **优势** | 极速启动、HMR 快、模板丰富、轻量配置 |
| **劣势** | 需要手动配置 SSR、SSG 等高级功能 |
| **适用场景** | 新项目首选、Vue 3 项目、React 项目 |
| **模板数量** | 20+ 官方模板 |

```javascript
// create-vite 创建流程
// 1. 选择框架
// 2. 选择变体（JS/TS）
// 3. 生成项目结构

// 项目结构（react-ts）
my-project/
├── public/
│   └── vite.svg
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### 2.2 create-react-app

```bash
# 创建项目
npx create-react-app my-app

# TypeScript 模板
npx create-react-app my-app --template typescript
```

| 特性 | 说明 |
|------|------|
| **定位** | React 官方脚手架，零配置开箱即用 |
| **优势** | 配置完善、生态成熟、文档丰富 |
| **劣势** | 构建速度慢（Webpack）、定制困难、维护状态不佳 |
| **适用场景** | React 学习、中小型项目 |
| **打包工具** | Webpack（默认）、可切换到 Vite |

```javascript
// create-react-app 项目结构
my-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md

// eject 暴露配置（不推荐）
npm run eject
```

### 2.3 Vue CLI

```bash
# 创建项目
npm create vue@latest my-project

# 或使用旧版 Vue CLI
npm install -g @vue/cli
vue create my-project
```

| 特性 | 说明 |
|------|------|
| **定位** | Vue 生态脚手架，插件体系完善 |
| **优势** | 图形界面、插件丰富、配置灵活 |
| **劣势** | 基于 Webpack，构建较慢；Vue 3 推荐使用 create-vite |
| **适用场景** | Vue 2 企业项目、需要图形界面 |
| **插件生态** | Vuex、Router、ESLint、PWA 等 |

```javascript
// Vue CLI 插件体系
// vue.config.js
module.exports = {
  // 内置配置
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  
  // 插件配置
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/styles/variables.scss')
      ]
    }
  }
}
```

### 2.4 Angular CLI

```bash
# 安装
npm install -g @angular/cli

# 创建项目
ng new my-app

# 生成组件
ng generate component my-component
ng g c my-component  # 简写

# 生成服务
ng g s my-service
```

| 特性 | 说明 |
|------|------|
| **定位** | Angular 官方脚手架，功能完备 |
| **优势** | 功能全面、代码生成、测试完善、构建优化 |
| **劣势** | 学习曲线陡峭、配置复杂 |
| **适用场景** | Angular 企业项目 |
| **内置命令** | generate、build、serve、test、e2e |

```javascript
// Angular CLI 项目结构
my-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   └── main.ts
├── angular.json       // 项目配置
├── package.json
└── tsconfig.json
```

### 2.5 create-next-app

```bash
# 创建项目
npx create-next-app@latest my-app

# TypeScript
npx create-next-app@latest my-app --typescript
```

| 特性 | 说明 |
|------|------|
| **定位** | Next.js 官方脚手架 |
| **优势** | SSR/SSG/ISR 支持、API Routes、图片优化 |
| **劣势** | 需要理解 Next.js 概念 |
| **适用场景** | React SSR 项目、SEO 要求高的项目 |
| **打包工具** | Webpack（可切换 Turbopack） |

### 2.6 create-nuxt-app

```bash
# 创建项目
npx nuxi init my-app

# 或
npm create nuxt-app my-app
```

| 特性 | 说明 |
|------|------|
| **定位** | Nuxt.js 官方脚手架 |
| **优势** | SSR/SSG 支持、自动路由、Vue 生态 |
| **劣势** | Nuxt 2 和 Nuxt 3 差异较大 |
| **适用场景** | Vue SSR 项目、全栈应用 |

---

## 3. 综合对比表

### 3.1 功能对比

| 特性 | create-vite | create-react-app | Vue CLI | Angular CLI | create-next |
|------|-------------|------------------|---------|-------------|-------------|
| **框架支持** | 多框架 | React | Vue | Angular | Next.js |
| **TypeScript** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **CSS 预处理** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SSR** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **SSG** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **代码分割** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **HMR** | 极快 | 较慢 | 较慢 | 较慢 | 较快 |
| **插件生态** | 中等 | 丰富 | 丰富 | 完备 | 丰富 |
| **学习曲线** | 简单 | 简单 | 中等 | 陡峭 | 中等 |

### 3.2 性能对比

| 工具 | 启动时间 | HMR 速度 | 构建时间 | 打包工具 |
|------|---------|---------|---------|---------|
| create-vite | < 1s | < 100ms | 快 | Vite/Rollup |
| create-react-app | 10-30s | 1-3s | 慢 | Webpack |
| Vue CLI | 10-30s | 1-3s | 慢 | Webpack |
| Angular CLI | 10-30s | 1-3s | 中等 | Webpack |
| create-next | 5-15s | < 500ms | 中等 | Webpack/Turbopack |

### 3.3 适用场景选择

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  脚手架工具选型指南                                                                    │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  新项目                                                                         │ │
│  │  ├── Vue 3 项目        → create-vite                                           │ │
│  │  ├── React 项目        → create-vite / create-next                             │ │
│  │  ├── Angular 项目      → Angular CLI                                           │ │
│  │  ├── 需要 SSR          → create-next (React) / create-nuxt (Vue)               │ │
│  │  └── 学习/演示         → create-vite（最简单）                                  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  企业项目                                                                       │ │
│  │  ├── 大型团队         → Nx（Monorepo 管理）                                     │ │
│  │  ├── Vue 2 迁移项目   → Vue CLI                                                 │ │
│  │  ├── 需要图形界面     → Vue CLI                                                 │ │
│  │  └── 微前端架构       → create-vite + qiankun                                   │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  特殊需求                                                                       │ │
│  │  ├── SEO 要求高        → create-next / create-nuxt                             │ │
│  │  ├── 需要快速原型      → create-vite                                           │ │
│  │  ├── 库开发           → create-vite（library 模式）                             │ │
│  │  └── 静态站点          → Vite + vite-plugin-ssg                                │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Monorepo 工具对比

### 4.1 Nx

```bash
# 创建 Monorepo
npx create-nx-workspace@latest my-workspace

# 创建应用
nx g @nx/react:app my-app

# 创建库
nx g @nx/react:lib my-lib
```

| 特性 | 说明 |
|------|------|
| **定位** | 企业级 Monorepo 工具 |
| **优势** | 代码生成、依赖图、增量构建、插件丰富 |
| **劣势** | 学习曲线较陡、配置复杂 |
| **适用场景** | 大型企业项目、多团队协作 |

```javascript
// nx.json 配置
{
  "npmScope": "my-org",
  "affected": {
    "defaultBase": "main"
  },
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "e2e"]
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 4.2 Turborepo

```bash
# 创建 Monorepo
npx create-turbo@latest my-turbo

# 构建所有项目
turbo run build

# 增量构建
turbo run build --filter=my-app
```

| 特性 | 说明 |
|------|------|
| **定位** | 高性能 Monorepo 构建系统 |
| **优势** | 极快的增量构建、远程缓存、配置简单 |
| **劣势** | 代码生成能力较弱 |
| **适用场景** | 注重构建性能的 Monorepo 项目 |

```javascript
// turbo.json 配置
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 4.3 Monorepo 工具对比

| 特性 | Nx | Turborepo | pnpm workspaces | Lerna |
|------|-----|-----------|-----------------|-------|
| **增量构建** | ✅ | ✅✅ | ❌ | ❌ |
| **远程缓存** | ✅ | ✅ | ❌ | ❌ |
| **代码生成** | ✅✅ | ❌ | ❌ | ❌ |
| **依赖图** | ✅✅ | ✅ | ❌ | ✅ |
| **学习曲线** | 陡峭 | 简单 | 简单 | 中等 |
| **构建性能** | 快 | 极快 | 一般 | 一般 |
| **适用规模** | 大型 | 中大型 | 中小型 | 中小型 |

---

## 5. 代码生成工具对比

### 5.1 plop

```javascript
// plopfile.js
module.exports = function(plop) {
  plop.setGenerator('component', {
    description: '创建组件',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '组件名称'
      },
      {
        type: 'list',
        name: 'type',
        message: '组件类型',
        choices: ['functional', 'class']
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{name}}/index.tsx',
        templateFile: 'templates/component.hbs'
      }
    ]
  });
};
```

| 特性 | 说明 |
|------|------|
| **模板引擎** | Handlebars |
| **交互提示** | 支持（丰富的 prompt 类型） |
| **适用场景** | 需要交互式生成的场景 |

### 5.2 hygen

```yaml
# _templates/component/new/index.tsx.ejs.t
---
to: src/components/<%= name %>/index.tsx
---
import React from 'react';

export const <%= h.changeCase.pascal(name) %> = () => {
  return <div><%= h.changeCase.pascal(name) %></div>;
};
```

| 特性 | 说明 |
|------|------|
| **模板引擎** | EJS |
| **交互提示** | 不支持 |
| **适用场景** | 快速批量生成 |

### 5.3 对比

| 特性 | plop | hygen | yeoman |
|------|------|-------|--------|
| **模板引擎** | Handlebars | EJS | EJS |
| **交互提示** | ✅✅ | ❌ | ✅✅ |
| **学习曲线** | 简单 | 简单 | 中等 |
| **生成速度** | 一般 | 快 | 一般 |
| **灵活性** | 高 | 高 | 最高 |
| **适用场景** | 交互生成 | 快速生成 | 完整脚手架 |

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  脚手架工具使用最佳实践                                                                │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  项目初始化                                                                            │
│  □ 新项目优先使用 create-vite                                                        │
│  □ 需要 SSR 使用 create-next 或 create-nuxt                                         │
│  □ 企业项目考虑 Nx 管理复杂度                                                        │
│  □ 避免过度配置，保持项目简洁                                                        │
│                                                                                       │
│  Monorepo 管理                                                                        │
│  □ 注重构建性能选择 Turborepo                                                        │
│  □ 需要代码生成选择 Nx                                                               │
│  □ 轻量场景使用 pnpm workspaces                                                     │
│  □ 合理划分包边界，避免过度拆分                                                      │
│                                                                                       │
│  代码生成                                                                              │
│  □ 需要交互选择 plop                                                                 │
│  □ 追求速度选择 hygen                                                                │
│  □ 统一团队模板，保持代码风格一致                                                    │
│  □ 将模板纳入版本控制                                                                │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
