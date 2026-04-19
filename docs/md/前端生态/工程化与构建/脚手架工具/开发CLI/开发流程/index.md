# CLI 开发流程

> 从零开发一个前端脚手架工具需要清晰的架构设计和完整的开发流程。本章将详细介绍 CLI 开发的每个环节。

## 学习要点

- 🏗️ 掌握 CLI 项目架构设计
- 📋 理解完整的开发流程
- 🔧 学会项目初始化配置
- 🚀 掌握发布与调试技巧

---

## 1. 脚手架核心原理

### 1.1 什么是脚手架

脚手架（Scaffold）是一种工具，旨在通过预设模板和自动化脚本快速生成项目的基础结构，从而节省开发者手动配置的时间。

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  脚手架工作原理                                                                        │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   用户输入命令                                                                        │
│       │                                                                               │
│       ▼                                                                               │
│   ┌─────────────┐                                                                    │
│   │  CLI 解析   │  ← 解析命令行参数                                                   │
│   │  参数/选项  │                                                                    │
│   └─────────────┘                                                                    │
│       │                                                                               │
│       ▼                                                                               │
│   ┌─────────────┐                                                                    │
│   │  交互式问答 │  ← 收集用户配置信息                                                 │
│   └─────────────┘                                                                    │
│       │                                                                               │
│       ▼                                                                               │
│   ┌─────────────┐                                                                    │
│   │  获取模板   │  ← 本地模板 / Git 仓库                                              │
│   └─────────────┘                                                                    │
│       │                                                                               │
│       ▼                                                                               │
│   ┌─────────────┐                                                                    │
│   │  模板渲染   │  ← 变量替换、文件生成                                               │
│   └─────────────┘                                                                    │
│       │                                                                               │
│       ▼                                                                               │
│   ┌─────────────┐                                                                    │
│   │  后续处理   │  ← 安装依赖、初始化 Git                                             │
│   └─────────────┘                                                                    │
│       │                                                                               │
│       ▼                                                                               │
│   项目创建完成                                                                        │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 为什么需要自定义脚手架

| 场景 | 问题描述 | 脚手架解决方案 |
|------|---------|---------------|
| **项目初始化** | 每次新建项目需复制粘贴、删除无关代码 | 一键生成标准化项目结构 |
| **团队协作** | 多人开发项目结构不一致、配置不统一 | 统一的技术栈和代码规范 |
| **版本管理** | 依赖版本混乱、升级困难 | 统一管理依赖版本 |
| **业务定制** | 通用脚手架无法满足特定业务需求 | 集成公司特定组件库和工具函数 |
| **效率提升** | 重复性工作占用大量时间 | 自动化配置、开箱即用 |

---

## 2. 完整开发流程

### 2.1 开发流程概览

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  CLI 开发完整流程                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  Phase 1: 项目初始化                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ├── 创建项目目录                                                               │ │
│  │  ├── 初始化 package.json                                                        │ │
│  │  ├── 配置 bin 入口                                                              │ │
│  │  ├── 安装核心依赖                                                               │ │
│  │  └── 配置 TypeScript/ESLint（可选）                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  Phase 2: 命令解析                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ├── 定义命令（command）                                                        │ │
│  │  ├── 定义选项（option）                                                         │ │
│  │  ├── 解析参数（parse）                                                          │ │
│  │  └── 处理帮助信息（help）                                                       │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  Phase 3: 交互设计                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ├── 设计提示流程                                                               │ │
│  │  ├── 收集用户输入                                                               │ │
│  │  ├── 验证输入合法性                                                             │ │
│  │  └── 处理默认值                                                                 │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  Phase 4: 模板处理                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ├── 本地模板复制 / 远程模板下载                                                │ │
│  │  ├── 变量替换渲染                                                               │ │
│  │  ├── 文件生成输出                                                               │ │
│  │  └── 处理文件冲突                                                               │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  Phase 5: 后续处理                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ├── 安装依赖                                                                   │ │
│  │  ├── 初始化 Git                                                                 │ │
│  │  ├── 输出使用提示                                                               │ │
│  │  └── 错误处理与回滚                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                       ▼                                               │
│  Phase 6: 发布维护                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ├── 本地测试（npm link）                                                       │ │
│  │  ├── 发布到 npm                                                                 │ │
│  │  ├── 版本管理与更新                                                             │ │
│  │  └── 文档编写与维护                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 项目初始化

