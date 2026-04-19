# 日志与美化

xcli 使用 Chalk 和 gradient-string 实现终端输出的美化，提供清晰的视觉反馈和良好的用户体验。

## 依赖说明

| 依赖 | 版本 | 用途 |
|------|------|------|
| chalk | ^5.3.0 | 终端文字颜色和样式 |
| gradient-string | ^3.0.0 | 渐变色文字效果 |

---

## Banner 展示

### 完整版 Banner

`showBanner()` 函数用于在 CLI 启动时展示完整的 ASCII Logo：

```typescript
import chalk from 'chalk';
import gradient from 'gradient-string';

/**
 * CLI Banner - 显示 XIAO Logo
 */
export function showBanner(): void {
  const xcliGradient = gradient(['#00d4ff', '#7c3aed', '#f472b6']);
  
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
  
  console.log(xcliGradient(banner));
  console.log();
}
```

**渲染效果**：

```
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
```

### 简洁版 Banner

`showMiniBanner()` 用于 `--help` 等场景，输出更紧凑：

```typescript
/**
 * 简洁版 Banner (用于 --help)
 */
export function showMiniBanner(): void {
  const xcliGradient = gradient(['#00d4ff', '#7c3aed', '#f472b6']);
  
  console.log();
  console.log(xcliGradient('   ██╗  ██╗██╗ ███████╗ ██████╗  ██████╗ ███████╗'));
  console.log(xcliGradient('   ╚██╗██╔╝██║ ██╔════╝██╔═══██╗██╔═══██╗██╔════╝'));
  console.log(xcliGradient('    ╚███╔╝ ██║ █████╗  ██║   ██║██║   ██║███████╗'));
  console.log(xcliGradient('    ██╔██╗ ██║ ██╔══╝  ██║   ██║██║   ██║╚════██║'));
  console.log(xcliGradient('   ██╔╝ ██╗██║██║     ╚██████╔╝╚██████╔╝███████║'));
  console.log(xcliGradient('   ╚═╝  ╚═╝╚═╝╚═╝      ╚═════╝  ╚═════╝ ╚══════╝'));
  console.log();
  console.log(chalk.gray('   🔧 可插拔的 TypeScript 项目脚手架工具'));
  console.log();
}
```

---

## 成功提示框

项目创建成功后，显示一个美观的提示框：

```typescript
/**
 * 成功完成提示
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
  
  console.log(chalk.green('┌' + '─'.repeat(boxWidth - 2) + '┐'));
  
  for (const line of lines) {
    const padding = boxWidth - 4 - getDisplayWidth(line);
    const rightPadding = padding > 0 ? ' '.repeat(padding) : '';
    console.log(chalk.green('│') + ' ' + line + rightPadding + ' ' + chalk.green('│'));
  }
  
  console.log(chalk.green('└' + '─'.repeat(boxWidth - 2) + '┘'));
  console.log();
}
```

### 中文字符宽度处理

由于中文字符在终端中占用两个字符宽度，需要特殊处理：

```typescript
/**
 * 计算字符串显示宽度（中文字符算2个宽度）
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
```

**渲染效果**：

```
┌──────────────────────────────────────────────────────────┐
│ 项目 my-react-app 创建成功!                               │
│                                                          │
│ 快速开始:                                                 │
│   cd my-react-app                                        │
│   pnpm run dev                                           │
│                                                          │
│ 可用脚本:                                                 │
│   pnpm run dev      启动开发服务器                        │
│   pnpm run build    构建生产版本                          │
│   pnpm run preview  预览生产构建                          │
└──────────────────────────────────────────────────────────┘
```

---

## 日志工具对象

`logger` 对象提供了统一的日志输出接口：

```typescript
/**
 * 日志工具
 */
export const logger = {
  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message);
  },

  success: (message: string) => {
    console.log(chalk.green('✓'), message);
  },

  warning: (message: string) => {
    console.log(chalk.yellow('⚠'), message);
  },

  error: (message: string) => {
    console.log(chalk.red('✗'), message);
  },

  title: (message: string) => {
    console.log();
    console.log(chalk.bold.cyan(message));
    console.log();
  },

  newline: () => {
    console.log();
  },

  step: (step: number, total: number, message: string) => {
    const prefix = chalk.gray(`[${step}/${total}]`);
    console.log(prefix, message);
  },
};
```

