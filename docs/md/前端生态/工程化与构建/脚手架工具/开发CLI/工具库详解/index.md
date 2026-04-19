# CLI 工具库详解

> 开发 CLI 工具需要借助成熟的开源库来提高开发效率。本章将详细介绍 CLI 开发中常用的核心工具库及其使用方法。

## 学习要点

- 📦 掌握命令行参数解析库
- 🎨 学会终端美化工具使用
- 📁 理解文件操作工具库
- 🔧 掌握模板引擎应用

---

## 1. 工具库全景图

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  CLI 开发核心工具库                                                                    │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  命令行框架                                                                      │ │
│  │  ├── commander     - 命令行参数解析（最流行，Star 26k+）                        │ │
│  │  ├── yargs         - 命令行参数解析（功能丰富，Star 11k+）                      │ │
│  │  ├── oclif         - 企业级 CLI 框架（Heroku 出品，Star 9k+）                  │ │
│  │  └── cac           - 轻量级命令行框架（Star 2k+）                              │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  交互提示                                                                        │ │
│  │  ├── inquirer     - 交互式命令行提示（最流行，Star 19k+）                       │ │
│  │  ├── prompts      - 轻量级交互提示（Terkelg，Star 8k+）                        │ │
│  │  ├── enquirer     - 功能丰富的交互提示（Star 7k+）                             │ │
│  │  └── readline     - Node.js 内置模块                                           │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  终端美化                                                                        │ │
│  │  ├── chalk        - 终端字符串样式（颜色、加粗等，Star 21k+）                   │ │
│  │  ├── ora          - 优雅的终端 loading 动画（Star 9k+）                        │ │
│  │  ├── figlet       - 生成 ASCII 艺术字体（Star 3k+）                            │ │
│  │  ├── boxen        - 终端中创建盒子（Star 2k+）                                 │ │
│  │  ├── cli-table3   - 终端表格输出（Star 5k+）                                   │ │
│  │  └── log-symbols  - 终端图标符号（Star 1k+）                                   │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  文件操作                                                                        │ │
│  │  ├── fs-extra     - fs 扩展，支持 Promise（Star 9k+）                          │ │
│  │  ├── globby       - 文件模式匹配（Star 7k+）                                   │ │
│  │  ├── rimraf       - 删除文件/目录（Star 6k+）                                  │ │
│  │  ├── mem-fs       - 内存文件系统（Star 1k+）                                   │ │
│  │  └── mem-fs-editor - 内存文件编辑器（Star 3k+）                                │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  模板引擎                                                                        │ │
│  │  ├── ejs          - 嵌入式 JavaScript 模板（Star 7k+）                         │ │
│  │  ├── handlebars   - Handlebars 模板引擎（Star 18k+）                           │ │
│  │  ├── mustache     - Mustache 模板引擎（Star 16k+）                             │ │
│  │  └── art-template - 高性能模板引擎（Star 10k+）                                │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  网络请求                                                                        │ │
│  │  ├── axios        - HTTP 客户端（Star 104k+）                                  │ │
│  │  ├── node-fetch   - Fetch API 实现（Star 9k+）                                 │ │
│  │  ├── got          - 更好的 HTTP 请求库（Star 14k+）                             │ │
│  │  └── download-git-repo - Git 仓库下载工具                                      │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  其他工具                                                                        │ │
│  │  ├── execa        - 更好的子进程执行（Star 6k+）                               │ │
│  │  ├── cross-spawn  - 跨平台进程执行（Star 1k+）                                 │ │
│  │  ├── semver       - 语义版本控制（Star 5k+）                                   │ │
│  │  ├── leven        - 字符串相似度计算（Star 1k+）                               │ │
│  │  └── validate-npm-package-name - 包名验证                                      │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Commander - 命令行参数解析

> Commander.js 是 Node.js 中最流行的命令行参数解析库，由 TJ Holowaychuk 开发，提供了完整的命令行解决方案。

### 2.1 基本使用

```javascript
#!/usr/bin/env node
const { program } = require('commander');

// 基础配置
program
  .name('xcli')
  .description('一个现代化的前端项目脚手架工具')
  .version('1.0.0', '-v, --version', '显示版本号')
  .usage('<command> [options]');

// 解析参数
program.parse();
```

### 2.2 定义命令