### 3.1 创建项目结构

推荐的项目目录结构：

```
xcli/
├── bin/
│   └── index.js              # CLI 入口文件（必须）
├── lib/
│   ├── index.js              # 主逻辑入口
│   ├── core/
│   │   ├── action.js         # 命令动作
│   │   ├── command.js        # 命令定义
│   │   └── help.js           # 帮助信息
│   ├── utils/
│   │   ├── logger.js         # 日志工具
│   │   ├── download.js       # 下载工具
│   │   ├── template.js       # 模板处理
│   │   └── validate.js       # 验证工具
│   └── constants.js          # 常量定义
├── templates/                # 内置模板目录
│   ├── react/
│   └── vue/
├── docs/                     # 文档目录
├── package.json
├── README.md
└── LICENSE
```

### 3.2 初始化 package.json

```json
{
  "name": "@jserxiao/xcli",
  "version": "1.0.0",
  "description": "一个现代化的前端项目脚手架工具",
  "keywords": [
    "cli",
    "scaffold",
    "generator",
    "frontend"
  ],
  "author": "jserxiao",
  "license": "MIT",
  
  "bin": {
    "xcli": "./bin/index.js"
  },
  
  "files": [
    "bin",
    "lib",
    "templates"
  ],
  
  "scripts": {
    "test": "jest",
    "lint": "eslint lib bin"
  },
  
  "dependencies": {
    "chalk": "^4.1.2",
    "commander": "^11.0.0",
    "ejs": "^3.1.9",
    "execa": "^5.1.1",
    "fs-extra": "^11.1.1",
    "globby": "^13.2.2",
    "inquirer": "^8.2.6",
    "ora": "^5.4.1",
    "download-git-repo": "^3.0.2",
    "semver": "^7.5.4",
    "validate-npm-package-name": "^5.0.0"
  },
  
  "devDependencies": {
    "eslint": "^8.50.0",
    "jest": "^29.7.0"
  },
  
  "engines": {
    "node": ">=14.0.0"
  },
  
  "repository": {
    "type": "git",
    "url": "https://github.com/jserxiao/xcli"
  },
  
  "homepage": "https://github.com/jserxiao/xcli#readme",
  "bugs": {
    "url": "https://github.com/jserxiao/xcli/issues"
  }
}
```

### 3.3 bin 入口文件

**bin/index.js** 是 CLI 的入口文件，必须以 `#!/usr/bin/env node` 开头：

```javascript
#!/usr/bin/env node

/**
 * @jserxiao/xcli 入口文件
 * 用于解析命令行参数并执行相应命令
 */

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

// 获取 package.json 信息
const pkgPath = path.join(__dirname, '../package.json');
const pkg = fs.readJsonSync(pkgPath);

// 基础配置
program
  .name('xcli')
  .description(chalk.cyan('一个现代化的前端项目脚手架工具'))
  .version(pkg.version, '-v, --version', '显示版本号')
  .usage('<command> [options]');

// 注册命令
const commands = require('../lib/core/command');
commands(program);

// 处理未知命令
program.on('command:*', (operands) => {
  console.log(chalk.red(`未知命令: ${operands[0]}`));
  console.log(chalk.gray('运行 xcli --help 查看可用命令'));
  process.exit(1);
});

// 解析参数
program.parse(process.argv);

// 无参数时显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
```

---

## 4. 命令定义与解析

### 4.1 命令设计原则

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  CLI 命令设计原则                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  命令命名                                                                              │
│  □ 使用简短、有意义的动词：create、init、add、remove、list                          │
│  □ 支持别名：create → c, init → i                                                   │
│  □ 避免歧义，符合直觉                                                                │
│                                                                                       │
│  参数设计                                                                              │
│  □ 必填参数使用尖括号：<name>                                                        │
│  □ 可选参数使用方括号：[type]                                                        │
│  □ 提供合理的默认值                                                                  │
│                                                                                       │
│  选项设计                                                                              │
│  □ 短选项：-f（单个字母）                                                            │
│  □ 长选项：--force（完整单词）                                                       │
│  □ 带值选项：-t, --template <name>                                                  │
│  □ 布尔选项：-f, --force（无值）                                                     │
│  □ 否定选项：--no-git                                                                │
│                                                                                       │
│  帮助信息                                                                              │
│  □ 提供清晰的命令描述                                                                │
│  □ 列出所有选项及其说明                                                              │
│  □ 提供使用示例                                                                      │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 命令定义实现

