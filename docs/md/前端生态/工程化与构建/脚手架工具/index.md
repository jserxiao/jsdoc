# 脚手架工具

> 前端脚手架工具帮助开发者快速初始化项目、生成代码模板、统一项目结构，是提升开发效率的重要工具。

## 模块导航

| 模块 | 说明 |
|------|------|
| [常用CLI对比](./常用CLI对比/index.md) | 主流脚手架工具对比：create-vite、create-react-app、Vue CLI、Angular CLI 等 |
| [开发CLI](./开发CLI/index.md) | CLI 开发流程、所需工具库（commander、inquirer、chalk 等）、完整实现 |

---

## 快速概览

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  脚手架工具分类                                                                        │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  项目初始化脚手架                                                                      │
│  ├── create-vite      - Vite 官方脚手架，多框架支持，极速启动                        │
│  ├── create-react-app - React 官方脚手架，零配置开箱即用                             │
│  ├── Vue CLI          - Vue 生态脚手架，插件体系完善                                 │
│  ├── Angular CLI      - Angular 官方脚手架，功能完备                                │
│  ├── create-next-app  - Next.js 官方脚手架，SSR/SSG 支持                            │
│  └── create-nuxt-app  - Nuxt.js 官方脚手架                                          │
│                                                                                       │
│  Monorepo 管理工具                                                                     │
│  ├── Nx               - 企业级 Monorepo，功能全面                                   │
│  ├── Turborepo        - 高性能构建系统，增量构建                                    │
│  ├── pnpm workspaces  - 轻量级 Monorepo 方案                                        │
│  └── Lerna            - 经典 Monorepo 工具                                          │
│                                                                                       │
│  代码生成工具                                                                          │
│  ├── plop             - 交互式代码生成器                                            │
│  ├── hygen            - 快速代码生成器                                              │
│  └── yeoman           - 通用脚手架生成器                                            │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 新项目 | create-vite | 速度快、模板丰富 |
| Vue 3 项目 | create-vite | 官方推荐 |
| React 学习 | create-react-app | 零配置、易上手 |
| 需要 SSR | create-next / create-nuxt | 内置 SSR 支持 |
| Monorepo | Nx / Turborepo | 专业 Monorepo 工具 |
| 自定义脚手架 | commander + inquirer | 灵活可控 |

---

[返回上级目录](../index.md)
