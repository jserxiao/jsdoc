# Turborepo

## 定位

高性能 Monorepo 构建系统，专注于增量构建。

## 核心特点

- **增量构建**：只构建变化的项目
- **远程缓存**：团队共享构建缓存
- **并行执行**：智能任务调度
- **简单配置**：极简的配置文件

## 常用命令

```bash
# 创建 Monorepo
npx create-turbo@latest

# 运行任务
turbo run build
turbo run dev
turbo run test

# 并行运行
turbo run build --parallel

# 过滤项目
turbo run build --filter=my-app

# 远程缓存
turbo link
turbo run build --token=<token>
```

## turbo.json 配置

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

## 项目结构

```
my-monorepo/
├── apps/
│   ├── web/
│   └── docs/
├── packages/
│   ├── ui/
│   ├── tsconfig/
│   └── eslint-config/
├── turbo.json
└── package.json
```

## 与 pnpm 配合

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## 适用场景

- Monorepo 构建
- 需要增量构建
- 团队远程缓存

## 与 Nx 对比

| 特性 | Turborepo | Nx |
|------|-----------|-----|
| 学习曲线 | 简单 | 较复杂 |
| 配置 | 极简 | 丰富 |
| 代码生成 | 无 | 强大 |
| 依赖图 | 基础 | 可视化 |
| 增量构建 | 优秀 | 优秀 |