```javascript
// lib/core/command.js

const chalk = require('chalk');
const action = require('./action');

/**
 * 注册所有命令
 * @param {Commander} program - Commander 实例
 */
module.exports = function(program) {
  // ─────────────────────────────────────────────────────────────────────────
  // create 命令 - 创建新项目
  // ─────────────────────────────────────────────────────────────────────────
  program
    .command('create <project-name>')
    .description('创建一个新项目')
    .alias('c')
    .option('-t, --template <template>', '指定模板名称')
    .option('-f, --force', '强制覆盖已存在的目录')
    .option('--no-git', '不初始化 Git 仓库')
    .option('--no-install', '不自动安装依赖')
    .option('-r, --registry <url>', '指定 npm 源')
    .action(action.create);
  
  // ─────────────────────────────────────────────────────────────────────────
  // init 命令 - 初始化配置
  // ─────────────────────────────────────────────────────────────────────────
  program
    .command('init')
    .description('初始化配置文件')
    .alias('i')
    .action(action.init);
  
  // ─────────────────────────────────────────────────────────────────────────
  // list 命令 - 列出模板
  // ─────────────────────────────────────────────────────────────────────────
  program
    .command('list')
    .description('列出所有可用模板')
    .alias('ls')
    .option('-a, --all', '显示所有模板（包括远程）')
    .action(action.list);
  
  // ─────────────────────────────────────────────────────────────────────────
  // config 命令 - 配置管理
  // ─────────────────────────────────────────────────────────────────────────
  program
    .command('config <action> [key] [value]')
    .description('配置管理 (get/set/delete/list)')
    .action(action.config);
  
  // ─────────────────────────────────────────────────────────────────────────
  // update 命令 - 检查更新
  // ─────────────────────────────────────────────────────────────────────────
  program
    .command('update')
    .description('检查并更新脚手架')
    .alias('u')
    .action(action.update);
  
  // ─────────────────────────────────────────────────────────────────────────
  // add 命令 - 添加模板
  // ─────────────────────────────────────────────────────────────────────────
  program
    .command('add <template-name>')
    .description('添加自定义模板')
    .option('-u, --url <url>', '模板 Git 地址')
    .action(action.add);
  
  // ─────────────────────────────────────────────────────────────────────────
  // 全局选项
  // ─────────────────────────────────────────────────────────────────────────
  program
    .option('-d, --debug', '启用调试模式')
    .option('--color', '强制启用颜色输出')
    .option('--no-color', '禁用颜色输出');
};
```

### 4.3 命令参数详解

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  Commander 参数类型                                                                    │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  必填参数 <name>                                                                       │
│  program.command('create <project-name>')                                            │
│  → xcli create my-app        ✅ 正确                                                  │
│  → xcli create               ❌ 错误：缺少必填参数                                     │
│                                                                                       │
│  可选参数 [name]                                                                       │
│  program.command('list [filter]')                                                    │
│  → xcli list                 ✅ 使用默认值                                             │
│  → xcli list react           ✅ 指定过滤条件                                          │
│                                                                                       │
│  带值选项 <value>                                                                      │
│  program.option('-t, --template <name>', '指定模板')                                 │
│  → xcli create app -t react  ✅ 指定模板                                              │
│  → xcli create app --template vue  ✅ 长选项                                         │
│                                                                                       │
│  布尔选项（无值）                                                                      │
│  program.option('-f, --force', '强制覆盖')                                           │
│  → xcli create app -f        ✅ force = true                                         │
│  → xcli create app           ✅ force = false（默认）                                 │
│                                                                                       │
│  否定选项                                                                              │
│  program.option('--no-git', '不初始化 Git')                                          │
│  → xcli create app --no-git  ✅ git = false                                          │
│  → xcli create app           ✅ git = true（默认）                                    │
│                                                                                       │
│  可选值选项 [choices]                                                                  │
│  program.option('-p, --package <manager>', '包管理器', ['npm', 'yarn', 'pnpm'])      │
│  → xcli create app -p pnpm   ✅                                                      │
│                                                                                       │
│  默认值                                                                                │
│  program.option('-p, --package <manager>', '包管理器', 'npm')                        │
│  → xcli create app           ✅ package = 'npm'（默认值）                             │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. 交互式问答设计

