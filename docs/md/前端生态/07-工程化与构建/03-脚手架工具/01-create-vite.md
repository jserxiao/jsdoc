# create-vite

## 定位

Vite 官方脚手架，支持多种框架和模板。

## 核心特点

- **多框架支持**：Vue、React、Svelte、Solid 等
- **模板丰富**：JavaScript、TypeScript、自定义模板
- **极快创建**：秒级生成项目
- **零配置**：开箱即用

## 常用命令

```bash
# 交互式创建项目
npm create vite@latest

# 直接指定项目名和模板
npm create vite@latest my-app -- --template vue-ts
npm create vite@latest my-app -- --template react-ts
npm create vite@latest my-app -- --template svelte-ts

# 可用模板
# vue, vue-ts
# react, react-ts
# react-swc, react-swc-ts
# preact, preact-ts
# lit, lit-ts
# svelte, svelte-ts
# solid, solid-ts
# vanilla, vanilla-ts
```

## 生成的项目结构

```
my-app/
├── public/
│   └── vite.svg
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

## 适用场景

- 新项目快速启动
- Vue 3 / React 项目
- 追求开发体验
