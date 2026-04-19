# 类型系统详解

xcli 项目采用 TypeScript 开发，拥有完整的类型定义系统。本章将详细介绍项目的核心类型定义、设计理念和实际应用。

## 类型系统概览

xcli 的类型系统位于 `src/types/index.ts` 文件中，主要包含以下几个核心类型模块：

| 类型模块 | 说明 | 核心类型 |
|---------|------|---------|
| 插件类型 | 定义插件的结构和行为 | `Plugin`, `PluginFile`, `PluginContext` |
| 模板类型 | 定义模板生成器的结构 | `TemplateGenerator` |
| 项目类型 | 定义项目配置选项 | `ProjectConfig`, `ProjectType`, `StyleType` 等 |
| CLI 类型 | 定义命令行选项 | `CLIOptions` |

---

## 核心类型定义

### 1. Plugin 插件类型

`Plugin` 接口是插件系统的核心类型，定义了一个插件应具备的所有属性和方法。

```typescript
/**
 * 插件定义
 */
export interface Plugin {
  /** 插件名称（唯一标识） */
  name: string;
  /** 插件显示名称（用于 UI 展示） */
  displayName: string;
  /** 插件描述 */
  description: string;
  /** 插件类别 */
  category: 'linter' | 'formatter' | 'test' | 'git' | 'bundler' | 'tooling' | 'other';
  /** 是否默认启用 */
  defaultEnabled?: boolean;
  /** 依赖包（支持静态或动态） */
  dependencies?: Record<string, string> | ((context: PluginContext) => Record<string, string>);
  /** 开发依赖包（支持静态或动态） */
  devDependencies?: Record<string, string> | ((context: PluginContext) => Record<string, string>);
  /** 需要生成的文件 */
  files?: PluginFile[];
  /** 需要添加的 npm scripts（支持静态或动态） */
  scripts?: Record<string, string> | ((context: PluginContext) => Record<string, string>);
  /** 安装后的回调 */
  postInstall?: (context: PluginContext) => Promise<void>;
}
```

#### 设计亮点

1. **静态与动态依赖支持**：`dependencies` 和 `devDependencies` 属性可以是一个静态对象，也可以是一个函数，根据 `PluginContext` 动态返回依赖列表。这种设计使得插件可以根据项目类型、样式预处理器等上下文信息动态决定需要安装哪些依赖。

   ```typescript
   // 静态依赖示例
   const prettierPlugin: Plugin = {
     name: 'prettier',
     devDependencies: {
       'prettier': '^3.2.4',
     },
   };

   // 动态依赖示例
   const stylelintPlugin: Plugin = {
     name: 'stylelint',
     devDependencies: (context) => {
       const deps: Record<string, string> = {
         'stylelint': '^16.2.0',
         'stylelint-config-standard': '^38.0.0',
       };
       // 根据样式预处理器动态添加依赖
       if (context.styleType === 'scss') {
         deps['stylelint-config-standard-scss'] = '^15.0.0';
       }
       if (context.styleType === 'less') {
         deps['postcss-less'] = '^6.0.0';
       }
       return deps;
     },
   };
   ```

2. **插件分类**：通过 `category` 属性将插件分为七大类，便于用户理解和筛选：
   - `linter`：代码检查工具（ESLint, Stylelint）
   - `formatter`：代码格式化工具（Prettier）
   - `test`：测试工具（Jest, Vitest）
   - `git`：Git 相关工具（Husky, Commitlint）
   - `bundler`：打包工具（Vite, Webpack, Rollup）
   - `tooling`：其他工具（TypeScript）
   - `other`：其他插件

3. **生命周期钩子**：`postInstall` 钩子允许插件在依赖安装完成后执行自定义逻辑，如 Husky 的 Git 钩子初始化。

---

### 2. PluginFile 插件文件类型

`PluginFile` 接口定义了插件需要生成的文件结构。

```typescript
/**
 * 插件文件定义
 */
export interface PluginFile {
  /** 文件路径（相对于项目根目录，支持动态路径） */
  path: string | ((context: PluginContext) => string);
  /** 文件内容（可以是字符串或模板路径） */
  content: string | ((context: PluginContext) => string);
  /** 是否是模板文件 */
  isTemplate?: boolean;
}
```

#### 设计亮点

1. **动态路径支持**：`path` 属性可以是函数，根据上下文动态生成文件路径。

   ```typescript
   const files: PluginFile[] = [
     {
       // 动态路径：根据样式预处理器选择文件扩展名
       path: (context) => `src/styles/global.${context.styleType}`,
       content: (context) => {
         if (context.styleType === 'scss') {
           return `// SCSS Global Styles\n$primary-color: #1890ff;`;
         }
         return `/* Global Styles */`;
       },
     },
   ];
   ```

2. **模板文件支持**：通过 `isTemplate` 标识文件是否需要模板处理（预留扩展能力）。

---

### 3. PluginContext 插件上下文类型

`PluginContext` 接口定义了传递给插件上下文信息的结构，是插件动态能力的核心。

```typescript
/**
 * 插件上下文
 */
