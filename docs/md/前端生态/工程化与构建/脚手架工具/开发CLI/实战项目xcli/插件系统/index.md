# 插件系统详解

> 本节详细介绍 `@jserxiao/xcli` 的插件系统设计，包括插件接口定义、动态能力、生命周期钩子和内置插件实现。

## 学习要点

- 🔌 理解插件接口设计
- 🔄 掌握动态依赖和动态配置的实现
- 📝 理解文件生成机制
- 🎣 掌握 postInstall 生命周期钩子

---

## 1. 插件系统设计

### 1.1 设计理念

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  插件系统设计理念                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  核心原则                                                                              │
│  ├── 单一职责: 每个插件只负责一个功能领域                                             │
│  ├── 可配置性: 插件支持动态依赖、动态配置                                             │
│  ├── 可组合性: 多个插件可以组合使用，无冲突                                           │
│  └── 可扩展性: 用户可以开发自定义插件                                                 │
│                                                                                       │
│  插件能力                                                                              │
│  ├── 依赖注入: 向 package.json 添加依赖                                              │
│  ├── 脚本注入: 向 package.json 添加 npm scripts                                      │
│  ├── 文件生成: 生成配置文件                                                           │
│  └── 生命周期钩子: 执行安装后操作                                                     │
│                                                                                       │
│  动态能力                                                                              │
│  ├── 动态依赖: 根据 PluginContext 返回不同的依赖                                     │
│  ├── 动态配置: 根据 PluginContext 生成不同的配置文件内容                             │
│  └── 动态实例化: 运行时创建插件实例 (Stylelint)                                       │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 插件接口定义

```typescript
// src/types/index.ts

/**
 * 插件文件定义
 */
export interface PluginFile {
  /** 文件路径（支持静态字符串或动态函数） */
  path: string | ((context: PluginContext) => string);
  
  /** 文件内容（支持静态字符串或动态函数） */
  content: string | ((context: PluginContext) => string);
}

/**
 * 插件接口
 */
export interface Plugin {
  // ============ 元信息 ============
  
  /** 插件名称（唯一标识） */
  name: string;
  
  /** 显示名称（用于日志和 UI 展示） */
  displayName: string;
  
  /** 插件描述 */
  description: string;
  
  /** 插件类别 */
  category: 'linter' | 'formatter' | 'test' | 'git' | 'bundler' | 'tooling' | 'other';
  
  /** 是否默认启用 */
  defaultEnabled?: boolean;
  
  // ============ 依赖注入 ============
  
  /** 运行时依赖 */
  dependencies?: 
    | Record<string, string>                              // 静态依赖
    | ((context: PluginContext) => Record<string, string>); // 动态依赖
  
  /** 开发依赖 */
  devDependencies?: 
    | Record<string, string> 
    | ((context: PluginContext) => Record<string, string>);
  
  // ============ 脚本注入 ============
  
  /** npm scripts */
  scripts?: 
    | Record<string, string> 
    | ((context: PluginContext) => Record<string, string>);
  
  // ============ 文件生成 ============
  
  /** 需要生成的配置文件 */
  files?: PluginFile[];
  
  // ============ 生命周期钩子 ============
  
  /** 安装后回调（在依赖安装前执行） */
  postInstall?: (context: PluginContext) => Promise<void>;
}
```

### 1.3 插件上下文

```typescript
// src/types/index.ts

/**
 * 插件上下文 - 在插件执行时传递的配置信息
 */
export interface PluginContext {
  // ============ 项目信息 ============
  
  /** 项目名称 */
  projectName: string;
  
  /** 项目路径 */
  projectPath: string;
  
  /** 项目类型 */
  projectType: ProjectType; // 'library' | 'react' | 'vue'
  
  // ============ 技术选型 ============
  
  /** 样式预处理器 */
  styleType: StyleType; // 'css' | 'less' | 'scss'
  
  /** 状态管理 */
  stateManager: StateManagerType; // 'none' | 'redux' | 'mobx' | 'pinia'
  
  /** HTTP 请求库 */
  httpClient: HttpClientType; // 'none' | 'axios' | 'fetch'
  
  /** 监控 SDK */
  monitoring: MonitoringType; // 'none' | 'xstat'
  
  /** 打包工具 */
  bundler: BundlerType; // 'none' | 'vite' | 'webpack' | 'rollup'
  
  // ============ 插件配置 ============
  
  /** 已选插件列表 */
  selectedPlugins: string[];
  
  /** 是否使用 TypeScript */
  useTypeScript: boolean;
  
  /** 包管理器 */
  packageManager: 'npm' | 'yarn' | 'pnpm';
  
  // ============ 扩展信息 ============
  
  /** 其他配置选项 */
  options: Record<string, any>;
}
```

