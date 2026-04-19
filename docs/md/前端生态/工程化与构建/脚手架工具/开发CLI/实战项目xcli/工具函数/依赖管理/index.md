# 依赖管理

依赖管理模块负责生成 `package.json`、安装依赖和初始化 Git 仓库。

## 类型定义

### PackageJson 接口

```typescript
/**
 * package.json 模板
 */
interface PackageJson {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license: string;
  type: string;
  main?: string;
  types?: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  keywords?: string[];
  files?: string[];
  repository?: {
    type: string;
    url: string;
  };
}
```

### TemplateDependencies 接口

```typescript
/**
 * 模板依赖类型
 */
interface TemplateDependencies {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}
```

---

## 解析动态配置

### resolveDependencies - 解析动态依赖

```typescript
/**
 * 解析动态依赖
 */
function resolveDependencies(
  deps: Record<string, string> | ((context: PluginContext) => Record<string, string>) | undefined,
  context: PluginContext
): Record<string, string> {
  if (!deps) return {};
  return typeof deps === 'function' ? deps(context) : deps;
}
```

### resolveScripts - 解析动态脚本

```typescript
/**
 * 解析动态脚本
 */
function resolveScripts(
  scripts: Record<string, string> | ((context: PluginContext) => Record<string, string>) | undefined,
  context: PluginContext
): Record<string, string> {
  if (!scripts) return {};
  return typeof scripts === 'function' ? scripts(context) : scripts;
}
```

---

## generatePackageJson 函数

生成项目的 `package.json` 文件。

### 函数签名

```typescript
export async function generatePackageJson(
  projectPath: string,
  config: ProjectConfig,
  plugins: Plugin[],
  templateDeps?: TemplateDependencies,
  templateScripts?: Record<string, string>,
  context?: PluginContext
): Promise<void>
```

### 实现详解

```typescript
export async function generatePackageJson(
  projectPath: string,
  config: ProjectConfig,
  plugins: Plugin[],
  templateDeps?: TemplateDependencies,
  templateScripts?: Record<string, string>,
  context?: PluginContext
): Promise<void> {
  // 合并所有依赖
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  // 1. 首先添加模板依赖
  if (templateDeps) {
    Object.assign(dependencies, templateDeps.dependencies);
    Object.assign(devDependencies, templateDeps.devDependencies);
  }

  // 2. 收集所有插件的依赖和脚本
  for (const plugin of plugins) {
    // 合并运行时依赖（支持动态）
    const pluginDeps = resolveDependencies(plugin.dependencies, context as PluginContext);
    Object.assign(dependencies, pluginDeps);

    // 合并开发依赖（支持动态）
    const pluginDevDeps = resolveDependencies(plugin.devDependencies, context as PluginContext);
    Object.assign(devDependencies, pluginDevDeps);
  }

  // 3. 合并脚本：优先使用模板脚本，然后是插件脚本
  const scripts: Record<string, string> = {
    ...templateScripts,
  };

  for (const plugin of plugins) {
    const pluginScripts = resolveScripts(plugin.scripts, context as PluginContext);
    Object.assign(scripts, pluginScripts);
  }

  // 4. 确保 prepare 脚本在最后执行（用于 husky）
  if (scripts.prepare) {
    const prepare = scripts.prepare;
    delete scripts.prepare;
    scripts.prepare = prepare;
  }

  // 5. 根据项目类型设置不同的 package.json 结构
  const isLibrary = config.projectType === 'library';

  const packageJson: PackageJson = {
    name: config.projectName,
    version: '1.0.0',
    description: config.description || '',
    author: config.author || '',
    license: 'MIT',
    type: 'module',
    scripts,
    dependencies,
    devDependencies,
    keywords: [],
  };

  // 6. 只有 library 类型才需要 main 和 types
  if (isLibrary) {
    packageJson.main = 'dist/index.js';
    packageJson.types = 'dist/index.d.ts';
    packageJson.files = ['dist'];
  }

  // 7. 写入 package.json
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );
}
```

### 处理流程

```
┌─────────────────────────────────────────────────────────────┐
│                generatePackageJson 流程                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 初始化依赖对象                                          │
│     ├── dependencies = {}                                   │
│     └── devDependencies = {}                                │
│                                                             │
│  2. 添加模板依赖                                            │
│     └── React/Vue 模板的基础依赖                            │
│                                                             │
│  3. 遍历插件，收集依赖                                      │
│     ├── 解析动态依赖 → resolveDependencies()                │
│     ├── 合并到 dependencies                                 │
│     └── 合并�到 devDependencies                             │
│                                                             │
│  4. 合并 npm scripts                                        │
│     ├── 模板脚本                                            │
│     ├── 插件脚本                                            │
│     └── ensure prepare is last                              │
│                                                             │
│  5. 构建 PackageJson 对象                                   │
│     ├── 基础字段                                            │
│     └── Library 特有字段 (main, types, files)               │
│                                                             │
│  6. 写入文件                                                │
│     └── package.json                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## installDependencies 函数

使用指定的包管理器安装依赖。

### 函数实现

```typescript
/**
 * 安装依赖
 */