```javascript
const { program } = require('commander');

// ─────────────────────────────────────────────────────────────────────────────────
// 基础命令
// ─────────────────────────────────────────────────────────────────────────────────

program
  .command('create <name>')        // 必填参数
  .description('创建新项目')
  .action((name) => {
    console.log(`创建项目: ${name}`);
  });

// ─────────────────────────────────────────────────────────────────────────────────
// 带选项的命令
// ─────────────────────────────────────────────────────────────────────────────────

program
  .command('create <name>')
  .description('创建新项目')
  .option('-t, --template <template>', '指定模板', 'default')
  .option('-f, --force', '强制覆盖')
  .option('-p, --package <manager>', '包管理器', 'npm')
  .action((name, options) => {
    console.log('项目名称:', name);
    console.log('模板:', options.template);
    console.log('强制覆盖:', options.force);
    console.log('包管理器:', options.packageManager); // 注意：驼峰转换
  });

// ─────────────────────────────────────────────────────────────────────────────────
// 命令别名
// ─────────────────────────────────────────────────────────────────────────────────

program
  .command('list')
  .alias('ls')                     // 设置别名
  .description('列出所有模板')
  .action(() => {
    console.log('模板列表...');
  });

// ─────────────────────────────────────────────────────────────────────────────────
// 可选参数
// ─────────────────────────────────────────────────────────────────────────────────

program
  .command('config [key] [value]') // 可选参数
  .description('配置管理')
  .action((key, value) => {
    if (!key) {
      // 显示所有配置
    } else if (!value) {
      // 获取配置
    } else {
      // 设置配置
    }
  });

// ─────────────────────────────────────────────────────────────────────────────────
// 剩余参数
// ─────────────────────────────────────────────────────────────────────────────────

program
  .command('run <script>')
  .allowUnknownOption()            // 允许未知选项
  .action((script) => {
    // 获取剩余参数
    const args = program.args.slice(1);
    console.log('执行脚本:', script, args);
  });

// xcli run build --watch --mode development
```

### 2.3 选项类型

```javascript
const { program } = require('commander');

// ─────────────────────────────────────────────────────────────────────────────────
// 布尔选项（无值）
// ─────────────────────────────────────────────────────────────────────────────────

program
  .option('-d, --debug', '启用调试模式')
  .option('-f, --force', '强制覆盖');

// 使用：xcli --debug --force
// 结果：{ debug: true, force: true }

// ─────────────────────────────────────────────────────────────────────────────────
// 带值选项
// ─────────────────────────────────────────────────────────────────────────────────

program
  .option('-t, --template <name>', '指定模板')
  .option('-o, --output <path>', '输出目录', './dist'); // 带默认值

// 使用：xcli -t react -o ./build
// 结果：{ template: 'react', output: './build' }

// ─────────────────────────────────────────────────────────────────────────────────
// 可选值选项
// ─────────────────────────────────────────────────────────────────────────────────

program
  .option('-p, --package <manager>', '包管理器', ['npm', 'yarn', 'pnpm']);

// 使用：xcli -p pnpm
// 结果：{ package: 'pnpm' }

// ─────────────────────────────────────────────────────────────────────────────────
// 必填选项
// ─────────────────────────────────────────────────────────────────────────────────

program
  .requiredOption('-c, --config <path>', '配置文件路径');

// ─────────────────────────────────────────────────────────────────────────────────
// 否定选项
// ─────────────────────────────────────────────────────────────────────────────────

program
  .option('--no-git', '不初始化 Git')
  .option('--no-install', '不安装依赖');

// 使用：xcli --no-git
// 结果：{ git: false, install: true }

// ─────────────────────────────────────────────────────────────────────────────────
// 自定义选项处理
// ─────────────────────────────────────────────────────────────────────────────────

program
  .option('-p, --port <number>', '端口号', (value) => {
    const port = parseInt(value, 10);
    if (isNaN(port) || port < 1024 || port > 65535) {
      throw new Error('端口号必须在 1024-65535 之间');
    }
    return port;
  }, 3000);

// ─────────────────────────────────────────────────────────────────────────────────
// 选项合并
// ─────────────────────────────────────────────────────────────────────────────────

program
  .option('-c, --config <items>', '配置项', (value, previous) => {
    return previous ? [...previous, value] : [value];
  }, []);

// 使用：xcli -c a -c b -c c
// 结果：{ config: ['a', 'b', 'c'] }
```

### 2.4 子命令与嵌套

```javascript
const { program, Command } = require('commander');

// ─────────────────────────────────────────────────────────────────────────────────
// 独立子命令
// ─────────────────────────────────────────────────────────────────────────────────

const git = new Command('git');
git
  .command('clone <url>')
  .description('克隆仓库')
  .action((url) => {
    console.log(`克隆仓库: ${url}`);
  });

git
  .command('push')
  .description('推送代码')
  .action(() => {
    console.log('推送代码...');
  });

program.addCommand(git);

// 使用：xcli git clone https://github.com/user/repo

// ─────────────────────────────────────────────────────────────────────────────────
// 嵌套命令
// ─────────────────────────────────────────────────────────────────────────────────

const npm = program.command('npm');

npm
  .command('install [packages...]')
  .alias('i')
  .description('安装依赖')
  .option('-D, --save-dev', '开发依赖')
  .action((packages, options) => {
    console.log('安装:', packages, options);
  });

npm
  .command('run <script>')
  .description('运行脚本')
  .action((script) => {
    console.log(`运行: ${script}`);
  });

// 使用：xcli npm install react vue
// 使用：xcli npm run build
```

### 2.5 帮助信息定制

