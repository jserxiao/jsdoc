# 核心命令实现

> 本节详细介绍 `@jserxiao/xcli` 的三个核心命令：`init`、`plugin` 和 `upgrade` 的实现原理和源码分析。

## 学习要点

- 🎯 掌握 CLI 命令的设计模式
- 🔄 理解交互式问答的实现机制
- 📁 掌握项目结构创建的流程控制
- 🔌 理解插件与模板的协作关系

---

## 命令概览

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  xcli 命令体系                                                                         │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  xcli init [projectName] [options]                                                    │
│  ├── 别名: xcli i                                                                    │
│  ├── 功能: 创建新项目                                                                │
│  ├── 选项:                                                                           │
│  │   ├── -t, --template <type>    项目类型 (library/react/vue)                       │
│  │   ├── -s, --style <type>       样式预处理器 (css/less/scss)                       │
│  │   ├── -b, --bundler <type>     打包工具 (vite/webpack/rollup/none)               │
│  │   ├── --stateManager <type>    状态管理 (none/redux/mobx/pinia)                  │
│  │   ├── --httpClient <type>      HTTP 请求库 (none/axios/fetch)                    │
│  │   ├── --monitoring <type>      监控 SDK (none/xstat)                              │
│  │   ├── -p, --packageManager <pm> 包管理器 (npm/yarn/pnpm)                          │
│  │   ├── -d, --default            使用默认配置                                       │
│  │   ├── --skipGit                跳过 Git 初始化                                    │
│  │   └── --skipInstall            跳过依赖安装                                       │
│  └── 流程: 交互问答 → 创建结构 → 生成配置 → 安装依赖 → 初始化 Git                    │
│                                                                                       │
│  xcli plugin <action> [plugins...]                                                    │
│  ├── 子命令:                                                                          │
│  │   ├── add [plugins...]    添加插件到当前项目                                      │
│  │   ├── remove [plugins...] 从当前项目移除插件                                      │
│  │   └── list               列出所有可用插件                                         │
│  └── 特点: 运行时动态管理插件，无需重建项目                                           │
│                                                                                       │
│  xcli upgrade [options]                                                               │
│  ├── 功能: 升级 CLI 工具本身                                                         │
│  ├── 选项:                                                                           │
│  │   ├── --check      仅检查更新，不执行升级                                         │
│  │   └── --tag <tag>  指定版本标签 (latest/next/beta)                               │
│  └── 流程: 检查版本 → 比较版本 → 执行升级                                            │
│                                                                                       │
│  xcli --version                                                                       │
│  └── 显示当前版本号                                                                   │
│                                                                                       │
│  xcli --help                                                                          │
│  └── 显示帮助信息                                                                     │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. init 命令详解

### 1.1 执行流程

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  init 命令执行流程                                                                     │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────┐                                                                  │
│  │ 1. 显示 Banner  │  showBanner()                                                   │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 2. 获取配置     │  getProjectConfig()                                             │
│  │    ├── 默认配置 │  --default 参数时使用                                            │
│  │    └── 交互问答 │  Inquirer.js 问答                                                │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 3. 检查目录     │  目录存在则询问覆盖                                              │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 4. 创建结构     │  createProjectStructure()                                       │
│  │    ├── 模板路由 │  根据 projectType 选择模板                                      │
│  │    └── 目录创建 │  创建项目目录结构                                                │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 5. 生成配置     │  FileGenerator.generateFromPlugins()                            │
│  │    ├── 插件文件 │  ESLint/Prettier/Vite 等配置                                    │
│  │    └── 动态内容 │  根据 context 生成不同内容                                       │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 6. 生成 package │  generatePackageJson()                                          │
│  │    ├── 模板依赖 │  框架、状态管理、HTTP 等依赖                                    │
│  │    └── 插件依赖 │  合并插件的 dependencies                                        │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 7. VSCode 配置  │  createVscodeConfig()                                           │
│  │    ├── settings │  编辑器设置                                                     │
│  │   ├── extensions│  推荐扩展                                                      │
│  │    └── launch   │  调试配置                                                       │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 8. 插件回调     │  plugin.postInstall()                                           │
│  │    └── Husky    │  创建 .husky/pre-commit                                         │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 9. 安装依赖     │  installDependencies()                                          │
│  │    └── pnpm i   │  执行包管理器安装命令                                           │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 10. 初始化 Git  │  initGitRepo()                                                  │
│  │    ├── git init │  初始化仓库                                                     │
│  │    └── git add  │  添加所有文件                                                   │
│  └────────┬────────┘                                                                  │
│           ▼                                                                           │
│  ┌─────────────────┐                                                                  │
│  │ 11. 显示成功    │  showSuccessMessage()                                           │
│  └─────────────────┘                                                                  │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 配置获取详解

