# esbuild

esbuild 是用 Go 编写的极速 JavaScript 打包器，速度比 Webpack 快 10-100 倍。

---

## 概述

| 特性 | 说明 |
|------|------|
| 定位 | 极速打包器 |
| 作者 | Evan Wallace |
| 开发语言 | Go |
| 核心优势 | 极致速度、内置功能 |
| 适用场景 | 追求速度、快速编译 |

---

## 详细文档

| 文档 | 说明 |
|------|------|
| [核心特性](./核心特性.md) | 极速编译、内置功能 |
| [基础配置](./基础配置.md) | 命令行、API 配置 |
| [插件开发](./插件开发.md) | 自定义插件 |

---

## 快速开始

```bash
# 安装
npm install esbuild --save-dev

# 构建
npx esbuild src/index.js --bundle --outfile=dist/bundle.js

# 开发模式
npx esbuild src/index.js --bundle --servedir=.
```

---

## 适用场景

- ✅ 追求极致构建速度
- ✅ 简单项目快速打包
- ✅ 作为其他工具的底层引擎
- ✅ 开发环境快速编译

---

## 与其他工具对比

| 特性 | esbuild | Webpack | Rollup |
|------|---------|---------|--------|
| 构建速度 | 极快 | 较慢 | 较快 |
| 配置复杂度 | 简单 | 复杂 | 中等 |
| Tree Shaking | 支持 | 支持 | 最佳 |
| 生态成熟度 | 成长中 | 成熟 | 成熟 |

---

[返回上级](../)