export interface PluginContext {
  /** 项目名称 */
  projectName: string;
  /** 项目路径 */
  projectPath: string;
  /** 项目类型 */
  projectType: ProjectType;
  /** 样式预处理器 */
  styleType: StyleType;
  /** 状态管理 */
  stateManager: StateManagerType;
  /** HTTP 请求库 */
  httpClient: HttpClientType;
  /** 前端监控 SDK */
  monitoring: MonitoringType;
  /** 打包工具 */
  bundler: BundlerType;
  /** 用户选择的插件列表 */
  selected_plugins: string[];
  /** 是否使用 TypeScript */
  useTypeScript: boolean;
  /** 包管理器 */
  packageManager: 'npm' | 'yarn' | 'pnpm';
  /** 其他配置选项 */
  options: Record<string, any>;
}
```

#### 上下文信息的用途

| 属性 | 用途示例 |
|------|---------|
| `projectName` | 生成 `package.json` 中的 `name` 字段 |
| `projectType` | 决定使用 React 还是 Vue 相关依赖 |
| `styleType` | 决定安装 less、sass 还是仅 css 相关依赖 |
| `stateManager` | 决定安装 Redux、MobX 还是 Pinia |
| `httpClient` | 决定是否安装 axios |
| `bundler` | 决定使用 Vite 还是 Webpack 配置 |
| `selectedPlugins` | 判断是否需要处理插件间的依赖关系 |
| `packageManager` | 决定使用 npm、yarn 还是 pnpm 命令 |

---

## 项目类型定义

### 项目类型联合类型

xcli 支持三种项目类型，使用联合类型（Union Type）定义：

```typescript
/**
 * 项目类型
 */
export type ProjectType = 'library' | 'react' | 'vue';
```

### 配置选项联合类型

```typescript
/**
 * 样式预处理器类型
 */
export type StyleType = 'css' | 'less' | 'scss';

/**
 * 状态管理类型
 */
export type StateManagerType = 'none' | 'redux' | 'mobx' | 'pinia';

/**
 * HTTP 请求库类型
 */
export type HttpClientType = 'axios' | 'fetch' | 'none';

/**
 * 前端监控 SDK 类型
 */
export type MonitoringType = 'xstat' | 'none';

/**
 * 打包工具类型
 */
export type BundlerType = 'vite' | 'webpack' | 'rollup' | 'none';
```

这些联合类型确保了配置选项的类型安全，IDE 会提供自动补全提示，编译器会检查赋值是否合法。

---

## ProjectConfig 项目配置类型

`ProjectConfig` 接口定义了完整的项目配置结构，是 `init` 命令交互流程的最终输出。

```typescript
/**
 * 项目配置
 */
export interface ProjectConfig {
  /** 项目名称 */
  projectName: string;
  /** 项目描述 */
  description?: string;
  /** 作者 */
  author?: string;
  /** 项目类型 */
  projectType: ProjectType;
  /** 样式预处理器 */
  styleType: StyleType;
  /** 状态管理 */
  stateManager: StateManagerType;
  /** HTTP 请求库 */
  httpClient: HttpClientType;
  /** 前端监控 SDK */
  monitoring: MonitoringType;
  /** 打包工具 */
  bundler: BundlerType;
  /** 是否使用 TypeScript */
  useTypeScript: boolean;
  /** 选择的插件 */
  plugins: string[];
  /** 包管理器 */
  packageManager: 'npm' | 'yarn' | 'pnpm';
  /** 是否初始化 Git */
  initGit: boolean;
  /** 是否立即安装依赖 */
  installDeps: boolean;
  /** 是否创建 VSCode 配置 */
  createVscodeConfig: boolean;
}
```

---

## CLIOptions 命令行选项类型

`CLIOptions` 接口定义了命令行参数的类型结构，支持非交互式创建项目。

```typescript
/**
 * CLI 选项
 */
export interface CLIOptions {
  /** 项目名称（命令行指定） */
  projectName?: string;
  /** 模板名称 */
  template?: string;
  /** 样式预处理器 */
  style?: 'css' | 'less' | 'scss';
  /** 状态管理 */
  stateManager?: 'none' | 'redux' | 'mobx' | 'pinia';
  /** HTTP 请求库 */
  httpClient?: HttpClientType;
  /** 前端监控 SDK */
  monitoring?: MonitoringType;
  /** 打包工具 */
  bundler?: BundlerType;
  /** 跳过安装依赖 */
  skipInstall?: boolean;
  /** 跳过 Git 初始化 */
  skipGit?: boolean;
  /** 使用默认配置 */
  default?: boolean;
  /** 包管理器 */
  packageManager?: 'npm' | 'yarn' | 'pnpm';
}
```

### 使用示例

通过命令行参数快速创建项目：

```bash
# 非交互式创建 React 项目
xcli init my-react-app \
  --template react \
  --style less \
  --state-manager redux \
  --http-client axios \
  --bundler vite \
  --package-manager pnpm \
  --skip-git