```typescript
// src/commands/init.ts

/**
 * 获取项目配置
 * 支持两种模式：
 * 1. 默认模式 (--default): 使用预设的默认值
 * 2. 交互模式: 通过 Inquirer.js 问答收集
 */
async function getProjectConfig(
  options: CLIOptions,
  currentDir: string,
  projectName?: string
): Promise<ProjectConfig> {
  // ========== 默认模式 ==========
  if (options.default) {
    // 1. 确定项目类型
    const projectType = (options.template as ProjectType) || 'library';
    
    // 2. 获取默认启用的插件
    const defaultPlugins = plugins
      .filter((p) => p.defaultEnabled)
      .map((p) => p.name);

    // 3. React/Vue 项目处理打包工具
    if (projectType === 'react' || projectType === 'vue') {
      const bundler = options.bundler || 'vite';
      // 移除其他打包工具插件
      const bundlerPlugins = ['vite', 'webpack', 'rollup'];
      for (const bp of bundlerPlugins) {
        const index = defaultPlugins.indexOf(bp);
        if (index > -1) {
          defaultPlugins.splice(index, 1);
        }
      }
      // 添加指定的打包工具插件
      if (bundler !== 'none' && !defaultPlugins.includes(bundler)) {
        defaultPlugins.push(bundler);
      }
    }

    // 4. 状态管理默认值
    const stateManager = options.stateManager || 
      (projectType === 'vue' ? 'pinia' : 'redux');

    return {
      projectName: projectName || options.projectName || path.basename(currentDir),
      projectType,
      styleType: options.style || 'less',
      stateManager,
      httpClient: options.httpClient || 'axios',
      monitoring: options.monitoring || 'none',
      bundler: (projectType === 'react' || projectType === 'vue') 
        ? (options.bundler || 'vite') 
        : 'none',
      useTypeScript: true,
      plugins: defaultPlugins,
      packageManager: options.packageManager || 'pnpm',
      initGit: !options.skipGit,
      installDeps: !options.skipInstall,
      createVscodeConfig: true,
    };
  }

  // ========== 交互模式 ==========
  
  // 第一阶段：基础信息
  const questions: DistinctQuestion[] = [
    {
      type: 'input',
      name: 'projectName',
      message: '项目名称:',
      default: options.projectName || path.basename(currentDir),
      when: !options.projectName,
    },
    {
      type: 'input',
      name: 'description',
      message: '项目描述:',
      default: '',
    },
    {
      type: 'input',
      name: 'author',
      message: '作者:',
      default: '',
    },
    {
      type: 'list',
      name: 'projectType',
      message: '选择项目类型:',
      choices: getTemplateChoices(), // ['Library', 'React', 'Vue']
      default: 'library',
    },
  ];

  const basicAnswers = await inquirer.prompt(questions);
  const projectType = basicAnswers.projectType as ProjectType;

  // 第二阶段：React/Vue 项目特定配置
  if (projectType === 'react' || projectType === 'vue') {
    // 样式预处理器
    const styleAnswer = await inquirer.prompt({
      type: 'list',
      name: 'styleType',
      message: '选择样式预处理器:',
      choices: getStyleChoices(),
      default: 'less',
    });

    // 状态管理
    const stateAnswer = await inquirer.prompt({
      type: 'list',
      name: 'stateManager',
      message: '选择状态管理:',
      choices: getStateManagerChoices(projectType),
      default: projectType === 'vue' ? 'pinia' : 'redux',
    });

    // HTTP 请求库
    const httpAnswer = await inquirer.prompt({
      type: 'list',
      name: 'httpClient',
      message: '选择 HTTP 请求库:',
      choices: getHttpClientChoices(),
      default: 'axios',
    });

    // 监控 SDK
    const monitoringAnswer = await inquirer.prompt({
      type: 'list',
      name: 'monitoring',
      message: '是否集成前端监控 SDK?',
      choices: getMonitoringChoices(projectType),
      default: 'none',
    });

    // 打包工具
    const bundlerAnswer = await inquirer.prompt({
      type: 'list',
      name: 'bundler',
      message: '选择打包工具:',
      choices: [
        { name: 'Vite (推荐)', value: 'vite' },
        { name: 'Webpack', value: 'webpack' },
        { name: 'Rollup', value: 'rollup' },
        { name: '无打包工具', value: 'none' },
      ],
      default: 'vite',
    });
  }

  // 第三阶段：TypeScript 和包管理器
  const tsAnswer = await inquirer.prompt({
    type: 'confirm',
    name: 'useTypeScript',
    message: '使用 TypeScript?',
    default: true,
  });

  const packageManagerAnswer = await inquirer.prompt({
    type: 'list',
    name: 'packageManager',
    message: '选择包管理器:',
    choices: [
      { name: 'pnpm', value: 'pnpm' },
      { name: 'npm', value: 'npm' },
      { name: 'yarn', value: 'yarn' },
    ],
    default: 'pnpm',
  });

  // 第四阶段：插件选择（按类别分组）
  const pluginChoices = getPluginChoices();
  const pluginQuestions: DistinctQuestion[] = [];

  for (const { name, plugins: categoryPlugins } of pluginChoices) {
    // 获取默认选中的插件
    const defaultSelected = categoryPlugins
      .filter(p => p.checked)
      .map(p => p.value);
    
    pluginQuestions.push({
      type: 'checkbox',
      name: `plugins_${name}`,
      message: `选择 ${name} 插件:`,
      choices: categoryPlugins,
      default: defaultSelected,
      loop: false,
    });
  }

  const pluginAnswers = await inquirer.prompt(pluginQuestions);

  // 第五阶段：其他配置
  const otherQuestions = [
    {
      type: 'confirm',
      name: 'initGit',
      message: '初始化 Git 仓库?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: '立即安装依赖?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'createVscodeConfig',
      message: '创建 VSCode 配置?',
      default: true,
    },
  ];

  // 返回完整配置
  return { /* ... */ };
}
```