---

## 2. 插件注册机制

### 2.1 插件注册表

```typescript
// src/plugins/index.ts

import type { Plugin } from '../types';

// 导入所有插件
import { typescriptPlugin } from './typescript';
import { eslintPlugin } from './eslint';
import { prettierPlugin } from './prettier';
import { stylelintPlugin } from './stylelint';
import { jestPlugin } from './jest';
import { vitestPlugin } from './vitest';
import { huskyPlugin } from './husky';
import { commitlintPlugin } from './commitlint';
import { vitePlugin } from './vite';
import { webpackPlugin } from './webpack';
import { rollupPlugin } from './rollup';

/**
 * 所有可用插件列表
 * 顺序决定了插件在列表中的显示顺序
 */
export const plugins: Plugin[] = [
  typescriptPlugin,
  eslintPlugin,
  prettierPlugin,
  stylelintPlugin,
  jestPlugin,
  vitestPlugin,
  huskyPlugin,
  commitlintPlugin,
  vitePlugin,
  webpackPlugin,
  rollupPlugin,
];

/**
 * 插件映射表（按名称索引）
 * 用于 O(1) 时间复杂度的插件查找
 */
export const pluginMap = new Map<string, Plugin>(
  plugins.map((plugin) => [plugin.name, plugin])
);

/**
 * 按类别获取插件
 */
export function getPluginsByCategory(
  category: Plugin['category']
): Plugin[] {
  return plugins.filter((plugin) => plugin.category === category);
}

/**
 * 获取默认启用的插件
 */
export function getDefaultPlugins(): Plugin[] {
  return plugins.filter((plugin) => plugin.defaultEnabled);
}
```

### 2.2 插件选择 UI

```typescript
// src/plugins/index.ts

/**
 * 获取插件选项（用于 Inquirer.js checkbox）
 * 按类别分组显示
 */
export function getPluginChoices() {
  const categories = {
    linter: '代码检查',
    formatter: '代码格式化',
    test: '测试框架',
    git: 'Git 工具',
    bundler: '构建打包',
    other: '其他',
  };

  return Object.entries(categories).map(([category, categoryName]) => ({
    name: categoryName,
    plugins: plugins
      .filter((p) => p.category === category)
      .map((p) => ({
        name: p.displayName,
        value: p.name,
        checked: p.defaultEnabled,  // 默认选中
      })),
  }));
}
```

---

## 3. 动态能力实现

### 3.1 动态依赖

**ESLint 插件** - 根据项目类型返回不同依赖：

```typescript
// src/plugins/eslint/index.ts

import type { Plugin, PluginContext } from '../../types';
import { LINTER_VERSIONS } from '../../constants';

/**
 * 根据项目类型获取 ESLint 依赖
 */
function getEslintDependencies(context: PluginContext): Record<string, string> {
  // 基础依赖（所有项目都需要）
  const baseDeps = {
    eslint: LINTER_VERSIONS.eslint,
    'typescript-eslint': LINTER_VERSIONS['typescript-eslint'],
    '@eslint/js': LINTER_VERSIONS['@eslint/js'],
    'eslint-config-prettier': LINTER_VERSIONS['eslint-config-prettier'],
    globals: LINTER_VERSIONS.globals,
  };

  // React 项目额外添加 hooks 相关插件
  if (context.projectType === 'react') {
    return {
      ...baseDeps,
      'eslint-plugin-react-hooks': LINTER_VERSIONS['eslint-plugin-react-hooks'],
      'eslint-plugin-react-refresh': LINTER_VERSIONS['eslint-plugin-react-refresh'],
    };
  }

  return baseDeps;
}

export const eslintPlugin: Plugin = {
  name: 'eslint',
  displayName: 'ESLint',
  description: '添加 ESLint 代码检查配置（React 项目含 react-hooks/react-refresh 规则）',
  category: 'linter',
  defaultEnabled: true,
  
  // 动态依赖：使用函数而非静态对象
  devDependencies: (context: PluginContext) => getEslintDependencies(context),
  
  scripts: {
    lint: 'eslint src',
    'lint:fix': 'eslint src --fix',
  },
  
  files: [
    {
      path: 'eslint.config.js',
      content: (context) => getEslintConfig(context), // 动态配置
    },
  ],
};
```

