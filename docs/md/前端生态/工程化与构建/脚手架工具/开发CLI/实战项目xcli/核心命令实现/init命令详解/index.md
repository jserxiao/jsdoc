# init 命令详解

`init` 命令是 xcli 的核心命令，用于创建新项目。它支持交互式配置和命令行参数两种模式。

## 命令定义

```typescript
// src/index.ts
program
  .command('init [projectName]')
  .alias('i')
  .description('初始化一个新的 TypeScript 项目')
  .option('-t, --template <name>', '项目类型 (library/react/vue)')
  .option('-s, --style <type>', '样式预处理器 (css/less/scss)')
  .option('-m, --state-manager <type>', '状态管理 (none/redux/mobx/pinia)')
  .option('-h, --http-client <type>', 'HTTP 请求库 (axios/fetch/none)')
  .option('-M, --monitoring <type>', '前端监控 SDK (none/xstat)')
  .option('-b, --bundler <type>', '打包工具 (vite/webpack/rollup/none)')
  .option('-p, --package-manager <manager>', '包管理器 (npm/yarn/pnpm)', 'pnpm')
  .option('-si, --skip-install', '跳过依赖安装')
  .option('-sg, --skip-git', '跳过 Git 初始化')
  .option('-d, --default', '使用默认配置')
  .action(async (projectName, options) => {
    await init(projectName, options);
  });
```

---

## 执行流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                        init 命令执行流程                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. 显示 CLI Banner                                                 │
│     └── showBanner()                                                │
│                                                                     │
│  2. 获取项目配置                                                    │
│     ├── 默认模式：使用预设配置                                      │
│     └── 交互模式：逐项询问用户                                      │
│                                                                     │
│  3. 检查/创建项目目录                                               │
│     ├── 目录存在 → 询问是否覆盖                                    │
│     └── 目录不存在 → 创建新目录                                    │
│                                                                     │
│  4. 获取选中的插件                                                  │
│     └── 从 pluginMap 获取插件实例                                   │
│                                                                     │
│  5. 创建项目结构                                                    │
│     └── 调用模板的 createStructure 方法                             │
│                                                                     │
│  6. 生成配置文件                                                    │
│     └── FileGenerator.generateFromPlugins()                         │
│                                                                     │
│  7. 生成 package.json                                               │
│     └── 合并模板和插件的依赖/脚本                                   │
│                                                                     │
│  8. 创建 VSCode 配置                                                │
│     └── settings.json, extensions.json, launch.json                 │
│                                                                     │
│  9. 执行插件 postInstall 钩子                                       │
│     └── 如 Husky 的 Git Hooks 初始化                                │
│                                                                     │
│  10. 安装依赖（可选）                                               │
│      └── npm/yarn/pnpm install                                      │
│                                                                     │
│  11. 初始化 Git（可选）                                             │
│      └── git init && git add . && git commit                        │
│                                                                     │
│  12. 显示成功信息                                                   │
│      └── showSuccessMessage()                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 配置获取

### 默认模式

使用 `--default` 参数时，跳过所有交互，使用预设配置：

```typescript
if (options.default) {
  const projectType = (options.template as ProjectType) || 'library';
  const styleType = (options.style as StyleType) || 'less';
  const defaultPlugins = plugins.filter((p) => p.defaultEnabled).map((p) => p.name);

  return {
    projectName: projectName || options.projectName || path.basename(currentDir),
    projectType,
    styleType,
    stateManager: projectType === 'vue' ? 'pinia' : 'redux',
    httpClient: 'axios',
    monitoring: 'none',
    bundler: (projectType === 'react' || projectType === 'vue') ? 'vite' : 'none',
    useTypeScript: true,
    plugins: defaultPlugins,
    packageManager: options.packageManager || 'pnpm',
    initGit: !options.skipGit,
    installDeps: !options.skipInstall,
    createVscodeConfig: true,
  };
}
```

### 交互模式

逐步询问用户各项配置：

```typescript
// 基础信息
const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: '项目名称:',
    default: path.basename(currentDir),
  },
  {
    type: 'input',
    name: 'description',
    message: '项目描述:',
  },
  {
    type: 'input',
    name: 'author',
    message: '作者:',
  },
  {
    type: 'list',
    name: 'projectType',
    message: '选择项目类型:',
    choices: getTemplateChoices(),
    default: 'library',
  },
];

// 样式预处理器（仅 React/Vue）
if (projectType === 'react' || projectType === 'vue') {
  await inquirer.prompt({
    type: 'list',
    name: 'styleType',
    message: '选择样式预处理器:',
    choices: getStyleChoices(),
    default: 'less',
  });
}

// 状态管理（仅 React/Vue）
if (projectType === 'react' || projectType === 'vue') {
  await inquirer.prompt({
    type: 'list',
    name: 'stateManager',
    message: '选择状态管理:',
    choices: getStateManagerChoices(projectType),
    default: projectType === 'vue' ? 'pinia' : 'redux',
  });
}

// 插件选择（按类别分组）
for (const { name, plugins: categoryPlugins } of pluginChoices) {
  await inquirer.prompt({
    type: 'checkbox',
    name: `plugins_${name}`,
    message: `选择 ${name} 插件:`,
    choices: categoryPlugins,
  });
}
```

