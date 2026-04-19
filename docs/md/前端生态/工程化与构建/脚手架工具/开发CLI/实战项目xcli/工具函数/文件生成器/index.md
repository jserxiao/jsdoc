# 文件生成器

文件生成器是 xcli 的核心工具之一，负责根据插件配置和模板生成项目文件。

## FileGenerator 类

### 类定义

```typescript
import fs from 'fs-extra';
import path from 'path';
import type { Plugin, PluginContext, PluginFile } from '../types/index';

/**
 * 文件生成器
 */
export class FileGenerator {
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  // ... 方法实现
}
```

### 核心方法

#### generateFile - 生成单个文件

```typescript
/**
 * 生成单个文件
 */
async generateFile(file: PluginFile): Promise<void> {
  // 处理动态路径
  const filePathStr =
    typeof file.path === 'function'
      ? file.path(this.context)
      : file.path;
  const filePath = path.join(this.context.projectPath, filePathStr);
  const dir = path.dirname(filePath);

  // 确保目录存在
  await fs.ensureDir(dir);

  // 生成文件内容
  const content =
    typeof file.content === 'function'
      ? file.content(this.context)
      : file.content;

  // 写入文件
  await fs.writeFile(filePath, content, 'utf-8');
}
```

**处理流程**：

```
┌─────────────────────────────────────────────────────────────┐
│                    generateFile 流程                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 解析文件路径                                            │
│     ├── 静态路径：直接使用 file.path                        │
│     └── 动态路径：调用 file.path(context) 获取              │
│                                                             │
│  2. 确保目录存在                                            │
│     └── fs.ensureDir(dir)                                   │
│                                                             │
│  3. 解析文件内容                                            │
│     ├── 静态内容：直接使用 file.content                     │
│     └── 动态内容：调用 file.content(context) 获取           │
│                                                             │
│  4. 写入文件                                                │
│     └── fs.writeFile(filePath, content, 'utf-8')            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### generateFiles - 批量生成文件

```typescript
/**
 * 批量生成文件
 */
async generateFiles(files: PluginFile[]): Promise<void> {
  for (const file of files) {
    await this.generateFile(file);
  }
}
```

#### generateFromPlugins - 根据插件生成文件

```typescript
/**
 * 根据插件生成文件
 */