### 3.2 动态实例化

**Stylelint 插件** - 根据样式类型创建不同实例：

```typescript
// src/plugins/stylelint/index.ts

import type { Plugin, StyleType } from '../../types';
import { LINTER_VERSIONS } from '../../constants';

/**
 * 创建 Stylelint 插件实例
 * 根据样式类型返回不同的依赖和配置
 */
export function createStylelintPlugin(styleType: StyleType = 'css'): Plugin {
  // 基础依赖
  const devDeps: Record<string, string> = {
    stylelint: LINTER_VERSIONS.stylelint,
    'stylelint-config-standard': LINTER_VERSIONS['stylelint-config-standard'],
    'stylelint-order': LINTER_VERSIONS['stylelint-order'],
    'stylelint-prettier': LINTER_VERSIONS['stylelint-prettier'],
  };

  // SCSS 需要额外依赖
  if (styleType === 'scss') {
    devDeps['stylelint-config-standard-scss'] = 
      LINTER_VERSIONS['stylelint-config-standard-scss'];
  }

  // Less 需要额外依赖
  if (styleType === 'less') {
    devDeps['postcss-less'] = LINTER_VERSIONS['postcss-less'];
  }

  return {
    name: 'stylelint',
    displayName: 'Stylelint',
    description: '添加 Stylelint 样式检查配置',
    category: 'linter',
    defaultEnabled: true,
    devDependencies: devDeps,
    scripts: {
      'lint:style': 'stylelint "src/**/*.{css,scss,less}"',
      'lint:style:fix': 'stylelint "src/**/*.{css,scss,less}" --fix',
    },
    files: [
      {
        path: '.stylelintrc.json',
        content: JSON.stringify(getStylelintConfig(styleType), null, 2),
      },
    ],
  };
}

// 默认实例（CSS）
export const stylelintPlugin: Plugin = createStylelintPlugin();
```

**在 init 命令中使用：**

```typescript
// src/commands/init.ts

// 如果选择了 stylelint，根据样式类型动态创建插件实例
const hasStylelint = selectedPlugins.some(p => p.name === 'stylelint');
if (hasStylelint) {
  const { createStylelintPlugin } = await import('../plugins/stylelint/index.js');
  const stylelintPluginInstance = createStylelintPlugin(config.styleType);
  // 替换原有的 stylelint 插件
  selectedPlugins = selectedPlugins.map(p => 
    p.name === 'stylelint' ? stylelintPluginInstance : p
  );
}
```

### 3.3 动态配置

**Vite 插件** - 根据项目类型生成不同配置：

```typescript
// src/plugins/vite/index.ts

import type { Plugin, PluginContext } from '../../types';

/**
 * React 项目 Vite 配置
 */
function getReactViteConfig(): string {
  return `import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
    plugins: [
      react(),
      legacy({ targets: ['defaults', 'not IE 11'] }),
    ],
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
    server: { port: 3000, open: true },
    build: { sourcemap: true, target: 'es2015' },
    define: { __APP_ENV__: JSON.stringify(env) },
  };
});
`;
}

/**
 * Vue 项目 Vite 配置
 */
function getVueViteConfig(): string {
  return `import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
    plugins: [
      vue(),
      legacy({ targets: ['defaults', 'not IE 11'] }),
    ],
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
    server: { port: 3000, open: true },
    build: { sourcemap: true, target: 'es2015' },
    define: { __APP_ENV__: JSON.stringify(env) },
  };
});
`;
}

/**
 * 根据项目类型返回配置
 */
function getViteConfig(context: PluginContext): string {
  switch (context.projectType) {
    case 'react':
      return getReactViteConfig();
    case 'vue':
      return getVueViteConfig();
    default:
      return getLibraryViteConfig();
  }
}

export const vitePlugin: Plugin = {
  name: 'vite',
  displayName: 'Vite',
  description: '添加 Vite 构建工具配置',
  category: 'bundler',
  defaultEnabled: false,
  devDependencies: {
    vite: BUNDLER_VERSIONS.vite,
    '@vitejs/plugin-legacy': BUNDLER_VERSIONS['@vitejs/plugin-legacy'],
    autoprefixer: STYLE_VERSIONS.autoprefixer,
  },
  scripts: {
    preview: 'vite preview',
  },
  files: [
    {
      path: 'vite.config.ts',
      content: (context: PluginContext) => getViteConfig(context), // 动态配置
    },
  ],
};
```

