# 十三、模块化与工程化

模块化与工程化是现代 JavaScript 开发的基石。模块化解决了代码组织、依赖管理和命名冲突问题，而工程化则涵盖构建、打包、发布等自动化流程。

---

## 模块概述

JavaScript 从简单的脚本语言发展为构建复杂应用的语言，模块化和工程化起到了关键作用。本模块将全面介绍模块化规范的核心知识。

### 学习目标

- 理解模块化的演进历史和各种规范（CommonJS、ESM、AMD 等）
- 深入理解 package.json 的各项配置
- 掌握模块化开发最佳实践

---

## 📁 模块目录

| 序号 | 模块 | 文件 | 内容概述 |
|------|------|------|----------|
| 1 | 模块化规范 | [01-模块化规范.md](./01-模块化规范.md) | CommonJS、AMD、CMD、UMD、ES Modules、循环依赖 |
| 2 | package.json详解 | [02-package.json详解.md](./02-package.json详解.md) | 所有属性详解、依赖管理、脚本配置、工作区 |

> 💡 **提示**：包管理工具和构建工具相关内容已迁移至 [前端生态 - 工程化与构建](../../前端生态/07-工程化与构建/) 模块。

---

## 核心概念速览

### 模块化演进

```
全局函数 → 命名空间 → IIFE → CommonJS → AMD/CMD → ES Modules
```

### 模块规范对比

| 规范 | 加载方式 | 运行环境 | 特点 |
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

---

## 知识关联

### 与其他模块的关系

```
模块化与工程化
    ├── 基础语法与核心概念（模块语法基础）
    ├── 异步编程（动态导入、异步加载）
    ├── ES6+新特性（ES Modules）
    └── 前端生态-工程化与构建（包管理、构建工具）
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
3. 学会使用包管理工具安装依赖

### 中级：深入理解
1. 理解各种模块规范的区别和应用场景
2. 掌握 package.json 的常用配置
3. 理解模块加载原理

### 高级：工程化实践
1. 搭建企业级项目脚手架
2. 配置 Monorepo 工作区
3. 优化构建性能和产物体积

---

## 相关资源

### 包管理工具与构建工具
- [包管理工具](../../前端生态/07-工程化与构建/02-包管理工具/) - npm、pnpm、Yarn 详解
- [打包构建工具](../../前端生态/07-工程化与构建/01-打包构建工具/) - Webpack、Vite、Rollup 详解
- [脚手架工具](../../前端生态/07-工程化与构建/03-脚手架工具/) - 项目初始化工具
- [Monorepo](../../前端生态/07-工程化与构建/07-Monorepo/) - 多包管理方案

### 官方文档
- [npm 官方文档](https://docs.npmjs.com/)
- [Yarn 官方文档](https://yarnpkg.com/)
- [pnpm 官方文档](https://pnpm.io/)
- [Webpack 官方文档](https://webpack.js.org/)
- [Vite 官方文档](https://vitejs.dev/)

### 学习资源
- [ES Modules 规范](https://tc39.es/ecma262/#sec-modules)
- [Node.js 模块文档](https://nodejs.org/api/esm.html)

---

[返回上级目录](../)
