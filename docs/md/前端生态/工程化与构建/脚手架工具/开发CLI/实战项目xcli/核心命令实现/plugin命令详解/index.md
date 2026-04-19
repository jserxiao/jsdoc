# plugin 命令详解

`plugin` 命令用于在已有项目中管理插件，支持添加、移除和查看插件。

## 命令定义

```typescript
// src/index.ts
const pluginCommand = program
  .command('plugin')
  .description('管理项目插件')
  .alias('p');

// plugin add 子命令
pluginCommand
  .command('add [plugins...]')
  .description('添加插件到当前项目')
  .alias('a')
  .action(async (plugins) => {
    await addPlugin(plugins);
  });

// plugin remove 子命令
pluginCommand
  .command('remove [plugins...]')
  .description('从当前项目移除插件')
  .alias('r')
  .action(async (plugins) => {
    await removePlugin(plugins);
  });

// plugin list 子命令
pluginCommand
  .command('list')
  .description('列出所有可用插件')
  .alias('ls')
  .action(async () => {
    await listPlugins();
  });
```

---

## plugin add 命令

### 执行流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    plugin add 执行流程                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 检查项目环境                                                │
│     └── 确认 package.json 存在                                  │
│                                                                 │
│  2. 获取插件列表                                                │
│     ├── 命令行指定：直接使用                                    │
│     └── 未指定：交互式选择                                      │
│                                                                 │
│  3. 检测项目样式类型                                            │
│     ├── 检查 devDependencies 中是否有 less/sass                 │
│     └── 检查是否存在 .less/.scss 文件                           │
│                                                                 │
│  4. 构建插件上下文                                              │
│     └── 从 package.json 读取项目信息                            │
│                                                                 │
│  5. 遍历安装插件                                                │
│     ├── 添加依赖到 package.json                                 │
│     ├── 添加 npm scripts                                        │
│     ├── 生成配置文件                                            │
│     └── 执行 postInstall 钩子                                   │
│                                                                 │
│  6. 更新 package.json                                           │
│                                                                 │
│  7. 提示用户安装依赖                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 源码实现

```typescript
export async function addPlugin(pluginNames: string[]): Promise<void> {
  const currentDir = process.cwd();
  const packageJsonPath = path.join(currentDir, 'package.json');

  // 1. 检查是否在项目目录
  if (!(await fs.pathExists(packageJsonPath))) {
    logger.error('请在项目根目录下执行此命令');
    process.exit(1);
  }

  // 2. 获取插件列表
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

  if (selectedPlugins.length === 0) {
    logger.warning('未选择任何插件');
    return;
  }

  // 3. 获取插件实例
  let pluginsToAdd = selectedPlugins
    .map((name) => pluginMap.get(name))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // 4. 检测项目的样式类型
  let detectedStyleType: 'css' | 'less' | 'scss' = 'css';
  const packageJson = await fs.readJson(packageJsonPath);
  
  if (packageJson.devDependencies?.less || 
      await fs.pathExists(path.join(currentDir, 'src', 'index.less'))) {
    detectedStyleType = 'less';
  } else if (packageJson.devDependencies?.sass || 
             await fs.pathExists(path.join(currentDir, 'src', 'index.scss'))) {
    detectedStyleType = 'scss';
  }

  // 5. 动态处理 Stylelint 插件
  const hasStylelint = pluginsToAdd.some(p => p.name === 'stylelint');
  if (hasStylelint) {
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
    stateManager: 'none',
    httpClient: 'none',
    monitoring: 'none',
    bundler: 'none',
    selectedPlugins: selectedPlugins,
    useTypeScript: true,
    packageManager: 'npm',
    options: {},
  };

  // 7. 安装每个插件
  const spinner = ora();
  for (const plugin of pluginsToAdd) {
    spinner.start(`安装 ${plugin.displayName}...`);

    try {
      // 添加依赖
      if (plugin.dependencies) {
        Object.assign(packageJson.dependencies || {}, plugin.dependencies);
      }
      if (plugin.devDependencies) {
        Object.assign(packageJson.devDependencies || {}, plugin.devDependencies);
      }

      // 添加脚本
      if (plugin.scripts) {
        Object.assign(packageJson.scripts || {}, plugin.scripts);
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

  logger.newline();
  logger.success('插件安装完成!');
  logger.info('请运行 npm install 安装新依赖');
}
```

### 使用示例

```bash
# 交互式选择插件
xcli plugin add

# 添加指定插件
xcli plugin add eslint prettier

# 使用简写
xcli p a husky
```

---

## plugin remove 命令

### 执行流程