---

## 4. 生命周期钩子

### 4.1 postInstall 钩子

**Husky 插件** - 使用 postInstall 创建 Git Hook：

```typescript
// src/plugins/husky/index.ts

import type { Plugin } from '../../types';
import path from 'path';
import fs from 'fs-extra';

export const huskyPlugin: Plugin = {
  name: 'husky',
  displayName: 'Husky + lint-staged',
  description: '添加 Git Hooks 和代码提交前自动检查',
  category: 'git',
  defaultEnabled: false,
  
  devDependencies: {
    husky: GIT_VERSIONS.husky,
    'lint-staged': GIT_VERSIONS['lint-staged'],
  },
  
  scripts: {
    prepare: 'husky',  // npm install 后自动执行
  },
  
  files: [
    {
      path: '.lintstagedrc',
      content: JSON.stringify(
        {
          '*.ts': ['eslint --fix', 'prettier --write'],
          '*.{json,md}': ['prettier --write'],
        },
        null,
        2
      ),
    },
  ],
  
  /**
   * 安装后回调
   * 在文件生成后、依赖安装前执行
   */
  postInstall: async (context) => {
    // 创建 .husky 目录
    const huskyDir = path.join(context.projectPath, '.husky');
    await fs.ensureDir(huskyDir);

    // 创建 pre-commit hook
    await fs.writeFile(
      path.join(huskyDir, 'pre-commit'),
      `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`
    );
  },
};
```

### 4.2 钩子执行时机

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  postInstall 执行时机                                                                  │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  1. 创建项目目录结构     createProjectStructure()                                     │
│     └── 生成 src/, public/, packages/ 等目录                                         │
│                                                                                       │
│  2. 生成插件配置文件     FileGenerator.generateFromPlugins()                          │
│     └── 生成 .eslintrc, .prettierrc, vite.config.ts 等                               │
│                                                                                       │
│  3. 生成 package.json    generatePackageJson()                                        │
│     └── 合并模板依赖 + 插件依赖                                                       │
│                                                                                       │
│  4. 执行 postInstall 钩子  ← 在这里执行                                               │
│     └── Husky: 创建 .husky/pre-commit                                                │
│     └── 其他需要执行命令的插件                                                        │
│                                                                                       │
│  5. 安装依赖             installDependencies()                                        │
│     └── pnpm install                                                                 │
│                                                                                       │
│  6. 初始化 Git           initGitRepo()                                                │
│     └── git init && git add .                                                        │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. 内置插件一览

### 5.1 插件功能对比

| 插件 | 动态依赖 | 动态配置 | postInstall | 文件数 |
|------|----------|----------|-------------|--------|
| TypeScript | ❌ | ✅ tsconfig | ❌ | 1 |
| ESLint | ✅ React 项目添加 hooks | ✅ Flat Config | ❌ | 1 |
| Prettier | ❌ | ❌ | ❌ | 2 |
| Stylelint | ✅ 根据样式类型 | ✅ 根据样式类型 | ❌ | 2 |
| Jest | ❌ | ❌ | ❌ | 1 |
| Vitest | ❌ | ❌ | ❌ | 1 |
| Husky | ❌ | ❌ | ✅ 创建 Git Hook | 1 |
| Commitlint | ❌ | ❌ | ❌ | 1 |
| Vite | ❌ | ✅ 根据项目类型 | ❌ | 1 |
| Webpack | ✅ 根据项目和样式类型 | ✅ 根据项目类型 | ❌ | 1 |
| Rollup | ❌ | ❌ | ❌ | 1 |

