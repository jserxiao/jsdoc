# 项目概述与架构设计

> 本节全面介绍 `@jserxiao/xcli` 项目的定位、设计理念、可插拔架构和整体技术选型。

## 学习要点

- 🎯 理解可插拔脚手架的设计理念
- 🏗️ 掌握 CLI 的分层架构设计
- 📦 理解模板系统与插件系统的协作关系
- 🔧 了解类型系统的设计原则

---

## 1. 项目定位与设计理念

### 1.1 项目概述

`@jserxiao/xcli` 是一个**可插拔的 TypeScript 项目脚手架 CLI 工具**，核心目标是让开发者能够快速搭建现代化的 TypeScript 项目。

```bash
# 安装使用
npm install -g @jserxiao/xcli

# 创建项目
xcli init my-project

# 管理插件
xcli plugin add eslint prettier
```

### 1.2 设计理念

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  设计理念                                                                              │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  🔌 可插拔性 (Pluggable)                                                               │
│  ├── 核心功能与插件完全分离                                                          │
│  ├── 插件按需加载、按需启用                                                          │
│  ├── 支持运行时动态添加/移除插件                                                     │
│  └── 插件间无强依赖，可独立工作                                                     │
│                                                                                       │
│  🎯 类型安全 (Type-Safe)                                                               │
│  ├── 全 TypeScript 实现 (100%)                                                      │
│  ├── 完整的类型定义系统                                                             │
│  ├── 插件接口类型约束                                                               │
│  └── 编译时类型检查，减少运行时错误                                                 │
│                                                                                       │
│  🛠️ 可扩展性 (Extensible)                                                              │
│  ├── 插件可自定义依赖、脚本、配置文件                                               │
│  ├── 支持插件安装后回调 (postInstall)                                               │
│  ├── 支持动态生成配置文件                                                           │
│  └── 支持根据上下文生成不同内容                                                     │
│                                                                                       │
│  📦 开箱即用 (Ready-to-Use)                                                            │
│  ├── 内置三种项目模板 (Library/React/Vue)                                           │
│  ├── 内置 11+ 常用插件                                                              │
│  ├── 生成的项目可直接投入开发                                                       │
│  └── 提供 Monorepo 支持 (pnpm workspace)                                            │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 与主流脚手架对比

| 特性 | xcli | Create React App | Vue CLI | Vite |
|------|------|------------------|---------|------|
| 可插拔架构 | ✅ 完全可插拔 | ❌ 固定配置 | ✅ 插件系统 | ❌ 模板预设 |
| 运行时添加插件 | ✅ 支持 | ❌ 不支持 | ❌ 不支持 | ❌ 不支持 |
| 多框架支持 | ✅ React/Vue/Library | ❌ 仅 React | ❌ 仅 Vue | ✅ 多框架 |
| TypeScript 默认 | ✅ 默认启用 | ⚠️ 需选择 | ⚠️ 需选择 | ⚠️ 需选择 |
| Monorepo 支持 | ✅ 内置 pnpm workspace | ❌ 不支持 | ❌ 不支持 | ❌ 不支持 |
| 状态管理集成 | ✅ Redux/MobX/Pinia | ❌ 不支持 | ✅ 官方插件 | ❌ 不支持 |
| HTTP 请求集成 | ✅ Axios/Fetch | ❌ 不支持 | ❌ 不支持 | ❌ 不支持 |
| 监控 SDK 集成 | ✅ xstat | ❌ 不支持 | ❌ 不支持 | ❌ 不支持 |

---

## 2. 核心架构设计

