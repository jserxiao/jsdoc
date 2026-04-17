# 代码规范与质量

## 概述

代码规范与质量工具帮助团队保持代码风格一致、发现潜在问题、提升代码可维护性。完善的规范体系是大型项目成功的关键因素之一。

## 工具概览

| 类别 | 工具 | 作用 |
|------|------|------|
| **代码检查** | ESLint | JavaScript/TypeScript 静态分析 |
| **代码格式化** | Prettier | 统一代码风格 |
| **类型检查** | TypeScript | 类型安全 |
| **Git 提交规范** | Commitlint | 提交信息规范化 |
| **Git 钩子** | Husky + lint-staged | 提交前自动检查 |
| **目录结构** | EditorConfig | 编辑器配置统一 |

## 详细文档

| 文档 | 说明 |
|------|------|
| [ESLint](./01-ESLint.md) | JavaScript/TypeScript 代码检查 |
| [Prettier](./02-Prettier.md) | 代码格式化工具 |
| [TypeScript 类型检查](./03-TypeScript类型检查.md) | 类型安全配置 |
| [Git 提交规范](./04-Git提交规范.md) | Commitlint 提交信息规范 |
| [Git Hooks](./05-Git-Hooks.md) | Husky + lint-staged 自动检查 |
| [EditorConfig](./06-EditorConfig.md) | 编辑器配置统一 |

## 技术选型建议

| 场景 | 推荐配置 | 说明 |
|------|---------|------|
| 新项目 | ESLint + Prettier + Husky | 完整规范体系 |
| TypeScript 项目 | + TypeScript strict 模式 | 类型安全 |
| Vue 项目 | + eslint-plugin-vue | Vue 最佳实践 |
| React 项目 | + eslint-plugin-react-hooks | React 规则 |
| 团队协作 | + Commitlint | 提交规范 |
