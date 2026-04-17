# Turborepo

## 简介

Turborepo 是高性能的 Monorepo 构建系统，专注于增量构建和远程缓存。

## 安装

```bash
# 创建新的 Monorepo
npx create-turbo@latest

# 添加到现有项目
pnpm add -D turbo -w
```

## 项目结构

```
my-turborepo/
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   └── next.config.js
│   └── docs/
│       ├── package.json
│       └── next.config.js
├── packages/
│   ├── ui/
│   │   ├── package.json
│   │   └── src/
│   ├── tsconfig/
│   │   └── package.json
│   └── eslint-config/
│       └── package.json
├── turbo.json
└── package.json
```

## turbo.json 配置

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

## 常用命令

```bash
# 运行任务
turbo run build
turbo run lint
turbo run test

# 并行运行
turbo run build --parallel

# 过滤包
turbo run build --filter=@my-org/web
turbo run build --filter=...[origin/main]

# 开发模式
turbo run dev

# 清理缓存
turbo run clean --force
```

## 任务依赖

### dependsOn 配置

```json
{
  "pipeline": {
    "build": {
      // ^build 表示依赖包先执行 build
      "dependsOn": ["^build"]
    },
    "test": {
      // 当前包先执行 build，再执行 test
      "dependsOn": ["build"]
    }
  }
}
```

### 任务类型

| 配置 | 说明 |
|------|------|
| `dependsOn: ["build"]` | 当前包先执行 build |
| `dependsOn: ["^build"]` | 依赖包先执行 build |
| `outputs: ["dist/**"]` | 缓存输出目录 |
| `cache: false` | 不缓存任务 |
| `persistent: true` | 长时间运行任务（如 dev） |

## 远程缓存

### Vercel 集成

```bash
# 连接 Vercel
turbo login

# 链接项目
turbo link

# 使用远程缓存
turbo run build
```

### 自定义远程缓存

```json
// turbo.json
{
  "remoteCache": {
    "signature": true
  }
}
```

## 过滤器

```bash
# 运行指定包
turbo run build --filter=@my-org/web

# 运行变更的包
turbo run build --filter=[HEAD^1]

# 运行依赖某包的包
turbo run build --filter=...@my-org/ui

# 运行某包依赖的包
turbo run build --filter=@my-org/ui...

# 组合过滤
turbo run build --filter=@my-org/web... --filter=!@my-org/docs
```

## 与 pnpm 配合

```json
// package.json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test"
  }
}
```

## 性能优化

### 缓存策略

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**"],
      "inputs": ["src/**", "package.json"]
    }
  }
}
```

### 并行执行

```bash
# 最大并行数
turbo run build --parallel --concurrency=4
```
