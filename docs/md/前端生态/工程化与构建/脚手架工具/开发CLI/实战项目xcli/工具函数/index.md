# 工具函数详解

> 本节详细介绍 `@jserxiao/xcli` 的核心工具函数，包括日志工具、文件生成器和依赖管理。

## 学习要点

- 🎨 掌握终端美化输出
- 📁 理解文件生成器的设计
- 📦 掌握依赖安装流程
- 🔧 理解 package.json 生成逻辑

---

## 1. 日志工具 (logger.ts)

### 1.1 功能概览

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  日志工具功能                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  showBanner()                                                                         │
│  ├── 显示 ASCII 艺术 Logo                                                            │
│  ├── 使用 gradient-string 渐变色                                                     │
│  └── 项目启动时调用                                                                   │
│                                                                                       │
│  showMiniBanner()                                                                     │
│  ├── 显示简洁版 Logo                                                                 │
│  └── 用于 --help 等场景                                                              │
│                                                                                       │
│  showSuccessMessage(projectName)                                                      │
│  ├── 显示项目创建成功提示                                                            │
│  ├── 包含快速开始指南                                                                │
│  └── 显示可用命令                                                                    │
│                                                                                       │
│  logger 对象                                                                          │
│  ├── info(message)     - 蓝色 ℹ 信息                                                │
│  ├── success(message)  - 绿色 ✓ 成功                                                │
│  ├── warning(message)  - 黄色 ⚠ 警告                                                │
│  ├── error(message)    - 红色 ✗ 错误                                                │
│  ├── title(message)    - 青色加粗标题                                               │
│  ├── newline()         - 打印空行                                                   │
│  └── step(step, total, message) - 显示步骤进度                                      │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 源码实现

```typescript
// src/utils/logger.ts

import chalk from 'chalk';
import gradient from 'gradient-string';

/**
 * CLI Banner - 显示 XCLI Logo
 * 使用渐变色让 Logo 更美观
 */
export function showBanner(): void {
  // 定义渐变色（青色 → 紫色 → 粉色）
  const xcliGradient = gradient(['#00d4ff', '#7c3aed', '#f472b6']);
  
  // ASCII 艺术 Logo
  const banner = `
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   ██╗  ██╗██╗ ███████╗ ██████╗  ██████╗ ███████╗         ║
  ║   ╚██╗██╔╝██║ ██╔════╝██╔═══██╗██╔═══██╗██╔════╝         ║
  ║    ╚███╔╝ ██║ █████╗  ██║   ██║██║   ██║███████╗         ║
  ║    ██╔██╗ ██║ ██╔══╝  ██║   ██║██║   ██║╚════██║         ║
  ║   ██╔╝ ██╗██║██║     ╚██████╔╝╚██████╔╝███████║         ║
  ║   ╚═╝  ╚═╝╚═╝╚═╝      ╚═════╝  ╚═════╝ ╚══════╝         ║
  ║                                                           ║
  ║       🔧 可插拔的 TypeScript 项目脚手架工具               ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
