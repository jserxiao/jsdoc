# upgrade 命令详解

`upgrade` 命令用于检查和升级 xcli 到最新版本。

## 命令定义

```typescript
// src/index.ts
program
  .command('upgrade')
  .alias('up')
  .description('升级 xcli 到最新版本')
  .option('-c, --check', '仅检查是否有更新，不执行升级')
  .option('-t, --tag <tag>', '指定升级到的标签 (latest/next/beta等)')
  .action(async (options) => {
    await upgrade(options);
  });

// version 命令
program
  .command('version')
  .alias('v')
  .description('显示 xcli 版本信息')
  .action(async () => {
    await showVersion();
  });
```

---

## 版本信息获取

### 从 package.json 读取版本

```typescript
import packageJson from '../../package.json' assert { type: 'json' };

const CURRENT_VERSION = packageJson.version;
const PACKAGE_NAME = packageJson.name;
```

### 获取 npm 最新版本

```typescript
async function getLatestVersion(packageName: string): Promise<string> {
  try {
    const { stdout } = await execa('npm', ['view', packageName, 'version'], {
      timeout: 30000,
    });
    return stdout.trim();
  } catch (error) {
    throw new Error(`无法获取 ${packageName} 的最新版本`);
  }
}
```

### 获取所有标签版本

```typescript
interface NpmDistTag {
  latest: string;
  [key: string]: string;
}

async function getDistTags(packageName: string): Promise<NpmDistTag> {
  try {
    const { stdout } = await execa('npm', [
      'view', packageName, 'dist-tags', '--json'
    ], {
      timeout: 30000,
    });
    return JSON.parse(stdout);
  } catch {
    return { latest: CURRENT_VERSION };
  }
}
```

---

## 版本比较

```typescript
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
```

### 示例

```typescript
compareVersions('1.0.0', '1.0.1');  // -1
compareVersions('1.1.0', '1.0.1');  // 1
compareVersions('1.0.0', '1.0.0');  // 0
```

---

## 全局安装检测

### 检查是否全局安装

```typescript
async function isGlobalInstall(packageName: string): Promise<boolean> {
  try {
    const { stdout } = await execa('npm', [
      'list', '-g', packageName, '--depth=0'
    ], {
      timeout: 10000,
    });
    return stdout.includes(packageName);
  } catch {
    return false;
  }
}
```

### 获取全局安装版本

```typescript
async function getGlobalVersion(packageName: string): Promise<string | null> {
  try {
    const { stdout } = await execa('npm', [
      'list', '-g', packageName, '--depth=0', '--json'
    ], {
      timeout: 10000,
    });
    const result = JSON.parse(stdout);
    return result.dependencies?.[packageName]?.version || null;
  } catch {
    return null;
  }
}
```

---

## 升级执行

```typescript
async function upgradePackage(packageName: string, version?: string): Promise<void> {
  const packageSpec = version 
    ? `${packageName}@${version}` 
    : `${packageName}@latest`;
  
  const spinner = ora(`正在升级 ${packageSpec}...`).start();
  
  try {
    await execa('npm', ['install', '-g', packageSpec], {
      timeout: 120000,  // 2 分钟超时
    });
    spinner.succeed(`升级成功: ${packageSpec}`);
  } catch (error) {
    spinner.fail(`升级失败: ${(error as Error).message}`);
    throw error;
  }
}
```

---

## 检查更新

```typescript
async function checkForUpdate(): Promise<{
  hasUpdate: boolean;
  current: string;
  latest: string;
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
```

---

## 显示版本信息

```typescript
function displayVersionInfo(
  current: string,
  latest: string,
  hasUpdate: boolean
): void {
  console.log();
  console.log(chalk.blue('📦 xcli 版本信息'));
  console.log(chalk.gray('─'.repeat(30)));
  console.log(`  当前版本: ${chalk.cyan(`v${current}`)}`);
  console.log(`  最新版本: ${hasUpdate 
    ? chalk.green(`v${latest}`) 
    : chalk.cyan(`v${latest}`)}`);
  
  if (hasUpdate) {
    console.log();
    console.log(chalk.yellow('🎉 发现新版本!'));
  } else {
    console.log();
    console.log(chalk.green('✅ 已是最新版本'));
  }
  console.log();
}
```

---

## 主函数实现