---

## 项目结构创建

```typescript
// 创建项目结构
const context: PluginContext = {
  projectName: config.projectName,
  projectPath,
  projectType: config.projectType,
  styleType: config.styleType,
  stateManager: config.stateManager,
  httpClient: config.httpClient,
  monitoring: config.monitoring,
  bundler: config.bundler,
  selectedPlugins: config.plugins,
  useTypeScript: config.useTypeScript,
  packageManager: config.packageManager,
  options: {},
};

await createProjectStructure(projectPath, config.projectType, context);
```

### 模板结构对比

| 项目类型 | 目录结构 |
|---------|---------|
| Library | `src/`, `dist/`, `tests/` |
| React | `src/`, `packages/shared/`, `packages/ui/` |
| Vue | `src/`, `packages/shared/`, `packages/ui/` |

---

## 插件处理

### 获取选中插件

```typescript
let selectedPlugins = config.plugins
  .map((name) => pluginMap.get(name))
  .filter((p): p is NonNullable<typeof p> => p !== undefined);
```

### 动态插件实例化

对于 Stylelint 这类需要根据配置动态生成的插件：

```typescript
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

---

## 配置文件生成

### 插件文件生成

```typescript
const generator = new FileGenerator(context);

// 对于 React/Vue 项目，过滤掉打包工具的配置文件（已在模板中生成）
const bundlerFiles = ['webpack.config.cjs', 'vite.config.ts', 'vite.config.js', 'rollup.config.js'];
const filteredPlugins = selectedPlugins.map((plugin) => {
  if ((config.projectType === 'react' || config.projectType === 'vue') &&
      ['webpack', 'vite', 'rollup'].includes(plugin.name)) {
    return {
      ...plugin,
      files: plugin.files?.filter((f) => {
        const pathStr = typeof f.path === 'function' ? f.path(context) : f.path;
        return !bundlerFiles.includes(pathStr);
      }) || [],
    };
  }
  return plugin;
});

await generator.generateFromPlugins(filteredPlugins);
```

### package.json 生成

```typescript
// 合并模板和插件的依赖
const templateDeps = getProjectDependencies(
  config.projectType,
  config.styleType,
  config.stateManager,
  config.httpClient,
  config.monitoring,
  config.plugins,
  config.useTypeScript
);

const templateScripts = getProjectScripts(
  config.projectType,
  config.plugins,
  config.useTypeScript
);

await generatePackageJson(
  projectPath,
  config,
  selectedPlugins,
  templateDeps,
  templateScripts,
  context
);
```

---

## postInstall 钩子执行

```typescript
// 执行插件安装后回调
for (const plugin of selectedPlugins) {
  if (plugin.postInstall) {
    spinner.start(`执行 ${plugin.displayName} 安装后操作...`);
    try {
      await plugin.postInstall(context);
      spinner.succeed(`${plugin.displayName} 安装后操作完成`);
    } catch (error) {
      spinner.fail(`${plugin.displayName} 安装后操作失败`);
      throw error;
    }
  }
}
```

典型应用：Husky 插件创建 Git Hooks。

---

## 使用示例

### 交互式创建

```bash
# 交互式创建项目
xcli init my-project

# 简写
xcli i my-project
```

### 命令行参数创建

```bash
# 使用默认配置
xcli init my-project --default

# 指定项目类型
xcli init my-react-app --template react

# 完整参数
xcli init my-vue-app \
  --template vue \
  --style scss \
  --state-manager pinia \
  --http-client axios \
  --bundler vite \
  --package-manager pnpm \
  --skip-git
```

### 在当前目录初始化

```bash
# 不指定项目名，在当前目录初始化
cd my-existing-project
xcli init
```

---

## 错误处理

### 目录已存在

```typescript
if (projectName && (await fs.pathExists(projectPath))) {
  const { overwrite } = await inquirer.prompt({
    type: 'confirm',
    name: 'overwrite',
    message: `目录 ${projectName} 已存在，是否覆盖?`,
    default: false,
  });

  if (!overwrite) {
    logger.error('操作已取消');
    process.exit(0);
  }

  await fs.emptyDir(projectPath);
}
```

### Git 初始化失败

```typescript
try {
  await initGitRepo(projectPath);
  spinner.succeed('Git 仓库初始化完成');
} catch (error) {
  spinner.fail('Git 仓库初始化失败');
  // Git 初始化失败不中断流程
  logger.warning('请确保已安装 Git');
}
```

---

## 总结

`init` 命令的核心特点：

1. **灵活的配置方式**：支持交互式和命令行参数两种模式
2. **插件驱动**：项目配置由插件组合生成
3. **智能过滤**：避免重复生成配置文件
4. **渐进式反馈**：每一步都有清晰的进度提示
5. **容错处理**：非关键步骤失败不中断流程