```javascript
const { program } = require('commander');

// ─────────────────────────────────────────────────────────────────────────────────
// 自定义帮助
// ─────────────────────────────────────────────────────────────────────────────────

program
  .addHelpText('before', '\n欢迎使用 xcli 脚手架工具\n')
  .addHelpText('after', '\n更多帮助请访问: https://github.com/jserxiao/xcli\n');

// ─────────────────────────────────────────────────────────────────────────────────
// 自定义帮助选项
// ─────────────────────────────────────────────────────────────────────────────────

program
  .helpOption('-h, --help', '显示帮助信息');

// ─────────────────────────────────────────────────────────────────────────────────
// 隐藏命令
// ─────────────────────────────────────────────────────────────────────────────────

program
  .command('internal')
  .description('内部命令')
  .helpOption(false)               // 隐藏帮助选项
  .hidden()                        // 隐藏命令
  .action(() => {
    console.log('内部命令');
  });

// ─────────────────────────────────────────────────────────────────────────────────
// 事件监听
// ─────────────────────────────────────────────────────────────────────────────────

program.on('--help', () => {
  console.log('\n示例:');
  console.log('  $ xcli create my-app');
  console.log('  $ xcli create my-app -t react');
});

program.on('option:debug', () => {
  process.env.DEBUG = 'true';
});
```

---

## 3. Inquirer - 交互式提示

> Inquirer.js 是最流行的命令行交互库，提供了丰富的交互类型和灵活的配置选项。

### 3.1 基本使用

```javascript
const inquirer = require('inquirer');

// 基本问答
const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称:',
    default: 'my-project'
  }
]);

console.log(answers.projectName);
```

### 3.2 提示类型详解

```javascript
const inquirer = require('inquirer');

// ─────────────────────────────────────────────────────────────────────────────────
// input - 输入框
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'input',
  name: 'name',
  message: '项目名称:',
  default: 'my-project',
  
  // 验证
  validate: (input) => {
    if (!input.trim()) {
      return '项目名称不能为空';
    }
    if (!/^[a-z0-9-_]+$/.test(input)) {
      return '只能包含小写字母、数字、中划线和下划线';
    }
    return true;
  },
  
  // 过滤
  filter: (input) => {
    return input.trim().toLowerCase();
  },
  
  // 转换显示
  transformer: (input) => {
    return chalk.cyan(input);
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// number - 数字输入
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'number',
  name: 'port',
  message: '端口号:',
  default: 3000,
  
  validate: (input) => {
    if (input < 1024 || input > 65535) {
      return '端口号必须在 1024-65535 之间';
    }
    return true;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// password - 密码输入
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'password',
  name: 'token',
  message: '请输入访问令牌:',
  mask: '*'  // 掩码字符
}

// ─────────────────────────────────────────────────────────────────────────────────
// confirm - 确认
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'confirm',
  name: 'useTS',
  message: '是否使用 TypeScript?',
  default: true
}

// ─────────────────────────────────────────────────────────────────────────────────
// list - 单选列表
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'list',
  name: 'framework',
  message: '请选择框架:',
  
  // 选项数组
  choices: [
    'React',
    'Vue',
    'Angular'
  ],
  
  // 或对象数组
  choices: [
    { name: 'React', value: 'react' },
    { name: 'Vue', value: 'vue', disabled: '维护中' },
    { name: 'Angular', value: 'angular' }
  ],
  
  // 分组
  choices: [
    new inquirer.Separator('--- 前端框架 ---'),
    { name: 'React', value: 'react' },
    { name: 'Vue', value: 'vue' },
    new inquirer.Separator('--- 其他 ---'),
    { name: 'Svelte', value: 'svelte' }
  ],
  
  default: 'react'
}

// ─────────────────────────────────────────────────────────────────────────────────
// rawlist - 带序号的列表
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'rawlist',
  name: 'version',
  message: '请选择版本:',
  choices: ['1.0.0', '2.0.0', '3.0.0'],
  default: 0  // 默认选第一项
}

// ─────────────────────────────────────────────────────────────────────────────────
// checkbox - 多选
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'checkbox',
  name: 'features',
  message: '选择需要的功能:',
  
  choices: [
    { name: 'TypeScript', value: 'ts', checked: true },  // 默认选中
    { name: 'ESLint', value: 'eslint', checked: true },
    { name: 'Prettier', value: 'prettier' },
    { name: 'Husky', value: 'husky' }
  ],
  
  validate: (answer) => {
    if (answer.length < 1) {
      return '请至少选择一个功能';
    }
    return true;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// expand - 展开式选择
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'expand',
  name: 'action',
  message: '文件已存在，请选择操作:',
  choices: [
    { key: 'o', name: '覆盖', value: 'overwrite' },
    { key: 'a', name: '覆盖全部', value: 'overwrite_all' },
    { key: 's', name: '跳过', value: 'skip' },
    { key: 'x', name: '中止', value: 'abort' }
  ],
  default: 'o'
}

// ─────────────────────────────────────────────────────────────────────────────────
// editor - 编辑器
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'editor',
  name: 'description',
  message: '请输入项目描述:',
  default: '# 项目描述\n\n请填写项目描述...'
}
```

### 3.3 动态问题