### 1.3 交互流程详解

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  交互问答流程示例                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  $ xcli init                                                          │
│                                                                                       │
│  ⚡ xcli - 可插拔的 TypeScript 项目脚手架                                              │
│  ─────────────────────────────────────────────────────────────────────                │
│                                                                                       │
│  ? 项目名称: my-project                                                               │
│  ? 项目描述: A modern React project                                                   │
│  ? 作者: developer                                                                    │
│  ? 选择项目类型: (Use arrow keys)                                                     │
│  ❯ Library                                                                           │
│    React                                                                             │
│    Vue                                                                               │
│                                                                                       │
│  // 选择 React 后继续...                                                              │
│                                                                                       │
│  ? 选择样式预处理器: (Use arrow keys)                                                 │
│    CSS                                                                               │
│  ❯ Less                                                                              │
│    SCSS                                                                              │
│                                                                                       │
│  ? 选择状态管理: (Use arrow keys)                                                     │
│    无                                                                                │
│  ❯ Redux Toolkit                                                                     │
│    MobX                                                                              │
│                                                                                       │
│  ? 选择 HTTP 请求库: (Use arrow keys)                                                 │
│    无                                                                                │
│  ❯ Axios                                                                             │
│    Fetch                                                                             │
│                                                                                       │
│  ? 是否集成前端监控 SDK? (Use arrow keys)                                             │
│  ❯ 无                                                                                │
│    xstat                                                                             │
│                                                                                       │
│  ? 选择打包工具: (Use arrow keys)                                                     │
│  ❯ Vite (推荐)                                                                       │
│    Webpack                                                                           │
│    Rollup                                                                            │
│    无打包工具                                                                        │
│                                                                                       │
│  ? 使用 TypeScript? (Y/n)                                                            │
│                                                                                       │
│  ? 选择包管理器: (Use arrow keys)                                                     │
│  ❯ pnpm                                                                              │
│    npm                                                                               │
│    yarn                                                                              │
│                                                                                       │
│  ? 选择 代码检查 插件: (Press <space> to select, <a> to toggle all, <i> to invert)   │
│  ❯◉ ESLint - ESLint 9 (Flat Config) 代码检查                                          │
│   ◉ Stylelint - CSS/Less/SCSS 样式检查                                               │
│                                                                                       │
│  ? 选择 代码格式化 插件:                                                              │
│  ❯◉ Prettier - 代码格式化工具                                                        │
│                                                                                       │
│  ? 选择 测试框架 插件:                                                               │
│   ◉ Jest - JavaScript 测试框架                                                       │
│   ◉ Vitest - 下一代测试框架                                                          │
│                                                                                       │
│  ? 选择 Git 工具 插件:                                                                │
│  ❯◉ Husky - Git Hooks 工具                                                           │
│   ◉ Commitlint - Git 提交信息规范检查                                                │
│                                                                                       │
│  ? 初始化 Git 仓库? (Y/n)                                                            │
│  ? 立即安装依赖? (Y/n)                                                               │
│  ? 创建 VSCode 配置? (Y/n)                                                           │
│                                                                                       │
│  ✔ 创建项目结构...                                                                   │
│  ✔ 配置文件生成完成                                                                  │
│  ✔ package.json 生成完成                                                             │
│  ✔ VSCode 配置创建完成                                                               │
│  ✔ ESLint 安装后操作完成                                                             │
│  ✔ 依赖安装完成                                                                      │
│  ✔ Git 仓库初始化完成                                                                │
│                                                                                       │
│  🎉 项目创建成功!                                                                     │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. plugin 命令详解

