# 十三、模块化与工程化

模块化与工程化是现代 JavaScript 开发的基石。模块化解决了代码组织、依赖管理和命名冲突问题，而工程化则涵盖构建、打包、发布等自动化流程。

---

## 模块概述

JavaScript 从简单的脚本语言发展为构建复杂应用的语言，模块化和工程化起到了关键作用。本模块将从模块化规范到构建工具，全面介绍现代前端工程化的核心知识。

### 学习目标

- 理解模块化的演进历史和各种规范（CommonJS、ESM、AMD 等）
- 掌握 npm、yarn、pnpm 等包管理工具的使用
- 深入理解 package.json 的各项配置
- 熟练使用 Webpack、Vite 等构建工具

---

## 📁 模块目录

| 序号 | 模块 | 文件 | 内容概述 |
|------|------|------|----------|
| 1 | 模块化规范 | [01-模块化规范.md](./01-模块化规范.md) | CommonJS、AMD、CMD、UMD、ES Modules、循环依赖 |
| 2 | 包管理工具 | [02-包管理工具.md](./02-包管理工具.md) | npm、yarn、pnpm 对比、语义化版本、最佳实践 |
| 3 | package.json详解 | [03-package.json详解.md](./03-package.json详解.md) | 所有属性详解、依赖管理、脚本配置、工作区 |
| 4 | 构建工具 | [04-构建工具.md](./04-构建工具.md) | Webpack、Vite、Rollup、esbuild 配置与对比 |

---

## 核心概念速览

### 模块化演进

```
全局函数 → 命名空间 → IIFE → CommonJS → AMD/CMD → ES Modules
```

### 模块规范对比

| 规范 | 加载方式 | 迓行环境 | 特点 |
|------|----------|----------|------|
| CommonJS | 同步 | Node.js | 服务端标准、运行时加载 |
| AMD | 异步 | 浏览器 | RequireJS、预加载 |
| CMD | 异步 | 浏览器 | SeaJS、按需加载 |
| UMD | 通用 | 两者 | 兼容多种规范 |
| ES Modules | 静态/动态 | 两者 | ES6 标准、静态分析 |

### ES Modules 核心语法

```javascript
// 导出
export const name = 'value';
export function fn() {}
export default class {}
export { a, b } from './module';

// 导入
import name from './module';
import { a, b } from './module';
import * as all from './module';
import('./module').then(m => {});  // 动态导入
```

### 包管理工具对比

| 特性 | npm | yarn | pnpm |
|------|-----|------|------|
| 安装速度 | 较快 | 快 | 最快 |
| 磁盘空间 | 一般 | 一般 | 极省 |
| 幽灵依赖 | 有 | 有 | 无 |
| node_modules | 扁平化 | 扁平化 | 符号链接 |
| Monorepo | workspaces | workspaces | workspace |

### 构建工具对比

| 特性 | Webpack | Vite | Rollup | esbuild |
|------|---------|------|--------|---------|
| 开发服务器 | ✅ | ✅ | ❌ | ✅ |
| HMR | ✅ | ✅ | ❌ | ❌ |
| 构建速度 | 慢 | 快 | 中 | 极快 |
| 配置复杂度 | 高 | 低 | 中 | 低 |
| 适用场景 | 应用 | 应用 | 库 | 通用 |

---

## 实用速查

### npm 常用命令

```bash
# 初始化项目
npm init -y

# 安装依赖
npm install <package>        # 生产依赖
npm install <package> -D     # 开发依赖
npm install <package> -g     # 全局安装

# 运行脚本
npm run <script>
npm start / npm test

# 查看信息
npm list --depth=0
npm outdated
npm audit

# 发布包
npm login
npm publish
```