### 2.1 分层架构

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  xcli 分层架构                                                                         │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  入口层 (src/index.ts)                                                          │ │
│  │  ├── CLI 入口，shebang 声明                                                    │ │
│  │  ├── Commander 命令定义                                                        │ │
│  │  └── 全局错误处理                                                              │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  命令层 (src/commands/)                                                         │ │
│  │  ├── init.ts      - 项目初始化命令                                              │ │
│  │  ├── plugin.ts    - 插件管理命令 (add/remove/list)                              │ │
│  │  └── upgrade.ts   - 版本升级命令                                                │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  插件层 (src/plugins/)                                                          │ │
│  │  ├── index.ts          - 插件注册与导出                                         │ │
│  │  ├── eslint/           - ESLint 插件                                            │ │
│  │  ├── prettier/         - Prettier 插件                                          │ │
│  │  ├── vite/             - Vite 插件                                              │ │
│  │  ├── webpack/          - Webpack 插件                                           │ │
│  │  ├── husky/            - Husky 插件                                             │ │
│  │  ├── http-client/      - HTTP 请求库插件                                        │ │
│  │  ├── monitoring/       - 监控 SDK 插件                                          │ │
│  │  └── ...              - 其他插件                                                │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  模板层 (src/templates/)                                                        │ │
│  │  ├── index.ts      - 模板注册与路由                                             │ │
│  │  ├── library.ts    - Library 项目模板                                           │ │
│  │  ├── react.ts      - React 项目模板                                             │ │
│  │  ├── vue.ts        - Vue 项目模板                                               │ │
│  │  ├── shared.ts     - 共享模板工具                                               │ │
│  │  └── files/        - 模板文件目录                                               │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  工具层 (src/utils/)                                                            │ │
│  │  ├── index.ts          - 工具函数导出                                           │ │
│  │  ├── logger.ts         - 日志与 Banner 显示                                     │ │
│  │  ├── fileGenerator.ts  - 文件生成器                                             │ │
│  │  └── dependency.ts     - 依赖安装工具                                           │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  基础层 (src/types/ + src/constants/)                                           │ │
│  │  ├── types/index.ts    - TypeScript 类型定义                                    │ │
│  │  ├── constants/index.ts - 常量定义                                             │ │
│  │  └── constants/versions.ts - 依赖版本常量                                       │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 数据流

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  xcli 数据流                                                                           │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  用户输入                                                                              │
│  xcli init my-project --template react                                               │
│       │                                                                               │
│       ▼                                                                               │
│  ┌─────────────────┐                                                                  │
│  │ 命令解析         │  Commander.js 解析命令行参数                                   │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 交互式问答       │  Inquirer.js 收集用户配置                                     │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────┐     │
│  │ 构建 PluginContext                                                           │     │
│  │ {                                                                            │     │
│  │   projectName: 'my-project',                                                 │     │
│  │   projectType: 'react',                                                      │     │
│  │   styleType: 'less',                                                         │     │
│  │   stateManager: 'redux',                                                     │     │
│  │   httpClient: 'axios',                                                       │     │
│  │   bundler: 'vite',                                                           │     │
│  │   plugins: ['typescript', 'eslint', 'prettier', 'vite'],                     │     │
│  │   ...                                                                        │     │
│  │ }                                                                            │     │
│  └────────┬────────────────────────────────────────────────────────────────────┘     │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 模板创建结构     │  调用 reactTemplate.createStructure()                         │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 插件生成文件     │  FileGenerator.generateFromPlugins()                         │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 生成 package.json │ 合并模板依赖 + 插件依赖                                      │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 插件后处理       │  执行 postInstall 回调                                        │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 安装依赖         │  pnpm install                                                │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 初始化 Git       │  git init && git add .                                       │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  项目创建完成                                                                          │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 核心概念

### 3.1 项目类型 (ProjectType)

```typescript
// src/types/index.ts

export type ProjectType = 'library' | 'react' | 'vue';
```

| 类型 | 描述 | 默认插件 | 生成结构 |
|------|------|----------|----------|
| **library** | TypeScript 库项目 | TypeScript, ESLint, Prettier, Jest | 简洁的单包结构 |
| **react** | React 18 应用项目 | TypeScript, ESLint, Prettier, Vite | Monorepo 结构 |
| **vue** | Vue 3 应用项目 | TypeScript, ESLint, Prettier, Vite | Monorepo 结构 |

