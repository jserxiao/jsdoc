# 脚手架工具

## 概述

脚手架工具（CLI Tools）用于快速初始化项目、生成代码模板、统一项目结构，是提升开发效率的重要工具。好的脚手架可以帮助团队保持代码风格一致，减少重复工作。

## 主流工具对比

| 工具 | 定位 | 核心优势 | 适用场景 |
|------|------|----------|----------|
| **create-vite** | Vite 项目脚手架 | 多框架支持、模板丰富 | 新项目首选 |
| **create-react-app** | React 官方脚手架 | 零配置、开箱即用 | React 学习 |
| **Vue CLI** | Vue 项目脚手架 | 图形界面、插件体系 | Vue 2 项目 |
| **Nx** | 企业级项目生成器 | Monorepo、代码生成 | 大型项目 |
| **Turborepo** | Monorepo 构建系统 | 增量构建、远程缓存 | Monorepo |

## 详细文档

| 文档 | 说明 |
|------|------|
| [create-vite](./01-create-vite.md) | Vite 官方脚手架，多框架支持 |
| [create-react-app](./02-create-react-app.md) | React 官方脚手架 |
| [Vue CLI](./03-Vue-CLI.md) | Vue 项目脚手架 |
| [Nx](./04-Nx.md) | 企业级 Monorepo 项目生成器 |
| [Turborepo](./05-Turborepo.md) | 高性能 Monorepo 构建系统 |
| [自定义脚手架](./06-自定义脚手架.md) | plop / hygen 代码生成 |

## 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 新项目 | create-vite | 速度快、模板丰富 |
| Vue 3 项目 | create-vite | 官方推荐 |
| React 学习 | create-react-app | 零配置、易上手 |
| Vue 2 企业项目 | Vue CLI | 插件完善、图形界面 |
| Monorepo | Nx / Turborepo | 专业 Monorepo 工具 |
| 代码生成 | plop / hygen | 自定义模板灵活 |