`;
  
  // 应用渐变色并打印
  console.log(xcliGradient(banner));
  console.log();
}

/**
 * 成功完成提示
 * 显示一个漂亮的边框盒子
 */
export function showSuccessMessage(projectName: string): void {
  console.log();
  const boxWidth = 60;
  const lines = [
    `项目 ${projectName} 创建成功!`,
    '',
    '快速开始:',
    `  cd ${projectName}`,
    '  pnpm run dev',
    '',
    '可用脚本:',
    '  pnpm run dev      启动开发服务器',
    '  pnpm run build    构建生产版本',
    '  pnpm run preview  预览生产构建',
  ];
  
  // 打印上边框
  console.log(chalk.green('┌' + '─'.repeat(boxWidth - 2) + '┐'));
  
  // 打印内容行
  for (const line of lines) {
    const padding = boxWidth - 4 - getDisplayWidth(line);
    const rightPadding = padding > 0 ? ' '.repeat(padding) : '';
    console.log(chalk.green('│') + ' ' + line + rightPadding + ' ' + chalk.green('│'));
  }
  
  // 打印下边框
  console.log(chalk.green('└' + '─'.repeat(boxWidth - 2) + '┘'));
  console.log();
}

/**
 * 计算字符串显示宽度
 * 中文字符算 2 个宽度，用于正确对齐
 */
function getDisplayWidth(str: string): number {
  let width = 0;
  for (const char of str) {
    // 判断是否为中文字符
    if (/[\u4e00-\u9fa5]/.test(char)) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

/**
 * 日志工具对象
 */
export const logger = {
  /** 信息日志（蓝色 ℹ） */
  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message);
  },

  /** 成功日志（绿色 ✓） */
  success: (message: string) => {
    console.log(chalk.green('✓'), message);
  },

  /** 警告日志（黄色 ⚠） */
  warning: (message: string) => {
    console.log(chalk.yellow('⚠'), message);
  },

  /** 错误日志（红色 ✗） */
  error: (message: string) => {
    console.log(chalk.red('✗'), message);
  },

  /** 标题（青色加粗） */
  title: (message: string) => {
    console.log();
    console.log(chalk.bold.cyan(message));
    console.log();
  },

  /** 空行 */
  newline: () => {
    console.log();
  },

  /** 步骤进度 */
  step: (step: number, total: number, message: string) => {
    const prefix = chalk.gray(`[${step}/${total}]`);
    console.log(prefix, message);
  },
};
```

---

## 2. 文件生成器 (fileGenerator.ts)

### 2.1 FileGenerator 类

```typescript
// src/utils/fileGenerator.ts

import fs from 'fs-extra';
import path from 'path';
import type { Plugin, PluginContext, PluginFile } from '../types/index';

/**
 * 文件生成器类
 * 负责根据插件定义生成配置文件
 */
export class FileGenerator {
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  /**
   * 生成单个文件
   * 
   * 流程：
   * 1. 解析动态路径
   * 2. 确保目录存在
   * 3. 解析动态内容
   * 4. 写入文件
   */
  async generateFile(file: PluginFile): Promise<void> {
    // 1. 处理动态路径
    const filePathStr =
      typeof file.path === 'function'
        ? file.path(this.context)
        : file.path;
    const filePath = path.join(this.context.projectPath, filePathStr);
    const dir = path.dirname(filePath);

    // 2. 确保目录存在
    await fs.ensureDir(dir);

    // 3. 生成文件内容
    const content =
      typeof file.content === 'function'
        ? file.content(this.context)
        : file.content;

    // 4. 写入文件
    await fs.writeFile(filePath, content, 'utf-8');
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

### 2.2 使用示例

```typescript
// 在 init 命令中使用

const context: PluginContext = {
  projectName: 'my-project',
  projectPath: '/path/to/my-project',
  projectType: 'react',
  // ...
};

// 创建文件生成器
const generator = new FileGenerator(context);

// 方式1：生成单个文件
await generator.generateFile({
  path: 'src/config.ts',
  content: `export const APP_NAME = '${context.projectName}';`,
});

// 方式2：批量生成文件
await generator.generateFiles([
  { path: '.eslintrc.js', content: '...' },
  { path: '.prettierrc', content: '...' },
]);

// 方式3：从插件列表生成
await generator.generateFromPlugins(selectedPlugins);
```

### 2.3 createBaseFiles 函数

```typescript
/**
 * 创建基础文件（.gitignore 和 README.md）
 * 根据项目类型生成不同的内容
 */
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
): Promise<void> {
  const isLibrary = projectType === 'library';

  // 1. 创建 .gitignore
  if (isLibrary) {
    // Library 项目使用简化版
    await fs.writeFile(
      path.join(projectPath, '.gitignore'),
      `# Dependencies
node_modules/

# Build output
dist/

# IDE
.idea/
.vscode/

# Logs
*.log

# Coverage
coverage/

# Environment
.env
.env.local
`,
      'utf-8'
    );
  } else {
    // React/Vue 项目使用完整版
    await fs.writeFile(
      path.join(projectPath, '.gitignore'),
      getGitignoreContent(),
      'utf-8'
    );
  }

  // 2. 创建 README.md
  let readmeContent = `# ${projectName}\n\n`;

  if (projectType === 'react') {
    readmeContent += generateReactReadme(projectName, context);
  } else if (projectType === 'vue') {
    readmeContent += generateVueReadme(projectName, context);
  } else {
    readmeContent += generateLibraryReadme(projectName);
  }

  readmeContent += `\n## License\n\nMIT`;

  await fs.writeFile(
    path.join(projectPath, 'README.md'), 
    readmeContent, 
    'utf-8'
  );
}
```

---

## 3. 依赖管理 (dependency.ts)

### 3.1 安装依赖

```typescript
// src/utils/dependency.ts