### 2.1 子命令概览

| 子命令 | 功能 | 示例 |
|--------|------|------|
| `add` | 添加插件到当前项目 | `xcli plugin add eslint prettier` |
| `remove` | 从当前项目移除插件 | `xcli plugin remove stylelint` |
| `list` | 列出所有可用插件 | `xcli plugin list` |

### 2.2 add 子命令实现

```typescript
// src/commands/plugin.ts

/**
 * 添加插件到当前项目
 * 
 * 实现要点：
 * 1. 检查是否在项目根目录
 * 2. 获取或让用户选择插件
 * 3. 动态修改 package.json
 * 4. 生成配置文件
 * 5. 执行安装后回调
 */
export async function addPlugin(pluginNames: string[]): Promise<void> {
  const currentDir = process.cwd();
  const packageJsonPath = path.join(currentDir, 'package.json');

  // 1. 检查项目目录
  if (!(await fs.pathExists(packageJsonPath))) {
    logger.error('请在项目根目录下执行此命令');
    process.exit(1);
  }

  // 2. 如果没有指定插件名，让用户选择
  let selectedPlugins: string[] = pluginNames;
  if (pluginNames.length === 0) {
    const { plugins: chosen } = await inquirer.prompt({
      type: 'checkbox',
      name: 'plugins',
      message: '选择要添加的插件:',
      choices: plugins.map((p) => ({
        name: `${p.displayName} - ${p.description}`,
        value: p.name,
      })),
    });
    selectedPlugins = chosen;
  }

  // 3. 获取插件实例
  let pluginsToAdd = selectedPlugins
    .map((name) => pluginMap.get(name))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // 4. 检测项目样式类型（用于 stylelint 动态依赖）
  let detectedStyleType: 'css' | 'less' | 'scss' = 'css';
  if (packageJson.devDependencies?.less) {
    detectedStyleType = 'less';
  } else if (packageJson.devDependencies?.sass) {
    detectedStyleType = 'scss';
  }

  // 5. Stylelint 插件动态实例化
  if (pluginsToAdd.some(p => p.name === 'stylelint')) {
    const { createStylelintPlugin } = await import('../plugins/stylelint/index.js');
    const stylelintPluginInstance = createStylelintPlugin(detectedStyleType);
    pluginsToAdd = pluginsToAdd.map(p => 
      p.name === 'stylelint' ? stylelintPluginInstance : p
    );
  }

  // 6. 构建上下文
  const context: PluginContext = {
    projectName: packageJson.name,
    projectPath: currentDir,
    projectType: 'library',
    styleType: detectedStyleType,
    // ... 其他字段
  };

  // 7. 安装每个插件
  for (const plugin of pluginsToAdd) {
    spinner.start(`安装 ${plugin.displayName}...`);

    try {
      // 添加依赖到 package.json
      if (plugin.dependencies) {
        Object.assign(packageJson.dependencies || {}, 
          typeof plugin.dependencies === 'function' 
            ? plugin.dependencies(context) 
            : plugin.dependencies
        );
      }
      if (plugin.devDependencies) {
        Object.assign(packageJson.devDependencies || {}, 
          typeof plugin.devDependencies === 'function' 
            ? plugin.devDependencies(context) 
            : plugin.devDependencies
        );
      }

      // 添加 npm scripts
      if (plugin.scripts) {
        Object.assign(packageJson.scripts || {}, 
          typeof plugin.scripts === 'function' 
            ? plugin.scripts(context) 
            : plugin.scripts
        );
      }

      // 生成配置文件
      if (plugin.files) {
        const generator = new FileGenerator(context);
        await generator.generateFiles(plugin.files);
      }

      // 执行安装后回调
      if (plugin.postInstall) {
        await plugin.postInstall(context);
      }

      spinner.succeed(`${plugin.displayName} 安装完成`);
    } catch (error) {
      spinner.fail(`${plugin.displayName} 安装失败`);
      throw error;
    }
  }

  // 8. 更新 package.json
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  logger.success('插件安装完成!');
  logger.info('请运行 npm install 安装新依赖');
}
```

