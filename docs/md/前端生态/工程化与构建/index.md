# 工程化与构建

## 概述

前端工程化是现代前端开发的基石，涵盖打包构建、包管理、脚手架工具、代码规范、CI/CD、组件化模块和 Monorepo 等多个方面。完善的工程化体系能够显著提升开发效率、保证代码质量、降低协作成本。

## 核心模块

| 模块 | 说明 | 进入阅读 |
|------|------|----------|
| **打包构建工具** | Vite、Webpack、Rollup 等构建工具的使用与优化 | [查看详情](./打包构建工具) |
| **包管理工具** | npm、pnpm、Yarn、Bun 等包管理器的对比与使用 | [查看详情](./包管理工具) |
| **脚手架工具** | create-vite、Nx、Turborepo 等项目初始化工具 | [查看详情](./脚手架工具) |
| **代码规范与质量** | ESLint、Prettier、Git Hooks 等规范工具 | [查看详情](./代码规范与质量) |
| **CI 与 CD** | GitHub Actions、GitLab CI、Docker 等自动化部署 | [查看详情](./CI与CD) |
| **组件化模块** | 组件设计原则、组件库开发、组件测试 | [查看详情](./组件化模块) |
| **Monorepo** | pnpm workspace、Turborepo、Nx 多包管理 | [查看详情](./Monorepo) |

## 快速选型指南

### 新项目推荐配置

```
├── 构建工具: Vite
├── 包管理器: pnpm
├── 代码规范: ESLint + Prettier + Husky
├── CI/CD: GitHub Actions
├── 组件化: 组件库 + Storybook
└── Monorepo: pnpm workspace + Turborepo
```

### 企业级项目推荐配置

```
├── 构建工具: Webpack / Vite
├── 包管理器: pnpm (Monorepo)
├── 脚手架: Nx / Turborepo
├── 代码规范: ESLint + Prettier + Commitlint
├── CI/CD: GitLab CI / Jenkins
├── 组件化: 统一组件库
├── 部署: Docker + Kubernetes
└── Monorepo: Nx / Turborepo
```

## 技术演进路线

```
传统开发          工程化初期          现代工程化
    │                 │                  │
    │                 │                  │
    ▼                 ▼                  ▼
手动引入JS      →  Webpack打包     →   Vite极速开发
script标签         模块化               ESM原生
    │                 │                  │
    ▼                 ▼                  ▼
手动管理依赖    →  npm管理         →   pnpm/Monorepo
复制粘贴            package.json        工作空间
    │                 │                  │
    ▼                 ▼                  ▼
手动部署        →  CI/CD自动化     →   云原生部署
FTP上传             Jenkins             Vercel/Docker
    │                 │                  │
    ▼                 ▼                  ▼
组件复用困难    →  组件库开发       →   组件化模块
复制粘贴            npm 发布            Monorepo 管理
```

## 常见问题速查

### 构建速度慢
- 使用 Vite 替代 Webpack
- 开启持久化缓存
- 使用 esbuild/swc 替代 Babel
- 配置并行构建

### 依赖管理混乱
- 使用 pnpm 严格依赖管理
- 统一版本锁定文件
- 定期清理过期依赖
- Monorepo 使用工作空间

### 代码风格不统一
- 配置 ESLint + Prettier
- 使用 Husky 提交前检查
- 统一编辑器配置
- 配置 Git 提交规范

### 部署流程复杂
- 选择合适的 CI/CD 平台
- 容器化部署标准化
- 配置自动化测试
- 建立回滚机制

### 组件复用困难
- 建立组件库
- 使用 Monorepo 管理多包
- 配置 Storybook 文档
- 统一组件设计规范

### 多项目管理复杂
- 采用 Monorepo 架构
- 使用 Turborepo 增量构建
- 统一配置和工具链
- 共享基础组件和工具
