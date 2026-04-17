# 组件化模块

## 概述

组件化是现代前端开发的核心思想，将 UI 拆分为独立、可复用的组件，提高代码复用性和可维护性。良好的组件化架构是大型项目成功的关键。

## 组件化层次

```
├── 基础组件（Base Components）
│   ├── Button、Input、Icon
│   └── 最小粒度，高度复用
├── 业务组件（Business Components）
│   ├── UserCard、ProductItem
│   └── 包含业务逻辑，中等复用
├── 布局组件（Layout Components）
│   ├── Header、Sidebar、Footer
│   └── 页面结构，复用性强
└── 页面组件（Page Components）
    ├── HomePage、UserPage
    └── 完整页面，复用性弱
```

## 详细文档

| 文档 | 说明 |
|------|------|
| [组件设计原则](./01-组件设计原则.md) | 单一职责、可复用性、可扩展性 |
| [组件通信方式](./02-组件通信方式.md) | Props、Events、Provide/Inject 等 |
| [组件库开发](./03-组件库开发.md) | 组件库架构设计与开发流程 |
| [组件文档](./04-组件文档.md) | Storybook、VitePress 文档 |
| [组件测试](./05-组件测试.md) | 单元测试、组件测试策略 |

## 组件分类

| 类型 | 说明 | 示例 |
|------|------|------|
| **展示组件** | 只负责 UI 展示 | Button、Card、Table |
| **容器组件** | 包含业务逻辑和状态 | UserList、ProductList |
| **高阶组件** | 增强组件功能 | withRouter、connect |
| ** Hooks** | 复用状态逻辑 | useRequest、useAuth |

## 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| React 项目 | 组件库 + Storybook | 成熟生态 |
| Vue 项目 | 组件库 + VitePress | 官方支持 |
| 跨框架组件 | Web Components | 框架无关 |
| 内部组件库 | Monorepo + 组件库 | 统一管理 |
