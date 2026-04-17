# Nx

## 简介

Nx 是企业级 Monorepo 工具，提供代码生成、依赖图可视化、增量构建等功能。

## 安装

```bash
# 创建新的 Monorepo
npx create-nx-workspace@latest

# 添加到现有项目
npm install -D nx
```

## 项目结构

```
my-nx-workspace/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   ├── project.json
│   │   └── tsconfig.json
│   └── web-e2e/
├── libs/
│   ├── ui/
│   │   ├── src/
│   │   ├── project.json
│   │   └── tsconfig.json
│   └── utils/
├── nx.json
├── workspace.json
└── package.json
```

## nx.json 配置

```json
{
  "extends": "nx/presets/core.json",
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"]
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

## 常用命令

### 项目管理

```bash
# 创建应用
nx g @nx/react:app my-app

# 创建库
nx g @nx/react:lib my-lib

# 创建组件
nx g @nx/react:component MyComponent --project=my-app

# 创建服务
nx g @nx/react:service MyService --project=my-lib
```

### 运行任务

```bash
# 运行应用
nx serve my-app

# 构建应用
nx build my-app

# 测试
nx test my-app

# 运行受影响的项目
nx affected -t build
nx affected -t test
```

### 查看信息

```bash
# 查看依赖图
nx graph

# 查看项目列表
nx list

# 查看受影响的项目
nx affected:graph
```

## project.json

```json
// apps/web/project.json
{
  "name": "web",
  "sourceRoot": "apps/web/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nx/vite:build",
      "outputs": ["{workspaceRoot}/dist/apps/web"],
      "options": {
        "outputPath": "dist/apps/web"
      }
    },
    "serve": {
      "executor": "@nx/vite:dev-server",
      "options": {
        "buildTarget": "web:build"
      }
    },
    "test": {
      "executor": "@nx/vite:test",
      "outputs": ["{workspaceRoot}/coverage/apps/web"]
    }
  }
}
```

## 代码生成器

### 内置生成器

```bash
# React 应用
nx g @nx/react:app

# Vue 应用
nx g @nx/vue:app

# Node 应用
nx g @nx/node:app

# 库
nx g @nx/react:lib
nx g @nx/js:lib
```

### 自定义生成器

```typescript
// tools/generators/component/index.ts
import { formatFiles, generateFiles, names, Tree } from '@nx/devkit'
import * as path from 'path'

export default async function (tree: Tree, schema: any) {
  const { name, project } = schema
  const projectRoot = `libs/${project}/src`

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    projectRoot,
    { ...names(name), tmpl: '' }
  )

  await formatFiles(tree)
}
```

## 依赖图

```bash
# 生成依赖图
nx graph

# 只显示特定项目
nx graph --focus=my-app
```

## 增量构建

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"],
        "parallel": 3
      }
    }
  }
}
```

## Nx vs Turborepo

| 特性 | Nx | Turborepo |
|------|-----|-----------|
| 学习曲线 | 较陡 | 平缓 |
| 代码生成 | 强大 | 无 |
| 依赖图 | 可视化 | 基础 |
| 配置复杂度 | 高 | 低 |
| 增量构建 | 优秀 | 优秀 |
| 插件生态 | 丰富 | 基础 |