### 5.1 问答流程设计

```javascript
// lib/core/action.js

const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

/**
 * create 命令动作
 */
async function create(projectName, options) {
  // 验证项目名称
  const validate = require('../utils/validate');
  
  if (!validate.isValidPackageName(projectName)) {
    console.log(chalk.red('项目名称不合法'));
    console.log(chalk.gray('名称只能包含小写字母、数字、中划线和下划线'));
    process.exit(1);
  }
  
  const targetDir = path.join(process.cwd(), projectName);
  
  // ─────────────────────────────────────────────────────────────────────────
  // Step 1: 检查目录是否存在
  // ─────────────────────────────────────────────────────────────────────────
  
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: `目录 ${chalk.cyan(projectName)} 已存在，请选择操作:`,
          choices: [
            { name: '覆盖', value: 'overwrite' },
            { name: '合并', value: 'merge' },
            { name: '取消', value: 'cancel' }
          ]
        }
      ]);
      
      if (action === 'cancel') {
        return;
      }
      
      if (action === 'overwrite') {
        await fs.remove(targetDir);
      }
    }
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Step 2: 选择模板
  // ─────────────────────────────────────────────────────────────────────────
  
  let template = options.template;
  
  if (!template) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: '请选择框架:',
        choices: [
          { name: 'React', value: 'react' },
          { name: 'Vue', value: 'vue' },
          { name: 'Angular', value: 'angular' },
          { name: 'Svelte', value: 'svelte' },
          new inquirer.Separator('--- 其他 ---'),
          { name: 'Vanilla', value: 'vanilla' }
        ]
      },
      {
        type: 'list',
        name: 'variant',
        message: '请选择变体:',
        choices: (answers) => {
          const base = answers.framework;
          const variants = [
            { name: 'JavaScript', value: base },
            { name: 'TypeScript', value: `${base}-ts` }
          ];
          
          // React 特有选项
          if (base === 'react') {
            variants.push(
              { name: 'React + SWC', value: 'react-swc' },
              { name: 'React + SWC + TypeScript', value: 'react-swc-ts' }
            );
          }
          
          return variants;
        }
      }
    ]);
    
    template = answers.variant;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Step 3: 功能选择
  // ─────────────────────────────────────────────────────────────────────────
  
  const projectConfig = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: '项目描述:',
      default: `A ${template} project`
    },
    {
      type: 'input',
      name: 'author',
      message: '作者:',
      default: ''
    },
    {
      type: 'checkbox',
      name: 'features',
      message: '选择需要的功能:',
      choices: [
        { name: 'ESLint', value: 'eslint', checked: true },
        { name: 'Prettier', value: 'prettier', checked: true },
        { name: 'Husky (Git Hooks)', value: 'husky' },
        { name: 'lint-staged', value: 'lintStaged', checked: true },
        { name: 'Vitest (测试)', value: 'vitest' },
        { name: 'Tailwind CSS', value: 'tailwind' },
        { name: '环境变量配置', value: 'env', checked: true }
      ]
    },
    {
      type: 'list',
      name: 'packageManager',
      message: '选择包管理器:',
      choices: ['npm', 'yarn', 'pnpm'],
      default: 'npm'
    }
  ]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // Step 4: 执行创建
  // ─────────────────────────────────────────────────────────────────────────
  
  const generator = require('../utils/template');
  
  await generator.generate({
    name: projectName,
    template,
    targetDir,
    features: projectConfig.features,
    ...projectConfig
  }, options);
}

module.exports = { create };
```