### 2.3 remove 子命令实现

```typescript
/**
 * 从当前项目移除插件
 * 
 * 实现要点：
 * 1. 从 package.json 移除依赖
 * 2. 移除 npm scripts
 * 3. 删除配置文件
 */
export async function removePlugin(pluginNames: string[]): Promise<void> {
  // ... 省略检查逻辑

  for (const plugin of pluginsToRemove) {
    spinner.start(`移除 ${plugin.displayName}...`);

    try {
      // 1. 移除依赖
      if (plugin.dependencies) {
        for (const dep of Object.keys(
          typeof plugin.dependencies === 'function' 
            ? plugin.dependencies({} as PluginContext) 
            : plugin.dependencies
        )) {
          delete packageJson.dependencies?.[dep];
        }
      }
      if (plugin.devDependencies) {
        for (const dep of Object.keys(
          typeof plugin.devDependencies === 'function' 
            ? plugin.devDependencies({} as PluginContext) 
            : plugin.devDependencies
        )) {
          delete packageJson.devDependencies?.[dep];
        }
      }

      // 2. 移除脚本
      if (plugin.scripts) {
        for (const script of Object.keys(
          typeof plugin.scripts === 'function' 
            ? plugin.scripts({} as PluginContext) 
            : plugin.scripts
        )) {
          delete packageJson.scripts?.[script];
        }
      }

      // 3. 删除配置文件
      if (plugin.files) {
        for (const file of plugin.files) {
          const pathStr = typeof file.path === 'function'
            ? file.path({} as PluginContext)
            : file.path;
          const filePath = path.join(currentDir, pathStr);
          await fs.remove(filePath);
        }
      }

      spinner.succeed(`${plugin.displayName} 移除完成`);
    } catch (error) {
      spinner.fail(`${plugin.displayName} 移除失败`);
      throw error;
    }
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}
```

### 2.4 list 子命令实现

```typescript
/**
 * 列出所有可用插件（按类别分组）
 */
export async function listPlugins(): Promise<void> {
  logger.title('可用插件列表');

  // 按类别分组
  const categories: Record<string, typeof plugins> = {};
  for (const plugin of plugins) {
    if (!categories[plugin.category]) {
      categories[plugin.category] = [];
    }
    categories[plugin.category].push(plugin);
  }

  // 类别名称映射
  const categoryNames: Record<string, string> = {
    linter: '代码检查',
    formatter: '代码格式化',
    test: '测试框架',
    git: 'Git 工具',
    bundler: '构建打包',
    other: '其他',
  };

  // 打印
  for (const [category, categoryPlugins] of Object.entries(categories)) {
    console.log(`\n${categoryNames[category] || category}:`);
    for (const plugin of categoryPlugins) {
      const defaultTag = plugin.defaultEnabled ? ' (默认)' : '';
      console.log(`  - ${plugin.displayName}${defaultTag}: ${plugin.description}`);
    }
  }
}
```

---

## 3. upgrade 命令详解