```
┌─────────────────────────────────────────────────────────────────┐
│                   plugin remove 执行流程                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 检查项目环境                                                │
│     └── 确认 package.json 存在                                  │
│                                                                 │
│  2. 获取插件列表                                                │
│     ├── 命令行指定：直接使用                                    │
│     └── 未指定：交互式选择                                      │
│                                                                 │
│  3. 遍历移除插件                                                │
│     ├── 从 package.json 移除依赖                                │
│     ├── 移除 npm scripts                                        │
│     └── 删除配置文件                                            │
│                                                                 │
│  4. 更新 package.json                                           │
│                                                                 │
│  5. 提示用户更新依赖                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 源码实现

```typescript
export async function removePlugin(pluginNames: string[]): Promise<void> {
  const currentDir = process.cwd();
  const packageJsonPath = path.join(currentDir, 'package.json');

  // 检查项目环境
  if (!(await fs.pathExists(packageJsonPath))) {
    logger.error('请在项目根目录下执行此命令');
    process.exit(1);
  }

  // 获取插件列表
  let selectedPlugins: string[] = pluginNames;
  if (pluginNames.length === 0) {
    const { plugins: chosen } = await inquirer.prompt({
      type: 'checkbox',
      name: 'plugins',
      message: '选择要移除的插件:',
      choices: plugins.map((p) => ({
        name: `${p.displayName} - ${p.description}`,
        value: p.name,
      })),
    });
    selectedPlugins = chosen;
  }

  if (selectedPlugins.length === 0) {
    logger.warning('未选择任何插件');
    return;
  }

  // 获取插件实例
  const pluginsToRemove = selectedPlugins
    .map((name) => pluginMap.get(name))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // 读取 package.json
  const packageJson = await fs.readJson(packageJsonPath);

  const spinner = ora();
  for (const plugin of pluginsToRemove) {
    spinner.start(`移除 ${plugin.displayName}...`);

    try {
      // 移除依赖
      if (plugin.dependencies) {
        for (const dep of Object.keys(plugin.dependencies)) {
          delete packageJson.dependencies?.[dep];
        }
      }
      if (plugin.devDependencies) {
        for (const dep of Object.keys(plugin.devDependencies)) {
          delete packageJson.devDependencies?.[dep];
        }
      }

      // 移除脚本
      if (plugin.scripts) {
        for (const script of Object.keys(plugin.scripts)) {
          delete packageJson.scripts?.[script];
        }
      }

      // 移除配置文件
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

  // 更新 package.json
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  logger.newline();
  logger.success('插件移除完成!');
  logger.info('请运行 npm install 更新依赖');
}
```

### 使用示例

```bash
# 交互式选择要移除的插件
xcli plugin remove

# 移除指定插件
xcli plugin remove husky commitlint

# 使用简写
xcli p r jest
```

---

## plugin list 命令

### 源码实现

```typescript
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

  const categoryNames: Record<string, string> = {
    linter: '代码检查',
    formatter: '代码格式化',
    test: '测试框架',
    git: 'Git 工具',
    bundler: '构建打包',
    other: '其他',
  };

  // 输出分类列表
  for (const [category, categoryPlugins] of Object.entries(categories)) {
    console.log(`\n${categoryNames[category] || category}:`);
    for (const plugin of categoryPlugins) {
      const defaultTag = plugin.defaultEnabled ? ' (默认)' : '';
      console.log(`  - ${plugin.displayName}${defaultTag}: ${plugin.description}`);
    }
  }
}
```

### 输出示例

```
可用插件列表

代码检查:
  - ESLint (默认): JavaScript/TypeScript 代码检查
  - Stylelint (默认): 样式代码检查

代码格式化:
  - Prettier (默认): 代码格式化工具

测试框架:
  - Jest: JavaScript 测试框架
  - Vitest: Vite 原生测试框架

Git 工具:
  - Husky + lint-staged: Git Hooks 管理
  - Commitlint: 提交信息规范检查

构建打包:
  - Vite: 新一代前端构建工具
  - Webpack: 功能强大的打包工具
  - Rollup: JavaScript 库打包工具

其他:
  - TypeScript (默认): TypeScript 支持
```

### 使用示例

```bash
# 列出所有插件
xcli plugin list

# 使用简写
xcli p ls
```

---

## 总结

`plugin` 命令的核心特点：

1. **动态管理**：在已有项目中添加或移除插件
2. **智能检测**：自动检测项目样式类型
3. **交互友好**：支持命令行参数和交互式选择
4. **完整清理**：移除时同步删除配置文件

这套机制让 xcli 能够适应项目变化的需求，灵活扩展功能。