```javascript
const inquirer = require('inquirer');

// ─────────────────────────────────────────────────────────────────────────────────
// 根据条件显示问题
// ─────────────────────────────────────────────────────────────────────────────────

const answers = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'useCustomConfig',
    message: '是否使用自定义配置?',
    default: false
  },
  {
    type: 'input',
    name: 'configPath',
    message: '配置文件路径:',
    
    // 条件：仅当 useCustomConfig 为 true 时显示
    when: (answers) => {
      return answers.useCustomConfig;
    }
  }
]);

// ─────────────────────────────────────────────────────────────────────────────────
// 动态选项
// ─────────────────────────────────────────────────────────────────────────────────

const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'framework',
    message: '选择框架:',
    choices: ['react', 'vue', 'angular']
  },
  {
    type: 'list',
    name: 'variant',
    message: '选择变体:',
    
    // 根据前一个答案动态生成选项
    choices: (answers) => {
      const base = answers.framework;
      const variants = [
        { name: 'JavaScript', value: base },
        { name: 'TypeScript', value: `${base}-ts` }
      ];
      
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

// ─────────────────────────────────────────────────────────────────────────────────
// 异步验证
// ─────────────────────────────────────────────────────────────────────────────────

{
  type: 'input',
  name: 'projectName',
  message: '项目名称:',
  validate: async (input) => {
    if (!input) return '项目名称不能为空';
    
    // 检查是否已存在
    const exists = await fs.pathExists(input);
    if (exists) {
      return `目录 ${input} 已存在`;
    }
    
    return true;
  }
}
```

### 3.4 底部界面与进度

```javascript
const inquirer = require('inquirer');
const chalk = require('chalk');

// ─────────────────────────────────────────────────────────────────────────────────
// 底部提示
// ─────────────────────────────────────────────────────────────────────────────────

const prompts = new inquirer.ui.Prompt({
  input: process.stdin,
  output: process.stdout
});

// 更新底部提示
prompts.ui.bottomBar.updateBottomBar('正在处理...');

// ─────────────────────────────────────────────────────────────────────────────────
// 进度显示
// ─────────────────────────────────────────────────────────────────────────────────

const ui = new inquirer.ui.BottomBar();

// 更新进度
ui.updateBottomBar('进度: [##--------------] 20%');

// 完成后清理
ui.updateBottomBar('');
```

---

## 4. Chalk - 终端样式

> Chalk 是最流行的终端字符串样式库，支持颜色、背景色和多种文本样式。

### 4.1 颜色样式

```javascript
const chalk = require('chalk');

// ─────────────────────────────────────────────────────────────────────────────────
// 前景色
// ─────────────────────────────────────────────────────────────────────────────────

console.log(chalk.black('黑色'));
console.log(chalk.red('红色'));
console.log(chalk.green('绿色'));
console.log(chalk.yellow('黄色'));
console.log(chalk.blue('蓝色'));
console.log(chalk.magenta('品红色'));
console.log(chalk.cyan('青色'));
console.log(chalk.white('白色'));
console.log(chalk.gray('灰色'));        // 或 grey
console.log(chalk.blackBright('亮黑'));
console.log(chalk.redBright('亮红'));
console.log(chalk.greenBright('亮绿'));

// ─────────────────────────────────────────────────────────────────────────────────
// 背景色
// ─────────────────────────────────────────────────────────────────────────────────

console.log(chalk.bgBlack('黑色背景'));
console.log(chalk.bgRed('红色背景'));
console.log(chalk.bgGreen('绿色背景'));
console.log(chalk.bgYellow('黄色背景'));
console.log(chalk.bgBlue('蓝色背景'));
console.log(chalk.bgCyan('青色背景'));
console.log(chalk.bgWhite('白色背景'));

// ─────────────────────────────────────────────────────────────────────────────────
// RGB 颜色
// ─────────────────────────────────────────────────────────────────────────────────

console.log(chalk.rgb(255, 100, 100)('自定义颜色'));
console.log(chalk.bgRgb(50, 50, 50)('自定义背景'));

// ─────────────────────────────────────────────────────────────────────────────────
// Hex 颜色
// ─────────────────────────────────────────────────────────────────────────────────

console.log(chalk.hex('#FF6B6B')('Hex 颜色'));
console.log(chalk.bgHex('#333333')('Hex 背景'));
```

### 4.2 文本样式

```javascript
const chalk = require('chalk');

// ─────────────────────────────────────────────────────────────────────────────────
// 基础样式
// ─────────────────────────────────────────────────────────────────────────────────

console.log(chalk.bold('加粗'));
console.log(chalk.dim('变暗'));
console.log(chalk.italic('斜体'));
console.log(chalk.underline('下划线'));
console.log(chalk.overline('上划线'));
console.log(chalk.strikethrough('删除线'));
console.log(chalk.hidden('隐藏'));
console.log(chalk.visible('可见'));

// ─────────────────────────────────────────────────────────────────────────────────
// 组合样式
// ─────────────────────────────────────────────────────────────────────────────────

console.log(chalk.bold.red('加粗红色'));
console.log(chalk.underline.green('绿色下划线'));
console.log(chalk.bgYellow.blue.bold('蓝字黄底加粗'));

// 链式调用
console.log(
  chalk
    .bold
    .bgBlue
    .yellow
    .underline('复杂样式')
);
```

### 4.3 模板字符串

```javascript
const chalk = require('chalk');

// ─────────────────────────────────────────────────────────────────────────────────
// 基础模板
// ─────────────────────────────────────────────────────────────────────────────────

console.log(chalk`{red 红色文字}`);
console.log(chalk`{green 绿色} {blue 蓝色}`);
console.log(chalk`{bold 加粗} {underline 下划线}`);
console.log(chalk`{bgYellow 黄色背景}`);

// ─────────────────────────────────────────────────────────────────────────────────
// 组合模板
// ─────────────────────────────────────────────────────────────────────────────────

console.log(chalk`{bold.red 加粗红色}`);
console.log(chalk`{bgYellow.blue 蓝字黄底}`);

// ─────────────────────────────────────────────────────────────────────────────────
// 插值
// ─────────────────────────────────────────────────────────────────────────────────

const name = 'xcli';
const version = '1.0.0';

console.log(chalk`{cyan ${name}} version: {green ${version}}`);
```