### package.json 核心字段

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.js",
  "module": "esm/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  },
  "peerDependencies": {
    "react": ">=16.8.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 版本范围语法

| 符号 | 含义 | 示例 |
|------|------|------|
| `^` | 兼容次版本 | `^1.2.3` → `>=1.2.3 <2.0.0` |
| `~` | 兼容补丁版本 | `~1.2.3` → `>=1.2.3 <1.3.0` |
| `>` | 大于 | `>1.2.3` |
| `>=` | 大于等于 | `>=1.2.3` |
| `\|\|` | 或 | `^1.0.0 \|\| ^2.0.0` |

### Webpack 核心配置

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ],
  optimization: {
    splitChunks: { chunks: 'all' }
  }
};
```

### Vite 核心配置

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: { '/api': 'http://localhost:8080' }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: { '@': '/src' }
  }
});
```

---

## 知识关联

### 与其他模块的关系

```
模块化与工程化
    ├── 基础语法与核心概念（模块语法基础）
    ├── 异步编程（动态导入、异步加载）
    ├── ES6+新特性（ES Modules）
    └── 性能优化（构建优化、代码分割）
```

### 工程化流程

```
源代码
    ↓ 编译（Babel、TypeScript）
    ↓ 打包（Webpack、Vite）
    ↓ 优化（压缩、Tree Shaking）
    ↓ 测试（Jest、Vitest）
    ↓ 发布（npm、Docker）
生产环境
```

---

## 常见陷阱

### 1. 循环依赖

```javascript
// a.js
const b = require('./b');
exports.a = 1;

// b.js
const a = require('./a');  // 得到不完整的 a
exports.b = 2;

// 解决方案：延迟加载或重构代码结构
```

### 2. 幽灵依赖

```javascript
// npm/yarn 中可能访问未声明的依赖
const lodash = require('lodash');  // 即使未在 package.json 中声明

// pnpm 严格禁止，推荐使用
```

### 3. 版本锁定问题

```bash
# 始终提交锁文件
git add package-lock.json yarn.lock pnpm-lock.yaml

# 不要手动修改锁文件
```

### 4. 热更新失效

```javascript
// Vite: 确保使用 ES Modules
// ❌ CommonJS 方式
const foo = require('./foo');

// ✅ ES Modules 方式
import { foo } from './foo';
```

---

## 最佳实践

### 项目结构

```
my-project/
├── src/
│   ├── index.js
│   ├── components/
│   ├── utils/
│   └── styles/
├── public/
├── tests/
├── package.json
├── vite.config.js
└── README.md
```

### 脚本命名规范

```json
{
  "scripts": {
    "dev": "开发服务器",
    "build": "生产构建",
    "preview": "预览构建结果",
    "test": "运行测试",
    "lint": "代码检查",
    "format": "代码格式化",
    "typecheck": "类型检查"
  }
}
```

### 依赖分类原则

| 类型 | 用途 | 示例 |
|------|------|------|
| dependencies | 运行时必需 | react、axios、lodash |
| devDependencies | 开发/构建时使用 | webpack、vite、jest、eslint |
| peerDependencies | 宿主环境提供 | react（组件库）、vue（插件） |
| optionalDependencies | 可选功能 | fsevents（macOS 专用） |

---

## 学习路径

### 初级：基础使用
1. 理解模块化的概念和好处
2. 掌握 ES Modules 的导入导出语法
3. 学会使用 npm 安装和管理依赖
4. 能够使用 Vite 创建简单项目

### 中级：深入理解
1. 理解各种模块规范的区别和应用场景
2. 掌握 package.json 的常用配置
3. 学会配置 Webpack 或 Vite
4. 理解构建流程和打包原理

### 高级：工程化实践
1. 搭建企业级项目脚手架
2. 配置 Monorepo 工作区
3. 优化构建性能和产物体积
4. 实现自动化 CI/CD 流程

---

## 推荐资源

### 官方文档
- [npm 官方文档](https://docs.npmjs.com/)
- [Yarn 官方文档](https://yarnpkg.com/)
- [pnpm 官方文档](https://pnpm.io/)
- [Webpack 官方文档](https://webpack.js.org/)
- [Vite 官方文档](https://vitejs.dev/)

### 学习资源
- [ES Modules 规范](https://tc39.es/ecma262/#sec-modules)
- [Node.js 模块文档](https://nodejs.org/api/esm.html)
- [前端工程化指南](https://github.com/fouber/blog)

---

[返回上级目录](../)
