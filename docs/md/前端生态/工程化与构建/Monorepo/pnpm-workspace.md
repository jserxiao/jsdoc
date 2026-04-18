# pnpm workspace

## 简介

pnpm 原生支持 Monorepo，通过 workspace 功能管理多包项目。

## 配置

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

### 项目结构

```
my-monorepo/
├── packages/
│   ├── ui/
│   │   ├── package.json
│   │   └── src/
│   ├── utils/
│   │   ├── package.json
│   │   └── src/
│   └── config/
│       ├── package.json
│       └── src/
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   └── src/
│   └── admin/
│       ├── package.json
│       └── src/
├── package.json
└── pnpm-workspace.yaml
```

### 根 package.json

```json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "lint": "pnpm -r run lint"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

## 常用命令

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 给指定包添加依赖
pnpm add lodash --filter @my-org/utils

# 给所有包添加开发依赖
pnpm add -D typescript -w

# 给指定包添加开发依赖
pnpm add -D vitest --filter @my-org/ui
```

### 运行脚本

```bash
# 运行所有包的 build 脚本
pnpm -r run build

# 运行指定包的脚本
pnpm --filter @my-org/web run dev

# 并行运行
pnpm -r --parallel run dev

# 递归运行测试
pnpm -r run test
```

### 包管理

```bash
# 查看包信息
pnpm list -r

# 查看过期依赖
pnpm outdated -r

# 清理所有 node_modules
pnpm -r exec rm -rf node_modules
```

## 包间依赖

### 添加本地包依赖

```json
// packages/web/package.json
{
  "dependencies": {
    "@my-org/ui": "workspace:*",
    "@my-org/utils": "workspace:^1.0.0"
  }
}
```

### workspace 协议

| 协议 | 说明 |
|------|------|
| `workspace:*` | 始终使用最新版本 |
| `workspace:^` | 使用兼容版本 |
| `workspace:~` | 使用相近版本 |
| `workspace:1.0.0` | 指定版本 |

## 发布配置

```json
// packages/ui/package.json
{
  "name": "@my-org/ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "publishConfig": {
    "access": "public"
  }
}
```

## .npmrc 配置

```ini
# 使用硬链接
shamefully-hoist=true

# 严格 peer 依赖
strict-peer-dependencies=false

# 自动安装 peer 依赖
auto-install-peers=true

# 工作空间协议
link-workspace-packages=true
```