### 4.4 实际应用

```javascript
const chalk = require('chalk');
const logSymbols = require('log-symbols');

// ─────────────────────────────────────────────────────────────────────────────────
// 日志工具封装
// ─────────────────────────────────────────────────────────────────────────────────

const logger = {
  info(msg) {
    console.log(logSymbols.info, chalk.blue(msg));
  },
  
  success(msg) {
    console.log(logSymbols.success, chalk.green(msg));
  },
  
  warn(msg) {
    console.log(logSymbols.warning, chalk.yellow(msg));
  },
  
  error(msg) {
    console.log(logSymbols.error, chalk.red(msg));
  },
  
  title(msg) {
    console.log('\n' + chalk.bold.cyan(msg) + '\n');
  },
  
  step(step, total, msg) {
    console.log(chalk.gray(`[${step}/${total}]`), msg);
  }
};

// ─────────────────────────────────────────────────────────────────────────────────
// 使用示例
// ─────────────────────────────────────────────────────────────────────────────────

logger.title('xcli - 项目脚手架工具');
logger.step(1, 5, '检查项目目录...');
logger.step(2, 5, '下载模板...');
logger.step(3, 5, '生成项目文件...');
logger.step(4, 5, '安装依赖...');
logger.step(5, 5, '初始化 Git...');
logger.success('项目创建成功！');
```

---

## 5. Ora - Loading 动画

> Ora 提供优雅的终端 Loading 动画，支持多种内置样式和自定义动画。

### 5.1 基本使用

```javascript
const ora = require('ora');

// ─────────────────────────────────────────────────────────────────────────────────
// 基础用法
// ─────────────────────────────────────────────────────────────────────────────────

const spinner = ora('正在加载...').start();

setTimeout(() => {
  spinner.succeed('加载成功');
  // spinner.fail('加载失败');
  // spinner.warn('警告信息');
  // spinner.info('提示信息');
}, 2000);

// ─────────────────────────────────────────────────────────────────────────────────
// 不同状态
// ─────────────────────────────────────────────────────────────────────────────────

const spinner = ora('处理中...');

spinner.start();    // 开始
spinner.stop();     // 停止（清除）
spinner.succeed();  // 成功 ✓
spinner.fail();     // 失败 ✗
spinner.warn();     // 警告 ⚠
spinner.info();     // 信息 ℹ

// 带消息
spinner.succeed('操作成功');
spinner.fail('操作失败');

// ─────────────────────────────────────────────────────────────────────────────────
// 更新文字
// ─────────────────────────────────────────────────────────────────────────────────

const spinner = ora('正在加载...');
spinner.start();

setTimeout(() => {
  spinner.text = '正在处理...';
}, 1000);

setTimeout(() => {
  spinner.succeed('完成');
}, 2000);
```

### 5.2 样式配置

```javascript
const ora = require('ora');

// ─────────────────────────────────────────────────────────────────────────────────
// 内置样式
// ─────────────────────────────────────────────────────────────────────────────────

const spinners = [
  'dots', 'dots2', 'dots3', 'dots4', 'dots5', 'dots6', 'dots7', 'dots8',
  'line', 'line2', 'pipe', 'simpleDots', 'simpleDotsScrolling',
  'star', 'star2', 'flip', 'hamburger', 'growVertical', 'growHorizontal',
  'balloon', 'balloon2', 'bounce', 'bounce2', 'triangle', 'arc',
  'circle', 'squareCorners', 'circleQuarters', 'circleHalves',
  'squish', 'toggle', 'toggle2', 'toggle3', 'toggle4', 'toggle5',
  'toggle6', 'toggle7', 'toggle8', 'toggle9', 'toggle10', 'toggle11',
  'toggle12', 'toggle13', 'arrow', 'arrow2', 'arrow3',
  'bouncingBar', 'bouncingBall', 'smiley', 'monkey', 'hearts',
  'clock', 'earth', 'moon', 'runner', 'pong', 'shark', 'dqpb'
];

spinners.forEach(name => {
  ora({ text: name, spinner: name }).start();
});

// ─────────────────────────────────────────────────────────────────────────────────
// 颜色配置
// ─────────────────────────────────────────────────────────────────────────────────

const spinner = ora({
  text: '正在处理...',
  spinner: 'dots',
  color: 'cyan'  // black, red, green, yellow, blue, magenta, cyan, white, gray
});

// ─────────────────────────────────────────────────────────────────────────────────
// 自定义动画
// ─────────────────────────────────────────────────────────────────────────────────

const spinner = ora({
  text: '处理中...',
  spinner: {
    frames: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],
    interval: 200  // 帧间隔（毫秒）
  }
});

// ─────────────────────────────────────────────────────────────────────────────────
// 其他配置
// ─────────────────────────────────────────────────────────────────────────────────

const spinner = ora({
  text: '正在处理...',
  spinner: 'dots',
  color: 'cyan',
  indent: 2,              // 缩进
  prefixText: '> ',       // 前缀文本
  suffixText: ' (请稍候)', // 后缀文本
  hideCursor: true,       // 隐藏光标
  discardStdin: true      // 丢弃标准输入
});
```