### 5.2 交互设计最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  交互设计最佳实践                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  问题设计                                                                              │
│  □ 问题数量适中（5-8 个），避免过度繁琐                                                │
│  □ 提供合理的默认值，减少用户输入                                                      │
│  □ 复杂选项使用 checkbox 多选                                                          │
│  □ 关键选择使用 confirm 确认                                                           │
│                                                                                       │
│  流程控制                                                                              │
│  □ 根据前一个答案动态调整后续问题                                                      │
│  □ 支持命令行选项跳过交互                                                              │
│  □ 提供回退和修改机制                                                                  │
│                                                                                       │
│  输入验证                                                                              │
│  □ 即时验证，给出明确的错误提示                                                        │
│  □ 支持重新输入                                                                        │
│  □ 过滤和格式化输入（如转小写、去空格）                                                │
│                                                                                       │
│  用户体验                                                                              │
│  □ 清晰的提示信息                                                                      │
│  □ 进度反馈（spinner）                                                                 │
│  □ 成功/失败提示                                                                        │
│  □ 颜色区分不同类型信息                                                                │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. 模板处理机制

### 6.1 模板来源

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  模板来源方式                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  方式一：内置模板                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  优点：速度快、无需网络、版本可控                                               │ │
│  │  缺点：更新需重新发布 CLI                                                       │ │
│  │  适用：稳定的基础模板                                                           │ │
│  │                                                                                 │ │
│  │  templates/                                                                    │ │
│  │  ├── react/                                                                    │ │
│  │  │   ├── package.json.ejs                                                      │ │
│  │  │   ├── index.html.ejs                                                        │ │
│  │  │   └── src/                                                                  │ │
│  │  └── vue/                                                                      │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  方式二：Git 远程模板                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  优点：灵活更新、支持多模板仓库                                                 │ │
│  │  缺点：依赖网络、下载速度不稳定                                                 │ │
│  │  适用：频繁更新的业务模板                                                       │ │
│  │                                                                                 │ │
│  │  xcli add my-template -u github:user/repo                                     │ │
│  │  xcli create my-app -t my-template                                            │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  方式三：混合模式                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  基础模板内置 + 业务模板远程                                                    │ │
│  │  支持模板缓存，提高下载速度                                                     │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 模板生成器实现