### 3.1 执行流程

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  upgrade 命令执行流程                                                                  │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ xcli upgrade --check                                                            │ │
│  │ ├── 仅检查更新，不执行升级                                                      │ │
│  │ └── 显示当前版本和最新版本                                                      │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ xcli upgrade                                                                    │ │
│  │                                                                                 │ │
│  │ 1. 检查更新                                                                     │ │
│  │    └── npm view @jserxiao/xcli version                                         │ │
│  │                                                                                 │ │
│  │ 2. 比较版本                                                                     │ │
│  │    ├── compareVersions(current, latest)                                        │ │
│  │    └── 当前 < 最新 → 有更新                                                    │ │
│  │                                                                                 │ │
│  │ 3. 显示版本信息                                                                 │ │
│  │    ├── 当前版本: v1.0.20                                                       │ │
│  │    ├── 最新版本: v1.0.21                                                       │ │
│  │    └── 发现新版本!                                                             │ │
│  │                                                                                 │ │
│  │ 4. 执行升级                                                                     │ │
│  │    └── npm install -g @jserxiao/xcli@latest                                    │ │
│  │                                                                                 │ │
│  │ 5. 显示更新日志链接                                                             │ │
│  │    └── https://github.com/jserxiao/xcli/releases                               │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ xcli upgrade --tag beta                                                         │ │
│  │                                                                                 │ │
│  │ 1. 获取 dist-tags                                                               │ │
│  │    └── npm view @jserxiao/xcli dist-tags --json                                │ │
│  │        { "latest": "1.0.21", "beta": "1.1.0-beta.1" }                          │ │
│  │                                                                                 │ │
│  │ 2. 安装指定标签版本                                                             │ │
│  │    └── npm install -g @jserxiao/xcli@1.1.0-beta.1                              │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 核心实现

```typescript
// src/commands/upgrade.ts

import { execa } from 'execa';
import packageJson from '../../package.json' assert { type: 'json' };

// 版本信息
const CURRENT_VERSION = packageJson.version;
const PACKAGE_NAME = packageJson.name;

/**
 * 获取 npm 上最新版本
 */
async function getLatestVersion(packageName: string): Promise<string> {
  try {
    const { stdout } = await execa('npm', ['view', packageName, 'version'], {
      timeout: 30000,
    });
    return stdout.trim();
  } catch (error) {
    throw new Error(`无法获取最新版本: ${(error as Error).message}`);
  }
}

/**
 * 比较版本号
 * @returns 1: v1 > v2, -1: v1 < v2, 0: v1 == v2
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

/**
 * 检查版本更新
 */
async function checkForUpdate(): Promise<{ 
  hasUpdate: boolean; 
  current: string; 
  latest: string 
}> {
  const spinner = ora('正在检查更新...').start();
  
  try {
    const latest = await getLatestVersion(PACKAGE_NAME);
    spinner.stop();
    
    return {
      hasUpdate: compareVersions(CURRENT_VERSION, latest) < 0,
      current: CURRENT_VERSION,
      latest,
    };
  } catch (error) {
    spinner.fail('检查更新失败');
    throw error;
  }
}

/**
 * 执行升级
 */
async function upgradePackage(packageName: string, version?: string): Promise<void> {
  const packageSpec = version 
    ? `${packageName}@${version}` 
    : `${packageName}@latest`;
  
  const spinner = ora(`正在升级 ${packageSpec}...`).start();
  
  try {
    await execa('npm', ['install', '-g', packageSpec], {
      timeout: 120000,
    });
    spinner.succeed(`升级成功: ${packageSpec}`);
  } catch (error) {
    spinner.fail(`升级失败: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * upgrade 命令主函数
 */
export async function upgrade(options: { check?: boolean; tag?: string }): Promise<void> {
  try {
    // 仅检查更新
    if (options.check) {
      const { current, latest, hasUpdate } = await checkForUpdate();
      displayVersionInfo(current, latest, hasUpdate);
      
      if (hasUpdate) {
        console.log(chalk.gray('运行 `xcli upgrade` 来升级到最新版本'));
      }
      return;
    }

    // 指定标签升级
    if (options.tag) {
      const tags = await getDistTags(PACKAGE_NAME);
      const targetVersion = tags[options.tag];
      
      if (!targetVersion) {
        logger.error(`未找到标签 "${options.tag}"`);
        logger.info(`可用标签: ${Object.keys(tags).join(', ')}`);
        return;
      }
      
      await upgradePackage(PACKAGE_NAME, targetVersion);
      return;
    }

    // 正常升级流程
    const { current, latest, hasUpdate } = await checkForUpdate();
    displayVersionInfo(current, latest, hasUpdate);

    if (!hasUpdate) {
      return;
    }

    // 执行升级
    console.log(chalk.cyan('开始升级...'));
    await upgradePackage(PACKAGE_NAME);
    
    // 显示更新日志链接
    console.log();
    console.log(chalk.gray('查看更新日志:'));
    console.log(chalk.blue('  https://github.com/jserxiao/xcli/releases'));
    
  } catch (error) {
    logger.error(`升级失败: ${(error as Error).message}`);
    process.exit(1);
  }
}
```

---

## 4. 命令注册

### 4.1 入口文件

```typescript
// src/index.ts

