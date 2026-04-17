# Webpack

Webpack 是功能强大的模块打包器，拥有最完善的生态系统。

---

## 概述

| 特性 | 说明 |
|------|------|
| 定位 | 模块打包器 |
| 作者 | Tobias Koppers |
| 核心优势 | 生态完善、高度可配置 |
| 模块支持 | AMD、CommonJS、ESM |
| 适用场景 | 企业级复杂项目 |

---

## 详细文档

| 文档 | 说明 |
|------|------|
| [核心概念](./01-核心概念.md) | Entry、Output、Loader、Plugin |
| [基础配置](./02-基础配置.md) | 入口、出口、模式配置 |
| [Loader 详解](./03-Loader详解.md) | 常用 Loader 及配置 |
| [Plugin 详解](./04-Plugin详解.md) | 常用 Plugin 及配置 |
| [开发服务器](./05-开发服务器.md) | devServer 配置 |
| [插件开发](./06-插件开发.md) | Compiler、Compilation 钩子详解 |

---

## 快速开始

```bash
# 安装
npm install webpack webpack-cli --save-dev

# 构建
npx webpack --config webpack.config.js

# 开发模式
npx webpack serve
```

---

## 适用场景

- ✅ 大型企业级项目
- ✅ 复杂构建需求
- ✅ 需要丰富插件支持
- ✅ 遗留项目迁移

---

## 与 Vite 对比

| 特性 | Webpack | Vite |
|------|---------|------|
| 启动速度 | 较慢（秒级） | 极快（毫秒级） |
| HMR | 较快 | 即时 |
| 配置复杂度 | 复杂 | 简单 |
| 生态成熟度 | 成熟 | 成长中 |
| 生产构建 | Webpack | Rollup |

---

[返回上级](../)
