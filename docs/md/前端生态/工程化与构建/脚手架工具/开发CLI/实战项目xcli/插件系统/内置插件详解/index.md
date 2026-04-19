# 内置插件详解

xcli 内置了 11 个常用插件，覆盖代码检查、格式化、测试、Git 工具和构建打包等场景。

## 插件概览

| 插件 | 类别 | 默认启用 | 说明 |
|------|------|---------|------|
| TypeScript | tooling | ✅ | TypeScript 支持 |
| ESLint | linter | ✅ | JavaScript/TypeScript 代码检查 |
| Prettier | formatter | ✅ | 代码格式化 |
| Stylelint | linter | ✅ | 样式代码检查 |
| Jest | test | ❌ | JavaScript 测试框架 |
| Vitest | test | ❌ | Vite 原生测试框架 |
| Husky | git | ❌ | Git Hooks 管理 |
| Commitlint | git | ❌ | 提交信息规范检查 |
| Vite | bundler | ❌ | 新一代前端构建工具 |
| Webpack | bundler | ❌ | 功能强大的打包工具 |
| Rollup | bundler | ❌ | JavaScript 库打包工具 |

---

## TypeScript 插件

### 基本信息

```typescript
const typescriptPlugin: Plugin = {
  name: 'typescript',
  displayName: 'TypeScript',
  description: '添加 TypeScript 支持和配置',
  category: 'tooling',
  defaultEnabled: true,
};
```

### 生成的文件

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 添加的依赖

```json
{
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0"
  }
}
```

### 添加的脚本

```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

---

## ESLint 插件

### 基本信息

```typescript
const eslintPlugin: Plugin = {
  name: 'eslint',
  displayName: 'ESLint',
  description: '添加 ESLint 代码检查配置（React 项目含 react-hooks/react-refresh 规则）',
  category: 'linter',
  defaultEnabled: true,
};
```

### 动态依赖

```typescript
function getEslintDependencies(context: PluginContext): Record<string, string> {
  const baseDeps = {
    'eslint': '^9.18.0',
    'typescript-eslint': '^8.20.0',
    '@eslint/js': '^9.18.0',
    'eslint-config-prettier': '^10.0.1',
    'globals': '^15.11.0',
  };

  // React 项目添加专属插件
  if (context.projectType === 'react') {
    return {
      ...baseDeps,
      'eslint-plugin-react-hooks': '^7.0.1',
      'eslint-plugin-react-refresh': '^0.4.14',
    };
  }

  return baseDeps;
}
```

### 生成的配置文件（ESM Flat Config）

```javascript
// eslint.config.js (React 项目)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
```

### 添加的脚本

```json
{
  "scripts": {
    "lint": "eslint src",
    "lint:fix": "eslint src --fix"
  }
}
```

---

## Prettier 插件

### 基本信息

```typescript
const prettierPlugin: Plugin = {
  name: 'prettier',
  displayName: 'Prettier',
  description: '代码格式化工具',
  category: 'formatter',
  defaultEnabled: true,
};
```

### 生成的配置文件

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 添加的脚本

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

---

## Stylelint 插件

### 基本信息

```typescript
const stylelintPlugin: Plugin = {
  name: 'stylelint',
  displayName: 'Stylelint',
  description: '添加 Stylelint 样式检查配置',
  category: 'linter',
  defaultEnabled: true,
};
```

### 动态依赖

```typescript
function createStylelintPlugin(styleType: StyleType = 'css'): Plugin {
  const devDeps: Record<string, string> = {
    'stylelint': '^16.2.0',
    'stylelint-config-standard': '^38.0.0',
    'stylelint-order': '^8.1.1',
    'stylelint-prettier': '^5.0.0',
  };

  // SCSS 需要额外依赖
  if (styleType === 'scss') {
    devDeps['stylelint-config-standard-scss'] = '^15.0.0';
  }

  // Less 需要额外依赖
  if (styleType === 'less') {
    devDeps['postcss-less'] = '^6.0.0';
  }

  return { /* ... */ devDependencies: devDeps };
}
```

### 生成的配置文件

```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard", "stylelint-prettier/recommended"],
  "plugins": ["stylelint-order"],
  "rules": {
    "selector-class-pattern": null,
    "no-descending-specificity": null,
    "order/properties-order": [
      "position", "top", "right", "bottom", "left",
      "z-index", "display", "flex", "flex-direction",
      "width", "height", "margin", "padding",
      "border", "background", "color", "font-size"
    ]
  }
}
```

### 添加的脚本

```json
{
  "scripts": {
    "lint:style": "stylelint \"src/**/*.{css,scss,less}\"",
    "lint:style:fix": "stylelint \"src/**/*.{css,scss,less}\" --fix"
  }
}
```

---

## Husky 插件

### 基本信息

```typescript
const huskyPlugin: Plugin = {
  name: 'husky',
  displayName: 'Husky + lint-staged',
  description: '添加 Git Hooks 和代码提交前自动检查',
  category: 'git',
  defaultEnabled: false,
};
```

### 生成的文件

```json
// .lintstagedrc
{
  "*.ts": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### postInstall 钩子

```typescript
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
}
```

### 添加的脚本

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

---

## Vite 插件

### 基本信息

```typescript
const vitePlugin: Plugin = {
  name: 'vite',
  displayName: 'Vite',
  description: '添加 Vite 构建工具配置（含 autoprefixer 和 legacy 浏览器兼容）',
  category: 'bundler',
  defaultEnabled: false,
};
```

### 动态配置

```typescript
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
```

### React Vite 配置

```typescript
// vite.config.ts (React)
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
    plugins: [
      react(),
      legacy({
        // 自动读取 .browserslistrc 配置
      }),
    ],
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      sourcemap: true,
      target: 'es2015',
    },
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
  };
});
```

### 添加的依赖

```json
{
  "devDependencies": {
    "vite": "^5.0.12",
    "@vitejs/plugin-legacy": "^5.3.0",
    "autoprefixer": "^10.4.17"
  }
}
```

---

## 插件组合示例

### React 项目默认组合

```typescript
const reactPlugins = [
  typescriptPlugin,   // TypeScript 支持
  eslintPlugin,       // 代码检查
  prettierPlugin,     // 代码格式化
  stylelintPlugin,    // 样式检查
];
```

### 完整配置组合

```typescript
const fullStack = [
  // 基础工具
  typescriptPlugin,
  
  // 代码规范
  eslintPlugin,
  prettierPlugin,
  stylelintPlugin,
  
  // 测试
  vitestPlugin,
  
  // Git 工具
  huskyPlugin,
  commitlintPlugin,
  
  // 构建
  vitePlugin,
];
```

---

## 版本管理

所有插件的依赖版本统一在 `src/constants/versions.ts` 中管理：

```typescript
export const LINTER_VERSIONS = {
  eslint: '^9.18.0',
  'typescript-eslint': '^8.20.0',
  stylelint: '^16.2.0',
  prettier: '^3.2.4',
} as const;

export const GIT_VERSIONS = {
  husky: '^9.0.0',
  'lint-staged': '^15.5.0',
} as const;

export const BUNDLER_VERSIONS = {
  vite: '^5.0.12',
  webpack: '^5.98.0',
  rollup: '^4.9.0',
} as const;
```

---

## 总结

xcli 的内置插件具有以下特点：

1. **全面覆盖**：涵盖前端开发的主要工具链
2. **动态适配**：根据项目类型自动调整配置
3. **版本统一**：依赖版本集中管理，便于升级
4. **最佳实践**：配置遵循社区推荐的最佳实践
5. **灵活组合**：用户可根据需求自由选择插件组合