### 3.2 插件 (Plugin)

```typescript
// src/types/index.ts

export interface Plugin {
  /** 插件名称（唯一标识） */
  name: string;
  
  /** 插件显示名称（用于日志和列表显示） */
  displayName: string;
  
  /** 插件描述 */
  description: string;
  
  /** 插件类别 */
  category: 'linter' | 'formatter' | 'test' | 'git' | 'bundler' | 'tooling' | 'other';
  
  /** 是否默认启用 */
  defaultEnabled?: boolean;
  
  /** 运行时依赖（支持静态或动态） */
  dependencies?: Record<string, string> | ((context: PluginContext) => Record<string, string>);
  
  /** 开发依赖（支持静态或动态） */
  devDependencies?: Record<string, string> | ((context: PluginContext) => Record<string, string>);
  
  /** 需要生成的文件 */
  files?: PluginFile[];
  
  /** 需要添加的 npm scripts（支持静态或动态） */
  scripts?: Record<string, string> | ((context: PluginContext) => Record<string, string>);
  
  /** 安装后的回调（用于执行额外操作） */
  postInstall?: (context: PluginContext) => Promise<void>;
}
```

### 3.3 插件上下文 (PluginContext)

```typescript
// src/types/index.ts

export interface PluginContext {
  /** 项目名称 */
  projectName: string;
  
  /** 项目路径 */
  projectPath: string;
  
  /** 项目类型 */
  projectType: ProjectType;
  
  /** 样式预处理器类型 */
  styleType: StyleType;
  
  /** 状态管理类型 */
  stateManager: StateManagerType;
  
  /** HTTP 请求库类型 */
  httpClient: HttpClientType;
  
  /** 前端监控 SDK 类型 */
  monitoring: MonitoringType;
  
  /** 打包工具类型 */
  bundler: BundlerType;
  
  /** 用户选择的插件列表 */
  selectedPlugins: string[];
  
  /** 是否使用 TypeScript */
  useTypeScript: boolean;
  
  /** 包管理器 */
  packageManager: 'npm' | 'yarn' | 'pnpm';
  
  /** 其他配置选项 */
  options: Record<string, any>;
}
```

### 3.4 模板 (Template)

```typescript
// src/templates/library.ts

export interface TemplateGenerator {
  /** 项目类型 */
  type: ProjectType;
  
  /** 显示名称 */
  displayName: string;
  
  /** 描述 */
  description: string;
  
  /** 创建项目目录结构 */
  createStructure: (projectPath: string, context: PluginContext) => Promise<void>;
  
  /** 获取项目依赖 */
  getDependencies: (
    styleType?: StyleType,
    stateManager?: StateManagerType,
    httpClient?: HttpClientType,
    monitoring?: MonitoringType,
    bundler?: BundlerType,
    useTypeScript?: boolean
  ) => { dependencies: Record<string, string>; devDependencies: Record<string, string> };
  
  /** 获取 npm scripts */
  getScripts: (bundler?: BundlerType, useTypeScript?: boolean) => Record<string, string>;
}
```

---

## 4. 项目结构详解

### 4.1 源码目录结构