### 5.3 实际应用

```javascript
const ora = require('ora');
const chalk = require('chalk');
const execa = require('execa');

/**
 * 安装依赖
 */
async function installDependencies(projectDir, packageManager = 'npm') {
  const spinner = ora({
    text: chalk.blue('正在安装依赖...'),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    await execa(packageManager, ['install'], {
      cwd: projectDir,
      stdio: 'ignore'
    });
    
    spinner.succeed(chalk.green('依赖安装成功'));
    return true;
  } catch (error) {
    spinner.fail(chalk.red('依赖安装失败'));
    console.log(chalk.yellow('请手动运行: ' + packageManager + ' install'));
    return false;
  }
}

/**
 * 多步骤处理
 */
async function createProject(config) {
  const steps = [
    { name: '检查目录', action: checkDirectory },
    { name: '下载模板', action: downloadTemplate },
    { name: '生成文件', action: generateFiles },
    { name: '安装依赖', action: installDependencies },
    { name: '初始化 Git', action: initGit }
  ];
  
  const spinner = ora();
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    spinner.start(chalk.gray(`[${i + 1}/${steps.length}] `) + step.name + '...');
    
    try {
      await step.action(config);
      spinner.succeed();
    } catch (error) {
      spinner.fail();
      throw error;
    }
  }
}
```

---

## 6. fs-extra - 文件操作

> fs-extra 是 Node.js 内置 fs 模块的增强版，支持 Promise 和更多便捷方法。

### 6.1 基本操作

```javascript
const fs = require('fs-extra');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────────
// 文件读写
// ─────────────────────────────────────────────────────────────────────────────────

// 读取文件
const content = await fs.readFile('file.txt', 'utf-8');

// 写入文件
await fs.writeFile('file.txt', 'Hello World');

// 追加内容
await fs.appendFile('file.txt', '\nNew line');

// 确保文件存在
await fs.ensureFile('path/to/file.txt');

// ─────────────────────────────────────────────────────────────────────────────────
// 目录操作
// ─────────────────────────────────────────────────────────────────────────────────

// 创建目录（递归）
await fs.ensureDir('path/to/dir');

// 确保目录为空
await fs.emptyDir('path/to/dir');

// 读取目录
const files = await fs.readdir('path/to/dir');

// 判断是否存在
const exists = await fs.pathExists('path/to/check');

// ─────────────────────────────────────────────────────────────────────────────────
// 复制移动
// ─────────────────────────────────────────────────────────────────────────────────

// 复制文件
await fs.copy('src.txt', 'dest.txt');

// 复制目录
await fs.copy('src-dir', 'dest-dir', {
  overwrite: true,
  filter: (src) => {
    // 过滤不需要复制的文件
    return !src.includes('node_modules');
  }
});

// 移动文件/目录
await fs.move('src', 'dest', {
  overwrite: true
});

// ─────────────────────────────────────────────────────────────────────────────────
// 删除操作
// ─────────────────────────────────────────────────────────────────────────────────

// 删除文件/目录
await fs.remove('path/to/delete');

// 清空目录（保留目录本身）
await fs.emptyDir('path/to/empty');
```

### 6.2 JSON 操作

```javascript
const fs = require('fs-extra');

// ─────────────────────────────────────────────────────────────────────────────────
// JSON 读写
// ─────────────────────────────────────────────────────────────────────────────────

// 读取 JSON
const pkg = await fs.readJson('package.json');

// 写入 JSON
await fs.writeJson('data.json', { name: 'test' }, { spaces: 2 });

// 读取 JSON（文件不存在返回默认值）
const config = await fs.readJson('config.json', { throws: false }) || {};

// ─────────────────────────────────────────────────────────────────────────────────
// package.json 操作
// ─────────────────────────────────────────────────────────────────────────────────

const pkgPath = 'package.json';
const pkg = await fs.readJson(pkgPath);

// 添加依赖
pkg.dependencies = pkg.dependencies || {};
pkg.dependencies.lodash = '^4.17.21';

// 添加脚本
pkg.scripts = pkg.scripts || {};
pkg.scripts.build = 'vite build';

await fs.writeJson(pkgPath, pkg, { spaces: 2 });
```

### 6.3 模板处理