#!/usr/bin/env node
import { Command } from 'commander';
import { init } from './commands/init';
import { addPlugin, removePlugin, listPlugins } from './commands/plugin';
import { upgrade, showVersion, CURRENT_VERSION } from './commands/upgrade';

const program = new Command();

program
  .name('xcli')
  .description('一个可插拔的 TypeScript 项目脚手架 CLI 工具')
  .version(CURRENT_VERSION);

// init 命令
program
  .command('init [projectName]')
  .alias('i')
  .description('初始化一个新的 TypeScript 项目')
  .option('-t, --template <type>', '项目类型 (library/react/vue)')
  .option('-s, --style <type>', '样式预处理器 (css/less/scss)')
  .option('-b, --bundler <type>', '打包工具 (vite/webpack/rollup/none)')
  .option('--stateManager <type>', '状态管理 (none/redux/mobx/pinia)')
  .option('--httpClient <type>', 'HTTP 请求库 (none/axios/fetch)')
  .option('--monitoring <type>', '监控 SDK (none/xstat)')
  .option('-p, --packageManager <pm>', '包管理器 (npm/yarn/pnpm)')
  .option('-d, --default', '使用默认配置')
  .option('--skipGit', '跳过 Git 初始化')
  .option('--skipInstall', '跳过依赖安装')
  .action(async (projectName, options) => {
    await init(projectName, options);
  });

// plugin 命令
const pluginCommand = program
  .command('plugin')
  .alias('p')
  .description('插件管理');

pluginCommand
  .command('add [plugins...]')
  .description('添加插件到当前项目')
  .action(async (plugins) => {
    await addPlugin(plugins);
  });

pluginCommand
  .command('remove [plugins...]')
  .description('从当前项目移除插件')
  .action(async (plugins) => {
    await removePlugin(plugins);
  });

pluginCommand
  .command('list')
  .description('列出所有可用插件')
  .action(async () => {
    await listPlugins();
  });

// upgrade 命令
program
  .command('upgrade')
  .description('升级 xcli 到最新版本')
  .option('--check', '仅检查更新')
  .option('--tag <tag>', '指定版本标签')
  .action(async (options) => {
    await upgrade(options);
  });

// 解析命令行参数
program.parse();
```

### 4.2 命令行参数解析

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  Commander.js 参数解析                                                                 │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  命令格式                                                                              │
│  xcli <command> [options]                                                            │
│                                                                                       │
│  参数类型                                                                              │
│  ├── 必填参数     <projectName>    - 必须提供                                        │
│  ├── 可选参数     [projectName]    - 可选提供                                        │
│  ├── 可变参数     [plugins...]     - 接收多个值                                      │
│  └── 选项参数     -t, --template <type>                                              │
│                                                                                       │
│  选项类型                                                                              │
│  ├── 短选项       -t react                                                           │
│  ├── 长选项       --template react                                                   │
│  ├── 布尔选项     --default, --skipGit                                               │
│  └── 组合选项     -d --skipGit                                                       │
│                                                                                       │
│  示例                                                                                  │
│  xcli init                           # 交互式创建                                    │
│  xcli init my-project                # 指定项目名                                    │
│  xcli init my-project -t react       # 指定模板                                      │
│  xcli init my-project -t react -d    # 使用默认配置                                  │
│  xcli plugin add eslint prettier     # 添加多个插件                                  │
│  xcli upgrade --check                # 检查更新                                      │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md) | [上一章：项目概述与架构](../项目概述与架构/index.md) | [下一章：插件系统](../插件系统/index.md)
