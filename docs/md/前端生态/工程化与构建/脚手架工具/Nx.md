# Nx

## 定位

企业级 Monorepo 项目生成器，支持多框架。

## 核心特点

- **Monorepo 支持**：原生多项目管理
- **代码生成**：自动生成组件、服务等
- **依赖图**：可视化项目依赖关系
- **多框架**：React、Vue、Angular、Node.js 等
- **增量构建**：只构建受影响的项目

## 常用命令

```bash
# 创建工作空间
npx create-nx-workspace@latest my-workspace --preset=react

# 生成应用
nx g @nx/react:app my-app

# 生成库
nx g @nx/react:lib my-lib

# 生成组件
nx g @nx/react:component my-component --project=my-app

# 运行应用
nx serve my-app

# 构建应用
nx build my-app

# 运行受影响的项目测试
nx affected -t test
```

## 项目结构

```
my-workspace/
├── apps/
│   ├── my-app/
│   └── my-app-e2e/
├── libs/
│   ├── my-lib/
│   └── shared-ui/
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

## 适用场景

- 企业级大型项目
- Monorepo 架构
- 多团队协作