```javascript
const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const globby = require('globby');

/**
 * 模板渲染器
 */
class TemplateRenderer {
  constructor(templateDir, targetDir) {
    this.templateDir = templateDir;
    this.targetDir = targetDir;
  }
  
  /**
   * 渲染模板文件
   */
  async render(templateData) {
    // 获取所有模板文件
    const files = await globby('**/*', {
      cwd: this.templateDir,
      dot: true,
      ignore: ['**/node_modules/**']
    });
    
    for (const file of files) {
      await this.renderFile(file, templateData);
    }
  }
  
  /**
   * 渲染单个文件
   */
  async renderFile(file, data) {
    const srcPath = path.join(this.templateDir, file);
    const destPath = path.join(this.targetDir, this.getDestPath(file, data));
    
    // 检查是否是模板文件
    if (file.endsWith('.ejs')) {
      const content = await fs.readFile(srcPath, 'utf-8');
      const result = ejs.render(content, data);
      
      await fs.ensureDir(path.dirname(destPath));
      await fs.writeFile(destPath, result);
    } else {
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(srcPath, destPath);
    }
  }
  
  /**
   * 获取目标路径（处理文件名中的变量）
   */
  getDestPath(file, data) {
    return file
      .replace(/\.ejs$/, '')
      .replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
  }
}

// 使用示例
const renderer = new TemplateRenderer(
  path.join(__dirname, 'templates/react'),
  path.join(process.cwd(), 'my-project')
);

await renderer.render({
  name: 'my-project',
  author: 'John Doe',
  description: 'My React Project'
});
```

---

## 7. 其他重要工具

### 7.1 execa - 子进程执行

```javascript
const execa = require('execa');

// ─────────────────────────────────────────────────────────────────────────────────
// 基本用法
// ─────────────────────────────────────────────────────────────────────────────────

// 执行命令
const { stdout } = await execa('echo', ['hello']);
console.log(stdout); // 'hello'

// 执行 npm 命令
await execa('npm', ['install'], { cwd: './project' });

// ─────────────────────────────────────────────────────────────────────────────────
// 流式输出
// ─────────────────────────────────────────────────────────────────────────────────

const subprocess = execa('npm', ['run', 'dev']);

// 实时输出
subprocess.stdout.pipe(process.stdout);
subprocess.stderr.pipe(process.stderr);

await subprocess;

// ─────────────────────────────────────────────────────────────────────────────────
// 常用场景
// ─────────────────────────────────────────────────────────────────────────────────

// Git 操作
await execa('git', ['init'], { cwd: projectDir });
await execa('git', ['add', '.'], { cwd: projectDir });
await execa('git', ['commit', '-m', 'Initial commit'], { cwd: projectDir });

// 安装依赖
await execa('npm', ['install'], { cwd: projectDir });
await execa('pnpm', ['install'], { cwd: projectDir });
await execa('yarn', [], { cwd: projectDir });

// 检测命令是否可用
async function isCommandAvailable(command) {
  try {
    await execa(command, ['--version']);
    return true;
  } catch {
    return false;
  }
}

const hasGit = await isCommandAvailable('git');
const hasPnpm = await isCommandAvailable('pnpm');
```

### 7.2 semver - 版本控制

```javascript
const semver = require('semver');

// ─────────────────────────────────────────────────────────────────────────────────
// 版本解析
// ─────────────────────────────────────────────────────────────────────────────────

const version = semver.parse('1.2.3-beta.1+build.123');
// {
//   major: 1,
//   minor: 2,
//   patch: 3,
//   prerelease: ['beta', 1],
//   build: ['build', 123]
// }

// ─────────────────────────────────────────────────────────────────────────────────
// 版本比较
// ─────────────────────────────────────────────────────────────────────────────────

semver.gt('1.2.3', '1.2.2');    // true
semver.lt('1.2.3', '1.2.4');    // true
semver.gte('1.2.3', '1.2.3');   // true
semver.lte('1.2.3', '1.2.4');   // true
semver.eq('1.2.3', '1.2.3');    // true
semver.neq('1.2.3', '1.2.4');   // true

// ─────────────────────────────────────────────────────────────────────────────────
// 版本范围匹配
// ─────────────────────────────────────────────────────────────────────────────────

semver.satisfies('1.2.3', '^1.0.0');  // true
semver.satisfies('2.0.0', '^1.0.0');  // false
semver.satisfies('1.2.3', '~1.2.0');  // true
semver.satisfies('1.3.0', '~1.2.0');  // false

// ─────────────────────────────────────────────────────────────────────────────────
// 版本递增
// ─────────────────────────────────────────────────────────────────────────────────

semver.inc('1.2.3', 'patch');      // '1.2.4'
semver.inc('1.2.3', 'minor');      // '1.3.0'
semver.inc('1.2.3', 'major');      // '2.0.0'
semver.inc('1.2.3', 'prerelease'); // '1.2.4-0'

// ─────────────────────────────────────────────────────────────────────────────────
// 版本比较（排序）
// ─────────────────────────────────────────────────────────────────────────────────

const versions = ['1.2.3', '1.0.0', '2.0.0', '1.1.0'];
versions.sort(semver.compare);     // ['1.0.0', '1.1.0', '1.2.3', '2.0.0']
versions.sort(semver.rcompare);    // ['2.0.0', '1.2.3', '1.1.0', '1.0.0']

// ─────────────────────────────────────────────────────────────────────────────────
// 获取最新版本
// ─────────────────────────────────────────────────────────────────────────────────

const validVersions = ['1.0.0', '1.2.3', '2.0.0-beta', '1.1.0'];
semver.maxSatisfying(validVersions, '*');           // '2.0.0-beta'
semver.maxSatisfying(validVersions, '>=1.0.0 <2.0.0'); // '1.2.3'
```

### 7.3 download-git-repo - Git 仓库下载