# 使用默认配置快速创建
xcli init my-lib --default
```

---

## TemplateGenerator 模板生成器类型

`TemplateGenerator` 接口定义了模板生成器的结构，位于 `src/templates/library.ts` 文件中。

```typescript
/**
 * 模板生成器接口
 */
export interface TemplateGenerator {
  /** 项目类型 */
  type: ProjectType;
  /** 显示名称 */
  displayName: string;
  /** 描述信息 */
  description: string;
  /** 创建项目结构 */
  createStructure: (projectPath: string, context: PluginContext) => Promise<void>;
  /** 获取依赖列表 */
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

### 实现示例

```typescript
export const libraryTemplate: TemplateGenerator = {
  type: 'library',
  displayName: 'Library',
  description: 'TypeScript/JavaScript 库项目',

  createStructure: async (projectPath, context) => {
    const { useTypeScript = true } = context;
    // 创建目录结构
    await fs.ensureDir(path.join(projectPath, 'src'));
    await fs.ensureDir(path.join(projectPath, 'dist'));
    // 创建入口文件和配置文件...
  },

  getDependencies: (_style, _state, _http, _monitor, _bundler, useTypeScript = true) => {
    const deps = { dependencies: {}, devDependencies: {} };
    if (useTypeScript) {
      deps.devDependencies['typescript'] = '^5.3.3';
    }
    return deps;
  },

  getScripts: (_bundler, useTypeScript = true) => {
    if (useTypeScript) {
      return { build: 'tsc', start: 'node dist/index.js' };
    }
    return { build: 'echo "No build step"', start: 'node src/index.js' };
  },
};
```

---

## 类型系统设计原则

### 1. 单一数据源（Single Source of Truth）

所有核心类型定义集中在 `src/types/index.ts` 文件中，避免类型定义分散导致的不一致问题。

### 2. 接口优先设计

使用 `interface` 而非 `type` 定义对象结构，便于扩展和继承：

```typescript
// 推荐：使用 interface
export interface Plugin {
  name: string;
  // ...
}

// 联合类型使用 type
export type ProjectType = 'library' | 'react' | 'vue';
```

### 3. 动态能力支持

通过函数类型的属性支持动态配置：

```typescript
// 静态配置
dependencies?: Record<string, string>;

// 动态配置（根据上下文返回）
dependencies?: (context: PluginContext) => Record<string, string>;
```

### 4. 可选属性与默认值

对于可选属性，在实现时提供合理的默认值：

```typescript
getDependencies: (
  styleType?: StyleType,
  stateManager?: StateManagerType = 'none',
  // ...
  useTypeScript?: boolean = true
) => { /* ... */ }
```

### 5. 类型复用

避免重复定义相同的类型，通过导入复用：

```typescript
// templates/library.ts
import type { 
  ProjectType, 
  PluginContext, 
  StyleType 
} from '../types';
```

---

## 类型守卫与类型推断

### 类型守卫

在运行时判断类型，提供类型窄化（Type Narrowing）：

```typescript
function isBundlerPlugin(plugin: Plugin): boolean {
  return plugin.category === 'bundler';
}

function getBundlerType(selectedPlugins: string[]): BundlerType {
  if (selectedPlugins.includes('vite')) return 'vite';
  if (selectedPlugins.includes('webpack')) return 'webpack';
  if (selectedPlugins.includes('rollup')) return 'rollup';
  return 'none';
}
```

### 类型推断

利用 TypeScript 的类型推断能力，减少显式类型注解：

```typescript
// templateMap 自动推断为 Map<ProjectType, TemplateGenerator>
export const templateMap = new Map<ProjectType, typeof libraryTemplate>(
  templates.map((t) => [t.type, t])
);

// 函数返回类型自动推断
export function getTemplateChoices() {
  return templates.map((t) => ({
    name: `${t.displayName} - ${t.description}`,
    value: t.type,
  }));
}
```

---

## 类型与常量的协作

版本常量文件 `src/constants/versions.ts` 使用 `as const` 断言确保类型安全：

```typescript
export const BUNDLER_VERSIONS = {
  vite: '^5.0.12',
  webpack: '^5.98.0',
  rollup: '^4.9.0',
} as const;

// 类型推断为只读字面量类型
// BUNDLER_VERSIONS.vite 的类型是 '^5.0.12' 而非 string
```

这种设计确保了版本号在编译期就被检查，避免拼写错误。

---

## 总结

xcli 的类型系统设计体现了以下核心思想：

1. **类型安全**：通过完整的类型定义，在编译期捕获潜在错误
2. **灵活性**：通过静态与动态结合的方式，支持复杂配置场景
3. **可扩展性**：接口设计便于后续添加新功能
4. **开发体验**：完善的类型定义提供优秀的 IDE 自动补全和类型提示

这套类型系统为 xcli 的插件系统、模板系统和命令系统提供了坚实的类型基础，是整个脚手架工具稳定运行的重要保障。
