# 插件接口定义

xcli 的插件系统基于统一的接口设计，确保所有插件具有一致的结构和行为。

## Plugin 接口

### 完整定义

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

### 字段详解

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | ✅ | 插件唯一标识，用于命令行引用 |
| `displayName` | `string` | ✅ | 显示名称，用于交互界面展示 |
| `description` | `string` | ✅ | 插件功能描述 |
| `category` | `PluginCategory` | ✅ | 插件分类，用于分组展示 |
| `defaultEnabled` | `boolean` | ❌ | 是否默认启用，默认 `false` |
| `dependencies` | `Record \| Function` | ❌ | 运行时依赖 |
| `devDependencies` | `Record \| Function` | ❌ | 开发依赖 |
| `files` | `PluginFile[]` | ❌ | 需要生成的配置文件 |
| `scripts` | `Record \| Function` | ❌ | npm scripts |
| `postInstall` | `Function` | ❌ | 安装后回调钩子 |

---

## PluginFile 接口

定义插件需要生成的文件结构。

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

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `path` | `string \| Function` | ✅ | 文件相对路径 |
| `content` | `string \| Function` | ✅ | 文件内容 |
| `isTemplate` | `boolean` | ❌ | 是否为模板文件（预留） |

---

## PluginContext 接口

插件上下文包含了传递给插件的所有环境信息。

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
  selectedPlugins: string[];
  /** 是否使用 TypeScript */
  useTypeScript: boolean;
  /** 包管理器 */
  packageManager: 'npm' | 'yarn' | 'pnpm';
  /** 其他配置选项 */
  options: Record<string, any>;
}
```

### 上下文用途

| 属性 | 用途示例 |
|------|---------|
| `projectName` | 生成 package.json 的 name 字段 |
| `projectPath` | 文件生成的目标路径 |
| `projectType` | 决定框架相关依赖 |
| `styleType` | 决定样式预处理器依赖 |
| `stateManager` | 决定状态管理依赖 |
| `httpClient` | 决定 HTTP 请求库依赖 |
| `bundler` | 决定打包工具配置 |
| `selectedPlugins` | 处理插件间依赖关系 |
| `packageManager` | 选择包管理器命令 |

---

## 插件分类

```typescript
type PluginCategory = 'linter' | 'formatter' | 'test' | 'git' | 'bundler' | 'tooling' | 'other';
```

| 分类 | 说明 | 示例插件 |
|------|------|---------|
| `linter` | 代码检查 | ESLint, Stylelint |
| `formatter` | 代码格式化 | Prettier |
| `test` | 测试框架 | Jest, Vitest |
| `git` | Git 工具 | Husky, Commitlint |
| `bundler` | 构建打包 | Vite, Webpack, Rollup |
| `tooling` | 工具类 | TypeScript |
| `other` | 其他 | - |

---

## 设计模式

### 静态配置

适用于配置不随环境变化的插件：

```typescript
const prettierPlugin: Plugin = {
  name: 'prettier',
  displayName: 'Prettier',
  description: '代码格式化工具',
  category: 'formatter',
  defaultEnabled: true,
  devDependencies: {
    'prettier': '^3.2.4',
  },
  files: [
    {
      path: '.prettierrc',
      content: JSON.stringify({
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        printWidth: 100,
      }, null, 2),
    },
  ],
  scripts: {
    format: 'prettier --write "src/**/*.{ts,tsx,js,jsx,json,md}"',
  },
};
```

### 动态配置

根据上下文动态生成配置：

```typescript
const eslintPlugin: Plugin = {
  name: 'eslint',
  displayName: 'ESLint',
  description: 'JavaScript/TypeScript 代码检查工具',
  category: 'linter',
  defaultEnabled: true,
  // 动态依赖：根据项目类型返回不同的依赖
  devDependencies: (context: PluginContext) => {
    const baseDeps = {
      'eslint': '^9.18.0',
      'typescript-eslint': '^8.20.0',
    };
    
    // React 项目额外添加 react-hooks 插件
    if (context.projectType === 'react') {
      return {
        ...baseDeps,
        'eslint-plugin-react-hooks': '^7.0.1',
        'eslint-plugin-react-refresh': '^0.4.14',
      };
    }
    
    return baseDeps;
  },
  // 动态内容：根据项目类型生成不同配置
  files: [
    {
      path: 'eslint.config.js',
      content: (context) => generateEslintConfig(context),
    },
  ],
};
```

### 生命周期钩子

`postInstall` 钩子在依赖安装完成后执行：

```typescript
const huskyPlugin: Plugin = {
  name: 'husky',
  displayName: 'Husky + lint-staged',
  description: 'Git Hooks 管理',
  category: 'git',
  devDependencies: {
    'husky': '^9.0.0',
    'lint-staged': '^15.5.0',
  },
  scripts: {
    prepare: 'husky',
  },
  // 安装后创建 Git Hooks
  postInstall: async (context) => {
    const huskyDir = path.join(context.projectPath, '.husky');
    await fs.ensureDir(huskyDir);
    
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

---

## 插件注册机制

### 插件列表

```typescript
// src/plugins/index.ts
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
```

### 插件映射表

```typescript
/**
 * 插件映射表（按名称索引）
 */
export const pluginMap = new Map<string, Plugin>(
  plugins.map((plugin) => [plugin.name, plugin])
);
```

### 按类别获取

```typescript
/**
 * 按类别获取插件
 */
export function getPluginsByCategory(category: Plugin['category']): Plugin[] {
  return plugins.filter((plugin) => plugin.category === category);
}
```

### 获取默认插件

```typescript
/**
 * 获取默认启用的插件
 */
export function getDefaultPlugins(): Plugin[] {
  return plugins.filter((plugin) => plugin.defaultEnabled);
}
```

---

## 插件工厂函数

对于需要根据参数创建不同配置的插件，可以使用工厂函数：

```typescript
/**
 * 创建 Stylelint 插件实例（支持不同样式类型）
 */
export function createStylelintPlugin(styleType: StyleType = 'css'): Plugin {
  const devDeps: Record<string, string> = {
    stylelint: LINTER_VERSIONS.stylelint,
    'stylelint-config-standard': LINTER_VERSIONS['stylelint-config-standard'],
    'stylelint-order': LINTER_VERSIONS['stylelint-order'],
  };

  // SCSS 需要额外依赖
  if (styleType === 'scss') {
    devDeps['stylelint-config-standard-scss'] = LINTER_VERSIONS['stylelint-config-standard-scss'];
  }

  // Less 需要额外依赖
  if (styleType === 'less') {
    devDeps['postcss-less'] = LINTER_VERSIONS['postcss-less'];
  }

  return {
    name: 'stylelint',
    displayName: 'Stylelint',
    description: '样式检查工具',
    category: 'linter',
    defaultEnabled: true,
    devDependencies: devDeps,
    files: [
      {
        path: '.stylelintrc.json',
        content: JSON.stringify(getStylelintConfig(styleType), null, 2),
      },
    ],
  };
}
```

---

## 最佳实践

### 1. 命名规范

```typescript
// ✅ 推荐：使用简短、有意义的名称
name: 'eslint'
name: 'prettier'
name: 'vite'

// ❌ 不推荐：过长或包含特殊字符
name: 'eslint-linter-plugin'
name: '@scope/eslint'
```

### 2. 依赖版本管理

```typescript
// ✅ 推荐：从常量文件导入版本
import { LINTER_VERSIONS } from '../../constants';

devDependencies: {
  eslint: LINTER_VERSIONS.eslint,
}

// ❌ 不推荐：硬编码版本
devDependencies: {
  eslint: '^9.18.0',
}
```

### 3. 动态配置优化

```typescript
// ✅ 推荐：将动态逻辑封装为独立函数
function getEslintDependencies(context: PluginContext): Record<string, string> {
  const baseDeps = { /* ... */ };
  if (context.projectType === 'react') {
    return { ...baseDeps, /* React 依赖 */ };
  }
  return baseDeps;
}

const eslintPlugin: Plugin = {
  devDependencies: (context) => getEslintDependencies(context),
};

// ❌ 不推荐：直接在接口中编写复杂逻辑
const eslintPlugin: Plugin = {
  devDependencies: (context) => {
    // 大量逻辑代码...
  },
};
```

---

## 总结

xcli 的插件接口设计提供了：

1. **统一结构**：所有插件遵循相同的接口定义
2. **动态能力**：依赖、脚本、文件内容都支持动态生成
3. **生命周期**：`postInstall` 钩子支持安装后操作
4. **分类管理**：通过 category 实现插件分组
5. **工厂模式**：支持创建参数化的插件实例

这套接口设计为 xcli 提供了强大的扩展能力，使开发者能够轻松添加新功能。