```javascript
const download = require('download-git-repo');
const fs = require('fs-extra');

/**
 * 下载 Git 模板
 */
function downloadTemplate(repo, dest, options = {}) {
  return new Promise((resolve, reject) => {
    download(repo, dest, { clone: options.clone || false }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(dest);
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────────
// 不同来源格式
// ─────────────────────────────────────────────────────────────────────────────────

// GitHub - github:owner/repo 或 owner/repo
await downloadTemplate('github:jserxiao/xcli-template', './temp');

// GitLab - gitlab:owner/repo
await downloadTemplate('gitlab:jserxiao/xcli-template', './temp');

// Bitbucket - bitbucket:owner/repo
await downloadTemplate('bitbucket:jserxiao/xcli-template', './temp');

// 直接 URL - direct:url
await downloadTemplate('direct:https://github.com/jserxiao/xcli-template/archive/main.zip', './temp');

// ─────────────────────────────────────────────────────────────────────────────────
// 指定分支/标签
// ─────────────────────────────────────────────────────────────────────────────────

// 指定分支
await downloadTemplate('github:jserxiao/xcli-template#develop', './temp');

// 指定标签
await downloadTemplate('github:jserxiao/xcli-template#v1.0.0', './temp');

// ─────────────────────────────────────────────────────────────────────────────────
// 使用 clone 模式
// ─────────────────────────────────────────────────────────────────────────────────

await downloadTemplate('github:jserxiao/xcli-template', './temp', { clone: true });
```

---

## 8. 工具库选型对比

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  CLI 工具库选型对比                                                                    │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  命令行框架                                                                            │
│  ┌───────────┬─────────────┬─────────────┬─────────────┬─────────────────────────┐   │
│  │  特性     │  commander  │   yargs     │   oclif     │    cac                  │   │
│  ├───────────┼─────────────┼─────────────┼─────────────┼─────────────────────────┤   │
│  │ 学习曲线  │    简单     │    中等     │    陡峭     │    简单                 │   │
│  │ 功能丰富  │    中等     │    丰富     │    最丰富   │    基础                 │   │
│  │ TypeScript│   支持      │   支持      │   原生      │   支持                  │   │
│  │ 子命令    │   支持      │   支持      │   完善      │   支持                  │   │
│  │ 插件系统  │    无       │    无       │   完善      │    无                   │   │
│  │ 适用场景  │  中小型项目 │  中大型项目 │  企业级项目 │  小型项目/脚本          │   │
│  └───────────┴─────────────┴─────────────┴─────────────┴─────────────────────────┘   │
│                                                                                       │
│  交互提示                                                                              │
│  ┌───────────┬─────────────┬─────────────┬─────────────┐                             │
│  │  特性     │  inquirer   │  prompts    │  enquirer   │                             │
│  ├───────────┼─────────────┼─────────────┼─────────────┤                             │
│  │ 交互类型  │    最多     │    适中     │    丰富     │                             │
│  │ 体积大小  │    较大     │    最小     │    中等     │                             │
│  │ 学习曲线  │    简单     │    简单     │    中等     │                             │
│  │ TypeScript│   支持      │   原生      │   支持      │                             │
│  │ 推荐度    │   ⭐⭐⭐     │   ⭐⭐⭐     │   ⭐⭐       │                             │
│  └───────────┴─────────────┴─────────────┴─────────────┘                             │
│                                                                                       │
│  模板引擎                                                                              │
│  ┌───────────┬─────────────┬─────────────┬─────────────┐                             │
│  │  特性     │    ejs      │  handlebars │  art-template│                            │
│  ├───────────┼─────────────┼─────────────┼─────────────┤                             │
│  │ 语法风格  │   ERB 风格  │  Mustache   │  类似 JSP   │                             │
│  │ 性能      │    中等     │    中等     │    最高     │                             │
│  │ 学习曲线  │    简单     │    简单     │    中等     │                             │
│  │ 功能丰富  │    中等     │    丰富     │    丰富     │                             │
│  │ 推荐度    │   ⭐⭐⭐     │   ⭐⭐⭐     │   ⭐⭐       │                             │
│  └───────────┴─────────────┴─────────────┴─────────────┘                             │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  CLI 工具库使用最佳实践                                                                │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  版本选择                                                                              │
│  □ chalk 使用 v4.x（ESM 问题）                                                        │
│  □ ora 使用 v5.x（ESM 问题）                                                          │
│  □ inquirer 使用 v8.x（ESM 问题）                                                     │
│  □ 如需使用最新版，确保项目使用 ESM                                                    │
│                                                                                       │
│  错误处理                                                                              │
│  □ 所有异步操作使用 try-catch                                                         │
│  □ 提供有意义的错误信息                                                               │
│  □ 使用 ora 显示操作状态                                                              │
│                                                                                       │
│  性能优化                                                                              │
│  □ 按需加载大模块                                                                      │
│  □ 并行执行独立任务                                                                    │
│  □ 使用缓存减少网络请求                                                               │
│                                                                                       │
│  类型安全                                                                              │
│  □ 使用 TypeScript 开发                                                               │
│  □ 安装 @types 类型定义                                                               │
│  □ 定义清晰的接口类型                                                                 │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md) | [上一章：开发流程](../开发流程/index.md) | [下一章：实战项目](../实战项目xcli/index.md)