```
xcli/
├── src/
│   ├── index.ts                    # CLI 入口
│   │   ├── shebang 声明           # #!/usr/bin/env node
│   │   ├── Commander 程序定义     # program.name('xcli')
│   │   ├── 命令注册               # init/plugin/upgrade
│   │   └── 参数解析               # program.parse()
│   │
│   ├── commands/                   # 命令实现目录
│   │   ├── index.ts               # 命令模块导出
│   │   ├── init.ts                # init 命令 (534 行)
│   │   │   ├── getProjectConfig() # 获取项目配置
│   │   │   └── init()             # 执行初始化
│   │   ├── plugin.ts              # plugin 命令 (253 行)
│   │   │   ├── addPlugin()        # 添加插件
│   │   │   ├── removePlugin()     # 移除插件
│   │   │   └── listPlugins()      # 列出插件
│   │   └── upgrade.ts             # upgrade 命令 (235 行)
│   │       ├── getLatestVersion() # 获取最新版本
│   │       ├── checkForUpdate()   # 检查更新
│   │       ├── upgrade()          # 执行升级
│   │       └── showVersion()      # 显示版本
│   │
│   ├── plugins/                    # 插件实现目录
│   │   ├── index.ts               # 插件注册与导出
│   │   │   ├── plugins[]          # 插件列表
│   │   │   ├── pluginMap          # 插件映射表
│   │   │   └── getPluginChoices() # 获取插件选项
│   │   │
│   │   ├── typescript/            # TypeScript 插件
│   │   │   ├── index.ts           # 插件定义
│   │   │   └── config.ts          # tsconfig 配置模板
│   │   │
│   │   ├── eslint/                # ESLint 插件
│   │   │   ├── index.ts           # 插件定义（动态依赖）
│   │   │   └── config.ts          # Flat Config 模板
│   │   │
│   │   ├── prettier/              # Prettier 插件
│   │   │   └── index.ts           # 插件定义
│   │   │
│   │   ├── stylelint/             # Stylelint 插件
│   │   │   └── index.ts           # 插件定义（动态依赖）
│   │   │
│   │   ├── jest/                  # Jest 插件
│   │   │   └── index.ts           # 插件定义
│   │   │
│   │   ├── vitest/                # Vitest 插件
│   │   │   └── index.ts           # 插件定义
│   │   │
│   │   ├── husky/                 # Husky 插件
│   │   │   └── index.ts           # 插件定义（含 postInstall）
│   │   │
│   │   ├── commitlint/            # Commitlint 插件
│   │   │   └── index.ts           # 插件定义
│   │   │
│   │   ├── vite/                  # Vite 插件
│   │   │   ├── index.ts           # 插件定义
│   │   │   └── config.ts          # Vite 配置模板
│   │   │
│   │   ├── webpack/               # Webpack 插件
│   │   │   ├── index.ts           # 插件定义
│   │   │   └── config.ts          # Webpack 配置模板
│   │   │
│   │   ├── rollup/                # Rollup 插件
│   │   │   └── index.ts           # 插件定义
│   │   │
│   │   ├── http-client/           # HTTP 请求库插件
│   │   │   ├── index.ts           # 插件导出
│   │   │   └── templates.ts       # 请求封装模板
│   │   │
│   │   └── monitoring/            # 监控 SDK 插件
│   │       ├── index.ts           # 插件定义
│   │       └── templates.ts       # 监控初始化模板
│   │
│   ├── templates/                  # 项目模板目录
│   │   ├── index.ts               # 模板注册与路由
│   │   │   ├── templates[]        # 模板列表
│   │   │   ├── templateMap        # 模板映射表
│   │   │   ├── getTemplate()      # 获取模板
│   │   │   └── createProjectStructure() # 创建结构
│   │   │
│   │   ├── library.ts             # Library 模板 (136 行)
│   │   ├── react.ts               # React 模板 (775 行)
│   │   ├── vue.ts                 # Vue 模板 (642 行)
│   │   ├── shared.ts              # 共享工具函数 (791 行)
│   │   │
│   │   └── files/                 # 模板文件目录
│   │       ├── shared/            # 共享模板文件
│   │       │   ├── styles.ts      # 样式模板
│   │       │   ├── store.ts       # 状态管理模板
│   │       │   └── packages.ts    # Monorepo 包模板
│   │       ├── react/             # React 特定文件
│   │       ├── vue/               # Vue 特定文件
│   │       └── configs/           # 配置文件模板
│   │
│   ├── utils/                      # 工具函数目录
│   │   ├── index.ts               # 工具函数导出
│   │   ├── logger.ts              # 日志工具 (129 行)
│   │   │   ├── showBanner()       # 显示 Logo Banner
│   │   │   ├── showMiniBanner()   # 显示简洁 Banner
│   │   │   ├── showSuccessMessage() # 显示成功消息
│   │   │   └── logger             # 日志对象
│   │   │
│   │   ├── fileGenerator.ts       # 文件生成器 (557 行)
│   │   │   ├── FileGenerator      # 文件生成器类
│   │   │   └── createBaseFiles()  # 创建基础文件
│   │   │
│   │   └── dependency.ts          # 依赖管理
│   │       ├── installDependencies() # 安装依赖
│   │       ├── initGitRepo()      # 初始化 Git
│   │       └── generatePackageJson() # 生成 package.json
│   │
│   ├── types/                      # 类型定义目录
│   │   └── index.ts               # 全部类型定义 (162 行)
│   │
│   └── constants/                  # 常量定义目录
│       ├── index.ts               # 常量导出
│       └── versions.ts            # 依赖版本常量
│
├── docs/                           # VitePress 文档
├── package.json                    # 项目配置
├── rollup.config.mjs               # Rollup 配置
├── tsconfig.json                   # TypeScript 配置
├── publish.sh                      # 发布脚本
└── README.md                       # 项目说明
```

