# 插件扩展指南

本指南将帮助你为 xcli 开发自定义插件，扩展脚手架的功能。

## 插件开发基础

### 最简插件

一个最基本的插件只需要定义必填字段：

```typescript
// my-plugin/index.ts
import type { Plugin } from '@jserxiao/xcli';

export const myPlugin: Plugin = {
  name: 'my-plugin',
  displayName: '我的插件',
  description: '一个自定义插件示例',
  category: 'other',
};
```

### 添加依赖

```typescript
export const myPlugin: Plugin = {
  name: 'my-plugin',
  displayName: '我的插件',
  description: '添加自定义依赖',
  category: 'other',
  
  // 运行时依赖
  dependencies: {
    'lodash': '^4.17.21',
  },
  
  // 开发依赖
  devDependencies: {
    '@types/lodash': '^4.14.202',
  },
};
```

### 添加 npm scripts

```typescript
export const myPlugin: Plugin = {
  name: 'my-plugin',
  // ...
  
  scripts: {
    'analyze': 'webpack-bundle-analyzer',
    'clean': 'rm -rf dist node_modules',
  },
};
```

---

## 文件生成

### 静态文件

生成固定内容的配置文件：

```typescript
export const myPlugin: Plugin = {
  name: 'my-plugin',
  // ...
  
  files: [
    {
      path: '.myconfig.json',
      content: JSON.stringify({
        enableFeature: true,
        logLevel: 'info',
      }, null, 2),
    },
    {
      path: 'src/config.ts',
      content: `// 自动生成的配置文件
export const config = {
  version: '1.0.0',
};
`,
    },
  ],
};
```

### 动态文件

根据上下文生成不同内容：

```typescript
export const myPlugin: Plugin = {
  name: 'my-plugin',
  // ...
  
  files: [
    {
      // 动态路径：根据项目类型选择文件位置
      path: (context) => {
        return context.projectType === 'react' 
          ? 'src/styles/theme.ts'
          : 'src/theme.ts';
      },
      
      // 动态内容：根据上下文生成
      content: (context) => {
        const theme = context.projectType === 'react' 
          ? 'reactTheme'
          : 'defaultTheme';
        
        return `export const theme = '${theme}';\n`;
      },
    },
  ],
};
```

---

## 动态依赖

### 条件依赖

根据项目配置决定安装哪些依赖：

```typescript
export const myPlugin: Plugin = {
  name: 'my-plugin',
  // ...
  
  devDependencies: (context) => {
    const deps: Record<string, string> = {};
    
    // 仅 React 项目安装
    if (context.projectType === 'react') {
      deps['react-query'] = '^5.17.0';
    }
    
    // 仅 Vue 项目安装
    if (context.projectType === 'vue') {
      deps['vue-query'] = '^2.0.0';
    }
    
    // 使用 TypeScript 时安装类型
    if (context.useTypeScript) {
      deps['@types/my-lib'] = '^1.0.0';
    }
    
    return deps;
  },
};
```

### 动态脚本

根据上下文生成不同的 npm scripts：

```typescript
export const myPlugin: Plugin = {
  name: 'my-plugin',
  // ...
  
  scripts: (context) => {
    const scripts: Record<string, string> = {};
    
    // 根据打包工具设置不同的构建命令
    if (context.bundler === 'vite') {
      scripts['build'] = 'vite build';
      scripts['preview'] = 'vite preview';
    } else if (context.bundler === 'webpack') {
      scripts['build'] = 'webpack --mode production';
    }
    
    return scripts;
  },
};
```

---

## 生命周期钩子

### postInstall 钩子

在依赖安装完成后执行自定义逻辑：

```typescript
import fs from 'fs-extra';
import path from 'path';

export const myPlugin: Plugin = {
  name: 'my-plugin',
  // ...
  
  postInstall: async (context) => {
    const { projectPath, projectName } = context;
    
    // 创建自定义目录
    const customDir = path.join(projectPath, 'custom');
    await fs.ensureDir(customDir);
    
    // 生成动态文件
    await fs.writeFile(
      path.join(customDir, 'info.json'),
      JSON.stringify({
        name: projectName,
        createdAt: new Date().toISOString(),
      }, null, 2)
    );
    
    // 执行命令
    const { execa } = await import('execa');
    await execa('git', ['add', '.'], { cwd: projectPath });
  },
};
```

### 常见应用场景

#### 1. 创建目录结构

```typescript
postInstall: async (context) => {
  const dirs = ['src/components', 'src/utils', 'src/hooks'];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(context.projectPath, dir));
  }
}
```

#### 2. 初始化 Git Hooks

```typescript
postInstall: async (context) => {
  const hooksDir = path.join(context.projectPath, '.githooks');
  await fs.ensureDir(hooksDir);
  
  await fs.writeFile(
    path.join(hooksDir, 'pre-push'),
    `#!/bin/sh\nnpm test\n`
  );
}
```

#### 3. 下载远程资源

```typescript
postInstall: async (context) => {
  const response = await fetch('https://api.example.com/config');
  const config = await response.json();
  
  await fs.writeFile(
    path.join(context.projectPath, 'remote-config.json'),
    JSON.stringify(config, null, 2)
  );
}
```

---

## 插件工厂函数

当需要根据参数创建不同的插件实例时，使用工厂函数：

```typescript
/**
 * 创建国际化插件
 */
