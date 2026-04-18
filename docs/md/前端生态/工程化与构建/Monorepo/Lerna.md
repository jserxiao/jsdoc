# Lerna

## 简介

Lerna 是用于管理 JavaScript 多包项目的工具，专注于版本管理和发布流程。

## 安装

```bash
# 安装 Lerna
npm install -D lerna

# 初始化
npx lerna init
```

## 项目结构

```
my-lerna-repo/
├── packages/
│   ├── core/
│   │   ├── package.json
│   │   └── src/
│   ├── utils/
│   │   ├── package.json
│   │   └── src/
│   └── cli/
│       ├── package.json
│       └── src/
├── lerna.json
├── package.json
└── pnpm-workspace.yaml
```

## lerna.json 配置

```json
{
  "version": "independent",
  "npmClient": "pnpm",
  "useWorkspaces": true,
  "packages": ["packages/*"],
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish"
    },
    "version": {
      "allowBranch": "main"
    }
  }
}
```

## 版本模式

### Fixed 模式

所有包使用相同版本号。

```json
{
  "version": "1.0.0"
}
```

### Independent 模式

每个包独立版本号。

```json
{
  "version": "independent"
}
```

## 常用命令

### 版本管理

```bash
# 检查变更
lerna changed

# 创建版本
lerna version

# 发布到 npm
lerna publish from-package

# 发布到私有仓库
lerna publish --registry=https://my-registry.com
```

### 运行脚本

```bash
# 运行所有包的脚本
lerna run build
lerna run test

# 运行指定包
lerna run build --scope=@my-org/core

# 并行运行
lerna run build --parallel

# 流式输出
lerna run build --stream
```

### 包管理

```bash
# 创建新包
lerna create @my-org/new-package

# 添加依赖到所有包
lerna add lodash

# 添加依赖到指定包
lerna add lodash --scope=@my-org/core

# 清理所有 node_modules
lerna clean
```

## Changesets 集成

推荐使用 Changesets 替代 Lerna 的版本管理功能。

### 安装

```bash
pnpm add -D @changesets/cli
npx changeset init
```

### 配置

```json
// .changeset/config.json
{
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### 使用流程

```bash
# 1. 添加变更记录
npx changeset

# 2. 更新版本
npx changeset version

# 3. 发布
npx changeset publish
```

## GitHub Actions 发布

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - run: npx changeset publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Lerna vs Changesets

| 特性 | Lerna | Changesets |
|------|-------|------------|
| 版本管理 | 支持 | 支持 |
| 发布流程 | 内置 | 内置 |
| 变更日志 | 基础 | 优秀 |
| 多包依赖 | 支持 | 支持 |
| 社区活跃度 | 中等 | 活跃 |
| 学习曲线 | 中等 | 简单 |

## 推荐方案

```bash
# pnpm + Turborepo + Changesets
pnpm workspace   # 依赖管理
Turborepo        # 构建优化
Changesets       # 版本发布
```