```javascript
// lib/utils/template.js

const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const globby = require('globby');
const chalk = require('chalk');
const ora = require('ora');
const download = require('download-git-repo');
const execa = require('execa');

/**
 * 模板生成器
 */
class Generator {
  constructor(options) {
    this.name = options.name;
    this.template = options.template;
    this.targetDir = options.targetDir;
    this.features = options.features || [];
    this.description = options.description || '';
    this.author = options.author || '';
    this.packageManager = options.packageManager || 'npm';
  }
  
  /**
   * 执行生成
   */
  async run(options = {}) {
    const spinner = ora('正在生成项目...').start();
    
    try {
      // 1. 获取模板
      const templateDir = await this.getTemplateDir(options);
      
      // 2. 处理模板文件
      await this.processTemplate(templateDir);
      
      spinner.succeed(chalk.green('项目生成成功'));
      
      // 3. 安装依赖
      if (options.install !== false) {
        await this.installDependencies();
      }
      
      // 4. 初始化 Git
      if (options.git !== false) {
        await this.initGit();
      }
      
      // 5. 输出提示
      this.printSuccessMessage();
      
    } catch (error) {
      spinner.fail(chalk.red('项目生成失败'));
      throw error;
    }
  }
  
  /**
   * 获取模板目录
   */
  async getTemplateDir(options) {
    // 检查是否是远程模板
    const remoteTemplates = {
      'github': /^github:/,
      'gitlab': /^gitlab:/,
      'bitbucket': /^bitbucket:/,
      'direct': /^direct:/
    };
    
    for (const [type, pattern] of Object.entries(remoteTemplates)) {
      if (pattern.test(this.template)) {
        return await this.downloadRemoteTemplate(this.template, type);
      }
    }
    
    // 本地模板
    const localTemplateDir = path.join(__dirname, '../../templates', this.template);
    
    if (!fs.existsSync(localTemplateDir)) {
      throw new Error(`模板 ${this.template} 不存在`);
    }
    
    return localTemplateDir;
  }
  
  /**
   * 下载远程模板
   */
  async downloadRemoteTemplate(template, type) {
    const cacheDir = path.join(require('os').homedir(), '.xcli', 'templates');
    const templateName = template.replace(/^(github:|gitlab:|bitbucket:|direct:)/, '').replace(/[/:]/g, '-');
    const targetPath = path.join(cacheDir, templateName);
    
    // 检查缓存
    if (fs.existsSync(targetPath)) {
      const { useCache } = await require('inquirer').prompt([
        {
          type: 'confirm',
          name: 'useCache',
          message: '发现缓存模板，是否使用缓存？',
          default: true
        }
      ]);
      
      if (useCache) {
        return targetPath;
      }
      
      await fs.remove(targetPath);
    }
    
    const spinner = ora('正在下载远程模板...').start();
    
    return new Promise((resolve, reject) => {
      download(template, targetPath, { clone: false }, (err) => {
        if (err) {
          spinner.fail(chalk.red('模板下载失败'));
          reject(err);
        } else {
          spinner.succeed(chalk.green('模板下载成功'));
          resolve(targetPath);
        }
      });
    });
  }
  
  /**
   * 处理模板文件
   */
  async processTemplate(templateDir) {
    // 获取所有文件
    const files = await globby('**/*', {
      cwd: templateDir,
      dot: true,
      ignore: ['**/node_modules/**', '**/.git/**']
    });
    
    // 模板数据
    const templateData = {
      name: this.name,
      description: this.description,
      author: this.author,
      features: this.features,
      year: new Date().getFullYear(),
      // 辅助函数
      hasFeature: (feature) => this.features.includes(feature)
    };
    
    // 处理每个文件
    for (const file of files) {
      const srcPath = path.join(templateDir, file);
      const destPath = path.join(this.targetDir, file);
      
      // 判断是否需要模板渲染
      if (this.isTemplateFile(file)) {
        await this.renderTemplateFile(srcPath, destPath, templateData);
      } else {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(srcPath, destPath);
      }
    }
  }
  
  /**
   * 判断是否是模板文件
   */
  isTemplateFile(filename) {
    return filename.endsWith('.ejs') || 
           filename.endsWith('.hbs') ||
           filename === 'package.json';
  }
  
  /**
   * 渲染模板文件
   */
  async renderTemplateFile(srcPath, destPath, data) {
    const content = await fs.readFile(srcPath, 'utf-8');
    
    // EJS 渲染
    const result = ejs.render(content, data, {
      filename: srcPath
    });
    
    // 目标文件路径（去掉 .ejs 后缀）
    let finalPath = destPath.replace(/\.ejs$/, '');
    
    await fs.ensureDir(path.dirname(finalPath));
    await fs.writeFile(finalPath, result);
  }
  
  /**
   * 安装依赖
   */
  async installDependencies() {
    const spinner = ora('正在安装依赖...').start();
    
    try {
      const commands = {
        npm: ['install'],
        yarn: ['install'],
        pnpm: ['install']
      };
      
      await execa(this.packageManager, commands[this.packageManager], {
        cwd: this.targetDir,
        stdio: 'ignore'
      });
      
      spinner.succeed(chalk.green('依赖安装成功'));
    } catch (error) {
      spinner.fail(chalk.yellow('依赖安装失败，请手动安装'));
      console.log(chalk.gray(`  cd ${this.name} && ${this.packageManager} install`));
    }
  }
  
  /**
   * 初始化 Git
   */
  async initGit() {
    const spinner = ora('正在初始化 Git...').start();
    
    try {
      await execa('git', ['init'], { cwd: this.targetDir });
      await execa('git', ['add', '.'], { cwd: this.targetDir });
      await execa('git', ['commit', '-m', 'Initial commit'], { cwd: this.targetDir });
      
      spinner.succeed(chalk.green('Git 初始化成功'));
    } catch (error) {
      spinner.fail(chalk.yellow('Git 初始化失败'));
    }
  }
  
  /**
   * 打印成功消息
   */
  printSuccessMessage() {
    console.log();
    console.log(chalk.green('✓ 项目创建成功！'));
    console.log();
    console.log(chalk.gray('  cd ' + this.name));
    console.log(chalk.gray(`  ${this.packageManager} run dev`));
    console.log();
    console.log(chalk.cyan('  文档: https://github.com/jserxiao/xcli'));
    console.log();
  }
}

module.exports = Generator;
```