export function createI18nPlugin(options: {
  language: 'zh-CN' | 'en-US';
  framework: 'react' | 'vue';
}): Plugin {
  return {
    name: 'i18n',
    displayName: '国际化',
    description: `国际化支持 (${options.language})`,
    category: 'tooling',
    
    dependencies: options.framework === 'react'
      ? { 'react-i18next': '^14.0.0' }
      : { 'vue-i18n': '^9.9.0' },
    
    files: [
      {
        path: 'src/locales/index.ts',
        content: generateLocaleFiles(options),
      },
    ],
  };
}

// 使用
const zhPlugin = createI18nPlugin({ language: 'zh-CN', framework: 'react' });
const enPlugin = createI18nPlugin({ language: 'en-US', framework: 'vue' });
```

---

## 插件注册

### 本地注册

在 `src/plugins/index.ts` 中注册：

```typescript
import { myPlugin } from './my-plugin';

export const plugins: Plugin[] = [
  // ... 现有插件
  myPlugin,
];

export { myPlugin };
```

### 外部插件

创建独立的 npm 包：

```typescript
// @scope/xcli-plugin-my-plugin/index.ts
import type { Plugin } from '@jserxiao/xcli';

const plugin: Plugin = {
  name: 'my-plugin',
  // ...
};

export default plugin;
```

用户可以在项目中安装并使用：

```bash
npm install @scope/xcli-plugin-my-plugin
```

---

## 最佳实践

### 1. 命名规范

```typescript
// ✅ 推荐
name: 'tailwind'
name: 'storybook'

// ❌ 避免
name: 'TailwindCSS'  // 不要使用大写
name: 'tailwind-css' // 不要使用连字符
```

### 2. 版本管理

```typescript
// ✅ 推荐：从常量导入
import { TOOL_VERSIONS } from '../../constants';

devDependencies: {
  tailwindcss: TOOL_VERSIONS.tailwindcss,
}

// ❌ 不推荐：硬编码
devDependencies: {
  tailwindcss: '^3.4.0',
}
```

### 3. 错误处理

```typescript
postInstall: async (context) => {
  try {
    // 可能失败的操作
    await riskyOperation();
  } catch (error) {
    // 记录错误但不要中断流程
    console.warn(`插件 my-plugin 警告: ${error.message}`);
  }
}
```

### 4. 类型安全

```typescript
import type { Plugin, PluginContext, PluginFile } from '@jserxiao/xcli';

// 使用类型注解确保正确性
function generateConfig(context: PluginContext): string {
  // TypeScript 会检查 context 的属性
  return `// ${context.projectName}`;
}

export const myPlugin: Plugin = {
  name: 'my-plugin',
  files: [
    {
      path: 'config.ts',
      content: generateConfig,
    },
  ],
};
```

---

## 完整示例

以下是一个完整的自定义插件示例：

```typescript
// plugins/tailwind/index.ts
import type { Plugin, PluginContext } from '../../types';
import fs from 'fs-extra';
import path from 'path';

/**
 * 获取 Tailwind 配置
 */
function getTailwindConfig(context: PluginContext): string {
  const content = context.projectType === 'react'
    ? ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
    : ['./index.html', './src/**/*.{js,ts,vue}'];

  return `/** @type {import('tailwindcss').Config} */
export default {
  content: ${JSON.stringify(content)},
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
}

/**
 * Tailwind CSS 插件
 */
export const tailwindPlugin: Plugin = {
  name: 'tailwind',
  displayName: 'Tailwind CSS',
  description: '添加 Tailwind CSS 支持',
  category: 'tooling',
  defaultEnabled: false,

  devDependencies: {
    'tailwindcss': '^3.4.1',
    'postcss': '^8.4.33',
    'autoprefixer': '^10.4.17',
  },

  scripts: {
    'tailwind:init': 'tailwindcss init -p',
  },

  files: [
    {
      path: 'tailwind.config.js',
      content: (context) => getTailwindConfig(context),
    },
    {
      path: 'postcss.config.js',
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
    },
    {
      path: 'src/styles/tailwind.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
    },
  ],

  postInstall: async (context) => {
    // 在主入口文件中引入 Tailwind CSS
    const mainFile = context.projectType === 'react'
      ? 'src/main.tsx'
      : 'src/main.ts';
    
    const mainPath = path.join(context.projectPath, mainFile);
    
    if (await fs.pathExists(mainPath)) {
      const content = await fs.readFile(mainPath, 'utf-8');
      
      // 检查是否已导入
      if (!content.includes('tailwind.css')) {
        const newContent = `import './styles/tailwind.css';\n${content}`;
        await fs.writeFile(mainPath, newContent);
      }
    }
  },
};
```

---

## 总结

开发 xcli 插件的关键要点：

1. **遵循接口定义**：实现 `Plugin` 接口的所有必填字段
2. **善用动态能力**：根据上下文生成适配的配置
3. **合理使用钩子**：`postInstall` 用于安装后的初始化
4. **版本集中管理**：从 constants 文件导入依赖版本
5. **提供良好的默认值**：`defaultEnabled` 决定是否默认选中

通过这套机制，你可以轻松扩展 xcli 的功能，满足特定项目需求。