import { execa } from 'execa';
import ora from 'ora';
import type { Plugin } from '../types';

/**
 * 安装项目依赖
 * 使用 execa 调用包管理器
 */
export async function installDependencies(
  projectPath: string, 
  packageManager: 'npm' | 'yarn' | 'pnpm' = 'pnpm'
): Promise<void> {
  const spinner = ora('安装依赖...').start();

  try {
    // 构建安装命令
    const command = packageManager;
    const args = ['install'];

    // 执行安装
    await execa(command, args, {
      cwd: projectPath,
      timeout: 300000, // 5 分钟超时
      stdio: 'pipe',   // 不显示输出
    });

    spinner.succeed('依赖安装完成');
  } catch (error) {
    spinner.fail('依赖安装失败');
    throw error;
  }
}

/**
 * 初始化 Git 仓库
 */
export async function initGitRepo(projectPath: string): Promise<void> {
  const spinner = ora('初始化 Git 仓库...').start();

  try {
    // 初始化仓库
    await execa('git', ['init'], { cwd: projectPath });

    // 添加所有文件
    await execa('git', ['add', '.'], { cwd: projectPath });

    spinner.succeed('Git 仓库初始化完成');
  } catch (error) {
    spinner.fail('Git 仓库初始化失败');
    throw error;
  }
}
```

### 3.2 生成 package.json

```typescript
/**
 * 生成 package.json
 * 合并模板依赖和插件依赖
 */
export async function generatePackageJson(
  projectPath: string,
  config: ProjectConfig,
  plugins: Plugin[],
  templateDeps: { dependencies: Record<string, string>; devDependencies: Record<string, string> },
  templateScripts: Record<string, string>,
  context: PluginContext
): Promise<void> {
  // 1. 合并依赖
  const dependencies: Record<string, string> = { ...templateDeps.dependencies };
  const devDependencies: Record<string, string> = { ...templateDeps.devDependencies };

  // 2. 添加插件依赖
  for (const plugin of plugins) {
    // 运行时依赖
    if (plugin.dependencies) {
      const deps = typeof plugin.dependencies === 'function'
        ? plugin.dependencies(context)
        : plugin.dependencies;
      Object.assign(dependencies, deps);
    }

    // 开发依赖
    if (plugin.devDependencies) {
      const deps = typeof plugin.devDependencies === 'function'
        ? plugin.devDependencies(context)
        : plugin.devDependencies;
      Object.assign(devDependencies, deps);
    }
  }

  // 3. 合并脚本
  const scripts: Record<string, string> = { ...templateScripts };
  for (const plugin of plugins) {
    if (plugin.scripts) {
      const pluginScripts = typeof plugin.scripts === 'function'
        ? plugin.scripts(context)
        : plugin.scripts;
      Object.assign(scripts, pluginScripts);
    }
  }

  // 4. 构建 package.json
  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    private: true,
    description: config.description || '',
    author: config.author || '',
    license: 'MIT',
    type: 'module',
    scripts,
    dependencies,
    devDependencies,
  };

  // 5. 写入文件
  await fs.writeJson(
    path.join(projectPath, 'package.json'),
    packageJson,
    { spaces: 2 }
  );
}
```

---

## 4. 工具函数导出

```typescript
// src/utils/index.ts

// 日志工具
export { 
  showBanner, 
  showMiniBanner, 
  showSuccessMessage, 
  logger 
} from './logger';

// 文件生成器
export { 
  FileGenerator, 
  createBaseFiles 
} from './fileGenerator';

// 依赖管理
export { 
  installDependencies, 
  initGitRepo, 
  generatePackageJson 
} from './dependency';
```

---

[返回上级目录](../index.md) | [上一章：模板系统](../模板系统/index.md) | [下一章：类型系统](../类型系统/index.md)