### 4.2 文件数量统计

| 目录 | 文件数 | 说明 |
|------|--------|------|
| src/commands/ | 4 | 命令实现 |
| src/plugins/ | 13 个插件目录 | 插件实现 |
| src/templates/ | 6 | 模板定义 |
| src/templates/files/ | 4 | 模板文件 |
| src/utils/ | 4 | 工具函数 |
| src/types/ | 1 | 类型定义 |
| src/constants/ | 2 | 常量定义 |
| **总计** | **54** | TypeScript 源文件 |

---

## 5. 技术选型

### 5.1 核心依赖

```json
{
  "dependencies": {
    "chalk": "^5.3.0",         // 终端颜色输出
    "commander": "^12.0.0",    // 命令行框架
    "ejs": "^3.1.9",           // 模板引擎（备用）
    "execa": "^8.0.1",         // 子进程执行
    "fs-extra": "^11.2.0",     // 增强文件操作
    "gradient-string": "^3.0.0", // 渐变字符串
    "inquirer": "^9.2.15",     // 交互式问答
    "ora": "^8.0.1"            // Loading 动画
  }
}
```

### 5.2 开发依赖

```json
{
  "devDependencies": {
    "rollup": "^4.59.0",                    // 构建工具
    "@rollup/plugin-typescript": "^12.3.0", // TypeScript 插件
    "@rollup/plugin-node-resolve": "^16.0.3", // 模块解析
    "@rollup/plugin-commonjs": "^29.0.2",   // CommonJS 转换
    "@rollup/plugin-json": "^6.1.0",        // JSON 导入
    "typescript": "^5.3.3",                 // TypeScript 编译器
    "vitepress": "^1.6.4"                   // 文档站点
  }
}
```

### 5.3 技术选型理由

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  技术选型理由                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  Commander.js vs Yargs                                                                │
│  ├── 选择 Commander.js                                                              │
│  ├── 理由：API 更简洁，子命令支持更好                                               │
│  └── 版本：12.x 支持 ESM                                                            │
│                                                                                       │
│  Inquirer.js vs Enquirer                                                              │
│  ├── 选择 Inquirer.js                                                               │
│  ├── 理由：生态成熟，类型支持好，社区活跃                                           │
│  └── 版本：9.x 支持 ESM                                                            │
│                                                                                       │
│  fs-extra vs fs                                                                        │
│  ├── 选择 fs-extra                                                                  │
│  ├── 理由：Promise 支持，API 更友好                                                │
│  └── 方法：ensureDir, emptyDir, readJson, writeJson                                │
│                                                                                       │
│  execa vs child_process                                                               │
│  ├── 选择 execa                                                                     │
│  ├── 理由：Promise 支持，更好的错误处理，跨平台                                     │
│  └── 用例：安装依赖、执行 Git 命令                                                 │
│                                                                                       │
│  Rollup vs esbuild                                                                    │
│  ├── 选择 Rollup                                                                    │
│  ├── 理由：更好的 Tree-shaking，插件生态丰富                                       │
│  └── 输出：单个 ESM 文件，外部化依赖                                               │
│                                                                                       │
│  ESM vs CJS                                                                            │
│  ├── 选择 ESM                                                                       │
│  ├── 理由：Node.js 原生支持，现代工具链首选                                        │
│  └── 配置："type": "module"                                                        │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. 内置插件一览