```typescript
export async function upgrade(options: {
  check?: boolean;
  tag?: string;
}): Promise<void> {
  try {
    // 1. 如果只是检查更新
    if (options.check) {
      const { current, latest, hasUpdate } = await checkForUpdate();
      displayVersionInfo(current, latest, hasUpdate);
      
      if (hasUpdate) {
        console.log(chalk.gray('运行 `xcli upgrade` 来升级到最新版本'));
      }
      return;
    }

    // 2. 如果指定了标签
    if (options.tag) {
      const tags = await getDistTags(PACKAGE_NAME);
      const targetVersion = tags[options.tag];
      
      if (!targetVersion) {
        logger.error(`未找到标签 "${options.tag}"`);
        logger.info(`可用标签: ${Object.keys(tags).join(', ')}`);
        return;
      }
      
      console.log(chalk.blue(
        `正在升级到 ${options.tag} 版本 (v${targetVersion})...`
      ));
      await upgradePackage(PACKAGE_NAME, targetVersion);
      return;
    }

    // 3. 正常升级流程
    const { current, latest, hasUpdate } = await checkForUpdate();
    displayVersionInfo(current, latest, hasUpdate);

    if (!hasUpdate) {
      return;
    }

    // 4. 执行升级
    console.log(chalk.cyan('开始升级...'));
    await upgradePackage(PACKAGE_NAME);
    
    // 5. 显示更新日志链接
    console.log();
    console.log(chalk.gray('查看更新日志:'));
    console.log(chalk.blue('  https://github.com/jserxiao/xcli/releases'));
    console.log();
    
  } catch (error) {
    logger.error(`升级失败: ${(error as Error).message}`);
    process.exit(1);
  }
}
```

---

## showVersion 函数

```typescript
export async function showVersion(): Promise<void> {
  console.log();
  console.log(chalk.blue('📦 xcli 版本信息'));
  console.log(chalk.gray('─'.repeat(30)));
  console.log(`  版本:     ${chalk.cyan(`v${CURRENT_VERSION}`)}`);
  console.log(`  包名:     ${chalk.gray(PACKAGE_NAME)}`);
  
  // 检查全局安装情况
  const isGlobal = await isGlobalInstall(PACKAGE_NAME);
  if (isGlobal) {
    const globalVersion = await getGlobalVersion(PACKAGE_NAME);
    console.log(`  全局版本: ${chalk.cyan(`v${globalVersion || 'unknown'}`)}`);
  }
  
  console.log();
}
```

---

## 使用示例

### 检查更新

```bash
# 仅检查是否有更新
xcli upgrade --check

# 简写
xcli up -c
```

输出示例：
```
📦 xcli 版本信息
──────────────────────────────
  当前版本: v1.0.20
  最新版本: v1.0.21

🎉 发现新版本!
运行 `xcli upgrade` 来升级到最新版本
```

### 升级到最新版本

```bash
# 升级到 latest 标签
xcli upgrade

# 简写
xcli up
```

输出示例：
```
📦 xcli 版本信息
──────────────────────────────
  当前版本: v1.0.20
  最新版本: v1.0.21

🎉 发现新版本!
开始升级...
正在升级 @jserxiao/xcli@latest...
升级成功: @jserxiao/xcli@latest

查看更新日志:
  https://github.com/jserxiao/xcli/releases
```

### 升级到指定标签

```bash
# 升级到 next 标签
xcli upgrade --tag next

# 升级到 beta 标签
xcli upgrade --tag beta
```

### 查看版本信息

```bash
# 显示详细版本信息
xcli version

# 简写
xcli v
```

输出示例：
```
📦 xcli 版本信息
──────────────────────────────
  版本:     v1.0.21
  包名:     @jserxiao/xcli
  全局版本: v1.0.21
```

---

## 错误处理

### 网络超时

```typescript
await execa('npm', ['view', packageName, 'version'], {
  timeout: 30000,  // 30 秒超时
});
```

### 标签不存在

```typescript
if (!targetVersion) {
  logger.error(`未找到标签 "${options.tag}"`);
  logger.info(`可用标签: ${Object.keys(tags).join(', ')}`);
  return;
}
```

### 升级失败

```typescript
try {
  await upgradePackage(PACKAGE_NAME);
} catch (error) {
  logger.error(`升级失败: ${(error as Error).message}`);
  process.exit(1);
}
```

---

## 总结

`upgrade` 命令的核心特点：

1. **版本检查**：通过 npm view 获取最新版本
2. **智能比较**：版本号比较判断是否需要升级
3. **标签支持**：支持 latest/next/beta 等标签
4. **超时控制**：网络请求设置超时时间
5. **友好提示**：显示更新日志链接

这套机制确保用户能够方便地保持 xcli 处于最新版本。