async generateFromPlugins(plugins: Plugin[]): Promise<void> {
  for (const plugin of plugins) {
    if (plugin.files && plugin.files.length > 0) {
      await this.generateFiles(plugin.files);
    }
  }
}
```

---

## createBaseFiles 函数

为项目创建基础文件（`.gitignore` 和 `README.md`）。

### 函数签名

```typescript
export async function createBaseFiles(
  projectPath: string,
  projectName: string,
  projectType: string,
  context?: { 
    styleType?: string; 
    stateManager?: string; 
    httpClient?: string; 
    monitoring?: string 
  }
): Promise<void>
```

### .gitignore 生成

根据项目类型生成不同内容的 `.gitignore`：

```typescript
// library 项目使用简化版的 gitignore
if (isLibrary) {
  await fs.writeFile(
    path.join(projectPath, '.gitignore'),
    `# Dependencies
node_modules/

# Build output
dist/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage
coverage/

# Environment
.env
.env.local
.env.*.local
`,
    'utf-8'
  );
} else {
  // React/Vue 项目使用完整的 gitignore
  await fs.writeFile(
    path.join(projectPath, '.gitignore'),
    getGitignoreContent(),
    'utf-8'
  );
}
```

### README.md 生成

根据项目类型生成定制化的 README：

#### React 项目 README

```typescript
if (projectType === 'react') {
  readmeContent += `一个基于 React 18 + TypeScript + Vite 构建的现代化前端项目。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 |
| 语言 | TypeScript 5 |
| 构建 | Vite 5 |
| 路由 | React Router 6 |
| 样式 | ${styleExt.toUpperCase()} |
| 代码规范 | ESLint 9 + Prettier |
| 包管理 | pnpm (Monorepo) |

## 目录结构

\`\`\`
${projectName}/
├── src/                    # 主应用源码
│   ├── api/                # API 请求
│   ├── components/         # 通用组件
│   ├── pages/              # 页面组件
│   ├── hooks/              # 自定义 Hooks
│   ├── store/              # Redux 状态管理
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型定义
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 入口文件
├── packages/               # Monorepo 子包
│   ├── shared/             # 共享工具库
│   └── ui/                 # UI 组件库
└── ...
\`\`\`

## 快速开始

\`\`\`bash
pnpm install
pnpm dev
\`\`\`
`;
}
```

#### Vue 项目 README

```typescript
else if (projectType === 'vue') {
  readmeContent += `一个基于 Vue 3 + TypeScript + Vite 构建的现代化前端项目。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 |
| 语言 | TypeScript 5 |
| 构建 | Vite 5 |
| 路由 | Vue Router 4 |
| 样式 | ${styleExt.toUpperCase()} |
| 代码规范 | ESLint 9 + Prettier |
| 包管理 | pnpm (Monorepo) |

## 目录结构

\`\`\`
${projectName}/
├── src/                    # 主应用源码
│   ├── api/                # API 请求
│   ├── components/         # 通用组件
│   ├── pages/              # 页面组件
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia 状态管理
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型定义
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
└── ...
\`\`\`
`;
}
```

#### Library 项目 README

```typescript
else {
  // Library 项目
  readmeContent += `一个 TypeScript 库项目。

## 技术栈

| 类别 | 技术 |
|------|------|
| 语言 | TypeScript 5 |
| 构建 | TypeScript Compiler |
| 代码规范 | ESLint 9 + Prettier |
| 测试 | Jest |

## 使用

\`\`\`typescript
import { hello } from '${projectName}';

console.log(hello('World'));
\`\`\`

## 开发

\`\`\`bash
pnpm install
pnpm build
pnpm test
\`\`\`
`;
}
```

---

## PluginFile 类型

`PluginFile` 接口定义了插件文件的配置结构：

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

### 静态文件示例

```typescript
const staticFile: PluginFile = {
  path: '.prettierrc',
  content: JSON.stringify({
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
  }, null, 2),
};
```

### 动态文件示例

```typescript
const dynamicFile: PluginFile = {
  // 动态路径：根据样式预处理器选择扩展名
  path: (context) => `src/styles/global.${context.styleType}`,
  // 动态内容：根据上下文生成
  content: (context) => {
    if (context.styleType === 'scss') {
      return `// SCSS Global Styles
$primary-color: #1890ff;
$font-size-base: 14px;
`;
    }
    if (context.styleType === 'less') {
      return `// Less Global Styles
@primary-color: #1890ff;
@font-size-base: 14px;
`;
    }
    return `/* Global Styles */`;
  },
};
```

---

## 实际应用示例

### ESLint 插件文件生成

```typescript
// plugins/eslint/index.ts
const eslintPlugin: Plugin = {
  name: 'eslint',
  displayName: 'ESLint',
  description: 'JavaScript/TypeScript 代码检查工具',
  category: 'linter',
  devDependencies: {
    'eslint': '^9.18.0',
    'typescript-eslint': '^8.20.0',
  },
  files: [
    {
      path: 'eslint.config.js',
      content: (context) => {
        // 根据项目类型生成不同配置
        const imports = [
          `import js from '@eslint/js';`,
          `import tseslint from 'typescript-eslint';`,
        ];
        
        if (context.projectType === 'react') {
          imports.push(`import reactHooks from 'eslint-plugin-react-hooks';`);
        }
        
        return `${imports.join('\n')}

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // ... 其他配置
);`;
      },
    },
  ],
};
```

### TypeScript 配置文件生成

```typescript
const tsConfigFile: PluginFile = {
  path: 'tsconfig.json',
  content: (context) => JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Node',
      lib: ['ES2022'],
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  }, null, 2),
};
```

---

## 最佳实践

### 1. 目录自动创建

```typescript
// FileGenerator 会自动创建不存在的目录
await fs.ensureDir(dir);
```

### 2. 动态内容分离

```typescript
// 将内容生成逻辑封装为独立函数
function generateESLintConfig(context: PluginContext): string {
  const rules: Record<string, string> = {
    'no-unused-vars': 'warn',
    'no-console': 'off',
  };
  
  if (context.projectType === 'react') {
    rules['react-hooks/rules-of-hooks'] = 'error';
  }
  
  return `export default ${JSON.stringify({ rules }, null, 2)};`;
}
```

### 3. 文件写入顺序

```typescript
// 先创建目录结构，再写入文件
async function createProject(projectPath: string, files: PluginFile[]) {
  const generator = new FileGenerator(context);
  
  // 批量生成
  await generator.generateFiles(files);
  
  // 创建基础文件
  await createBaseFiles(projectPath, projectName, projectType);
}
```

---

## 总结

文件生成器模块提供了：

1. **FileGenerator 类**：封装文件生成的核心逻辑
2. **动态支持**：路径和内容都支持动态生成
3. **基础文件**：自动生成 `.gitignore` 和 `README.md`
4. **类型安全**：完整的 TypeScript 类型定义

这套机制确保了 xcli 能够灵活、高效地生成各种类型的项目文件。