export async function installDependencies(
  projectPath: string,
  packageManager: 'npm' | 'yarn' | 'pnpm'
): Promise<void> {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install',
  };

  const { execa } = await import('execa');

  await execa(commands[packageManager], {
    cwd: projectPath,
    stdio: 'inherit',
  });
}
```

### 包管理器支持

| 包管理器 | 命令 | 特点 |
|---------|------|------|
| npm | `npm install` | Node.js 默认包管理器 |
| yarn | `yarn install` | 并行安装，速度快 |
| pnpm | `pnpm install` | 磁盘空间高效，推荐使用 |

### stdio: 'inherit' 说明

```typescript
await execa(commands[packageManager], {
  cwd: projectPath,
  stdio: 'inherit',  // 将子进程的输出直接显示在终端
});
```

这样用户可以看到安装进度和详细输出。

---

## initGitRepo 函数

初始化 Git 仓库并创建首次提交。

### 函数实现

```typescript
/**
 * 初始化 Git 仓库
 */
export async function initGitRepo(projectPath: string): Promise<void> {
  const { execa } = await import('execa');

  await execa('git', ['init'], { cwd: projectPath });
  await execa('git', ['add', '.'], { cwd: projectPath });
  await execa('git', ['commit', '-m', 'chore: initial commit'], {
    cwd: projectPath,
  });
}
```

### 执行流程

```bash
# 步骤 1：初始化仓库
git init

# 步骤 2：暂存所有文件
git add .

# 步骤 3：创建首次提交
git commit -m "chore: initial commit"
```

---

## 完整使用示例

### init 命令中的依赖管理

```typescript
// commands/init.ts
import { generatePackageJson, installDependencies, initGitRepo } from '../utils/dependency';

async function init(projectName: string, options: CLIOptions) {
  // ... 收集配置
  
  // 1. 生成 package.json
  await generatePackageJson(
    projectPath,
    config,
    selectedPlugins,
    templateDeps,
    templateScripts,
    context
  );
  
  // 2. 安装依赖（如果用户选择）
  if (config.installDeps) {
    const spinner = ora('安装依赖...').start();
    await installDependencies(projectPath, config.packageManager);
    spinner.succeed('依赖安装完成');
  }
  
  // 3. 初始化 Git（如果用户选择）
  if (config.initGit) {
    await initGitRepo(projectPath);
    logger.success('Git 仓库初始化完成');
  }
}
```

---

## 依赖合并示例

### 模板依赖

```typescript
// React 模板依赖
const reactTemplateDeps = {
  dependencies: {
    'react': '^18.2.0',
    'react-dom': '^18.2.0',
    'react-router-dom': '^6.22.0',
  },
  devDependencies: {
    '@types/react': '^18.2.48',
    '@types/react-dom': '^18.2.18',
  },
};
```

### 插件依赖

```typescript
// Vite 插件
const vitePlugin: Plugin = {
  name: 'vite',
  devDependencies: {
    'vite': '^5.0.12',
    '@vitejs/plugin-react': '^4.2.1',
  },
  scripts: {
    'dev': 'vite',
    'build': 'vite build',
    'preview': 'vite preview',
  },
};

// ESLint 插件（动态依赖）
const eslintPlugin: Plugin = {
  name: 'eslint',
  devDependencies: (context) => {
    const deps: Record<string, string> = {
      'eslint': '^9.18.0',
      'typescript-eslint': '^8.20.0',
    };
    
    if (context.projectType === 'react') {
      deps['eslint-plugin-react-hooks'] = '^7.0.1';
    }
    
    return deps;
  },
  scripts: {
    'lint': 'eslint .',
    'lint:fix': 'eslint . --fix',
  },
};
```

### 最终生成的 package.json

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "prepare": "husky"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "vite": "^5.0.12",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^9.18.0",
    "typescript-eslint": "^8.20.0",
    "eslint-plugin-react-hooks": "^7.0.1",
    "husky": "^9.0.0"
  }
}
```

---

## 最佳实践

### 1. prepare 脚本顺序

```typescript
// 确保 prepare 在最后
if (scripts.prepare) {
  const prepare = scripts.prepare;
  delete scripts.prepare;
  scripts.prepare = prepare;
}
```

这样可以保证 Husky 在其他脚本之后执行。

### 2. 动态导入 execa

```typescript
// 动态导入，避免启动时加载
const { execa } = await import('execa');
```

### 3. 错误处理

```typescript
try {
  await installDependencies(projectPath, packageManager);
} catch (error) {
  logger.warning('依赖安装失败，请手动运行安装命令');
  logger.info(`  cd ${projectName}`);
  logger.info(`  ${packageManager} install`);
}
```

---

## 总结

依赖管理模块提供了：

1. **generatePackageJson**：合并模板和插件依赖，生成配置文件
2. **installDependencies**：支持多种包管理器安装依赖
3. **initGitRepo**：初始化 Git 仓库
4. **动态支持**：依赖和脚本都支持动态生成

这套机制确保了 xcli 能够灵活地管理项目依赖，支持各种项目配置组合。