### 方法说明

| 方法 | 图标 | 颜色 | 用途 |
|------|------|------|------|
| `info` | ℹ | 蓝色 | 信息提示 |
| `success` | ✓ | 绿色 | 成功确认 |
| `warning` | ⚠ | 黄色 | 警告提示 |
| `error` | ✗ | 红色 | 错误提示 |
| `title` | - | 青色粗体 | 标题输出 |
| `newline` | - | - | 空行分隔 |
| `step` | - | 灰色 | 步骤进度 |

### 使用示例

```typescript
import { logger } from './utils/logger';

// 信息提示
logger.info('正在检查项目配置...');

// 成功提示
logger.success('项目初始化完成');

// 警告提示
logger.warning'.gitignore 文件已存在，跳过创建');

// 错误提示
logger.error('无法连接到 npm registry');

// 标题输出
logger.title('正在创建项目结构...');

// 步骤进度
logger.step(1, 5, '创建项目目录');
logger.step(2, 5, '生成配置文件');
logger.step(3, 5, '安装依赖');
```

---

## 渐变色效果

使用 `gradient-string` 创建渐变色文字：

```typescript
import gradient from 'gradient-string';

// 自定义渐变色
const xcliGradient = gradient(['#00d4ff', '#7c3aed', '#f472b6']);

// 应用渐变
console.log(xcliGradient('Hello, xcli!'));

// 使用预设渐变
const rainbow = gradient.rainbow('彩虹文字');
const atlas = gradient.atlas('Atlas 风格');
const summer = gradient('summer')('夏日风格');
```

### 渐变色配置

xcli 使用的渐变配色方案：

| 色值 | 描述 |
|------|------|
| `#00d4ff` | 青色起点 |
| `#7c3aed` | 紫色中间 |
| `#f472b6` | 粉色终点 |

---

## 实际应用场景

### 命令执行流程

```typescript
async function init(projectName: string) {
  showBanner();
  
  logger.title('项目初始化');
  
  logger.step(1, 4, '创建项目目录');
  await createProjectDir(projectName);
  logger.success('目录创建完成');
  
  logger.step(2, 4, '生成项目文件');
  await generateFiles(projectName);
  logger.success('文件生成完成');
  
  logger.step(3, 4, '安装依赖');
  await installDependencies(projectName);
  logger.success('依赖安装完成');
  
  logger.step(4, 4, '初始化 Git');
  await initGit(projectName);
  logger.success('Git 初始化完成');
  
  showSuccessMessage(projectName);
}
```

### 错误处理

```typescript
try {
  await riskyOperation();
  logger.success('操作成功');
} catch (error) {
  logger.error(`操作失败: ${error.message}`);
  process.exit(1);
}
```

---

## 最佳实践

### 1. 统一使用 logger 对象

```typescript
// ✅ 推荐
logger.info('开始构建...');
logger.success('构建完成');

// ❌ 不推荐
console.log('开始构建...');
console.log('构建完成');
```

### 2. 合理使用图标和颜色

```typescript
// 信息类使用 info
logger.info('正在下载模板...');

// 确认类使用 success
logger.success('模板下载完成');

// 注意类使用 warning
logger.warning('配置文件已存在，将被覆盖');

// 错误类使用 error
logger.error('网络连接失败');
```

### 3. 步骤进度清晰

```typescript
// 对于多步骤任务，使用 step 标记进度
const steps = ['创建目录', '生成文件', '安装依赖', '初始化 Git'];

steps.forEach((step, index) => {
  logger.step(index + 1, steps.length, step);
});
```

---

## 总结

xcli 的日志与美化模块提供了：

1. **视觉吸引力**：渐变色 Logo 和美观的提示框
2. **信息层次**：不同类型的消息使用不同的颜色和图标
3. **进度反馈**：步骤计数帮助用户了解任务进度
4. **中文支持**：正确处理中文字符宽度，确保排版整齐

这套日志系统为 CLI 工具提供了专业、友好的用户交互体验。