---

## 7. 错误处理与调试

### 7.1 全局错误处理

```javascript
// bin/index.js

// 全局错误处理
process.on('uncaughtException', (error) => {
  console.error(chalk.red('发生未捕获的错误:'));
  console.error(error.message);
  
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('未处理的 Promise 拒绝:'));
  console.error(reason);
  process.exit(1);
});

// 调试模式
const program = require('commander');

program.on('option:debug', () => {
  process.env.DEBUG = 'xcli:*';
});
```

### 7.2 命令执行上下文

```javascript
// lib/utils/context.js

/**
 * 命令执行上下文
 */
class Context {
  constructor() {
    this.cwd = process.cwd();
    this.config = this.loadConfig();
    this.debug = process.env.DEBUG === 'xcli:*';
  }
  
  /**
   * 加载配置文件
   */
  loadConfig() {
    const configPath = path.join(this.cwd, '.xclirc');
    
    if (fs.existsSync(configPath)) {
      return fs.readJsonSync(configPath);
    }
    
    return {};
  }
  
  /**
   * 日志输出
   */
  log(message, type = 'info') {
    const types = {
      info: chalk.blue,
      success: chalk.green,
      warn: chalk.yellow,
      error: chalk.red
    };
    
    console.log(types[type](message));
  }
  
  /**
   * 调试日志
   */
  debug(message) {
    if (this.debug) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  }
}

module.exports = Context;
```

---

## 8. 发布与维护

### 8.1 本地测试

```bash
# 方式一：npm link
cd xcli
npm link

# 测试命令
xcli --version
xcli create test-project

# 取消链接
npm unlink -g @jserxiao/xcli

# 方式二：npx 本地测试
npx ./bin/index.js create test-project
```

### 8.2 发布流程

```bash
# 1. 登录 npm
npm login

# 2. 检查发布文件
npm pack --dry-run

# 3. 发布（稳定版）
npm publish

# 4. 发布 Beta 版本
npm publish --tag beta

# 5. 发布下一个版本
npm publish --tag next
```

### 8.3 版本管理

```bash
# 补丁版本（bug 修复）
npm version patch  # 1.0.0 -> 1.0.1

# 小版本（新功能）
npm version minor  # 1.0.0 -> 1.1.0

# 大版本（破坏性变更）
npm version major  # 1.0.0 -> 2.0.0

# 预发布版本
npm version prerelease --preid=beta  # 1.0.0 -> 1.0.1-beta.0
```

---

## 最佳实践总结

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  CLI 开发最佳实践清单                                                                  │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  项目结构                                                                              │
│  □ 清晰的目录结构，模块化设计                                                          │
│  □ bin/ 作为入口，lib/ 作为核心逻辑                                                    │
│  □ 模板与代码分离                                                                      │
│                                                                                       │
│  命令设计                                                                              │
│  □ 命令简洁明了，符合直觉                                                              │
│  □ 提供合理的默认值                                                                    │
│  □ 支持别名和简写                                                                      │
│  □ 完善的帮助信息                                                                      │
│                                                                                       │
│  用户体验                                                                              │
│  □ 友好的交互提示                                                                      │
│  □ 清晰的进度反馈                                                                      │
│  □ 有意义的错误信息                                                                    │
│  □ 颜色美化输出                                                                        │
│                                                                                       │
│  错误处理                                                                              │
│  □ 捕获所有可能的异常                                                                  │
│  □ 提供错误恢复建议                                                                    │
│  □ 调试模式支持                                                                        │
│                                                                                       │
│  文档与维护                                                                            │
│  □ 完善的 README 文档                                                                  │
│  □ CHANGELOG 更新记录                                                                  │
│  □ 版本语义化控制                                                                      │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md) | [下一章：工具库详解](../工具库详解/index.md)