### 5.2 插件依赖关系

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  插件依赖关系图                                                                        │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  TypeScript ──────┬──────────────────────────────────────────────────────────────────│
│       │            │                                                                  │
│       │ 被依赖     │                                                                   │
│       ▼            │                                                                   │
│  ESLint ◄──────────┤  ESLint 需要 TypeScript 的类型信息                              │
│       │            │                                                                   │
│       │ 配合使用   │                                                                   │
│       ▼            │                                                                   │
│  Prettier ◄────────┘  eslint-config-prettier 禁用冲突规则                             │
│       │                                                                               │
│       │ 配合使用                                                                      │
│       ▼                                                                               │
│  Stylelint ─────── stylelint-prettier 禁用冲突规则                                   │
│                                                                                       │
│  Husky ─────────── 在 pre-commit 中执行 lint-staged                                  │
│       │                                                                               │
│       │ 调用                                                                          │
│       ▼                                                                               │
│  lint-staged ───── 调用 ESLint 和 Prettier                                           │
│                                                                                       │
│  Vite / Webpack ─── 构建工具，独立工作                                               │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. 文件生成器

### 6.1 FileGenerator 类

```typescript
// src/utils/fileGenerator.ts

import path from 'path';
import fs from 'fs-extra';
import type { Plugin, PluginFile, PluginContext } from '../types';

/**
 * 文件生成器
 * 负责根据插件定义生成配置文件
 */
export class FileGenerator {
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  /**
   * 生成单个文件
   */
  async generateFile(file: PluginFile): Promise<void> {
    // 解析文件路径
    const filePath = typeof file.path === 'function'
      ? file.path(this.context)
      : file.path;
    
    // 解析文件内容
    const content = typeof file.content === 'function'
      ? file.content(this.context)
      : file.content;

    // 写入文件
    const fullPath = path.join(this.context.projectPath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  /**
   * 批量生成文件
   */
  async generateFiles(files: PluginFile[]): Promise<void> {
    for (const file of files) {
      await this.generateFile(file);
    }
  }

  /**
   * 从插件列表生成所有文件
   */
  async generateFromPlugins(plugins: Plugin[]): Promise<void> {
    for (const plugin of plugins) {
      if (plugin.files && plugin.files.length > 0) {
        await this.generateFiles(plugin.files);
      }
    }
  }
}
```

### 6.2 使用示例

```typescript
// 在 init 命令中使用

const context: PluginContext = {
  projectName: 'my-project',
  projectPath: '/path/to/my-project',
  projectType: 'react',
  styleType: 'less',
  // ...
};

// 创建文件生成器
const generator = new FileGenerator(context);

// 从插件列表生成文件
await generator.generateFromPlugins(selectedPlugins);
```

---

## 7. 自定义插件开发

### 7.1 开发步骤

```typescript
// 1. 创建插件文件 src/plugins/my-plugin/index.ts

import type { Plugin, PluginContext } from '../../types';

/**
 * 自定义插件
 */
export const myPlugin: Plugin = {
  // 元信息
  name: 'my-plugin',
  displayName: 'My Plugin',
  description: '这是一个自定义插件',
  category: 'other',
  defaultEnabled: false,

  // 依赖（可选）
  devDependencies: {
    'some-package': '^1.0.0',
  },

  // 或动态依赖
  devDependencies: (context: PluginContext) => {
    if (context.projectType === 'react') {
      return { 'react-package': '^1.0.0' };
    }
    return {};
  },

  // 脚本（可选）
  scripts: {
    'my-command': 'my-plugin run',
  },

  // 配置文件（可选）
  files: [
    {
      path: '.mypluginrc',
      content: JSON.stringify({ /* 配置 */ }, null, 2),
    },
    // 动态内容
    {
      path: (context) => `src/${context.projectName}.ts`,
      content: (context) => `// Generated for ${context.projectName}`,
    },
  ],

  // 生命周期钩子（可选）
  postInstall: async (context) => {
    console.log('Plugin installed!');
  },
};
```

### 7.2 注册插件

```typescript
// 2. 在 src/plugins/index.ts 中注册

import { myPlugin } from './my-plugin';

export const plugins: Plugin[] = [
  // ...其他插件
  myPlugin,
];
```

---

[返回上级目录](../index.md) | [上一章：核心命令实现](../核心命令实现/index.md) | [下一章：模板系统](../模板系统/index.md)