### 6.1 按类别分类

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  内置插件列表                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  代码检查 (Linter)                                                                     │
│  ├── ESLint ★         - ESLint 9 (Flat Config)，React 项目含 hooks 规则              │
│  │   └── 动态依赖：React 项目自动添加 react-hooks/react-refresh 插件                │
│  └── Stylelint        - CSS/Less/SCSS 样式检查                                        │
│      └── 动态依赖：根据 styleType 选择 less-scss 或 scss 依赖                       │
│                                                                                       │
│  代码格式化 (Formatter)                                                                │
│  └── Prettier ★       - 代码格式化工具                                                │
│      ├── .prettierrc 配置文件                                                       │
│      └── 与 ESLint 集成（eslint-config-prettier）                                   │
│                                                                                       │
│  测试框架 (Test)                                                                       │
│  ├── Jest             - JavaScript 测试框架                                           │
│  │   └── jest.config.js 配置                                                        │
│  └── Vitest           - 下一代测试框架（更快、兼容 Vite）                             │
│      └── vitest.config.ts 配置                                                      │
│                                                                                       │
│  Git 工具 (Git)                                                                        │
│  ├── Husky            - Git Hooks 工具                                                │
│  │   ├── postInstall：创建 .husky/pre-commit                                        │
│  │   └── 配合 lint-staged 使用                                                      │
│  └── Commitlint       - Git 提交信息规范检查                                          │
│      └── .commitlintrc.json 配置                                                    │
│                                                                                       │
│  构建打包 (Bundler)                                                                    │
│  ├── Vite             - 下一代前端构建工具                                            │
│  │   ├── 动态配置：根据 projectType 生成不同配置                                    │
│  │   └── vite.config.ts                                                            │
│  ├── Webpack          - 模块打包工具                                                  │
│  │   ├── 动态配置：根据 projectType 和 styleType 生成配置                           │
│  │   └── webpack.config.cjs                                                        │
│  └── Rollup           - JavaScript 模块打包器                                         │
│      └── rollup.config.mjs                                                         │
│                                                                                       │
│  其他 (Other)                                                                          │
│  └── TypeScript ★     - TypeScript 编译配置                                           │
│      ├── tsconfig.json                                                             │
│      └── 根据项目类型生成不同配置                                                   │
│                                                                                       │
│  ★ 表示默认启用的插件                                                                  │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 插件动态能力

| 插件 | 动态依赖 | 动态配置 | postInstall |
|------|----------|----------|-------------|
| ESLint | ✅ React 项目添加 hooks 插件 | ✅ 根据项目类型生成 | ❌ |
| Stylelint | ✅ 根据样式类型选择依赖 | ✅ 根据样式类型生成 | ❌ |
| Vite | ❌ | ✅ 根据项目类型生成 | ❌ |
| Webpack | ✅ 根据项目类型和样式类型 | ✅ 根据项目类型生成 | ❌ |
| Husky | ❌ | ❌ | ✅ 创建 Git Hook |
| TypeScript | ❌ | ✅ 根据项目类型生成 | ❌ |

---

[返回上级目录](../index.md) | [下一章：核心命令实现](../核心命令实现/index.md)
