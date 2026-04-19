# 发布与维护

本章详细介绍 xcli 项目的构建配置、发布流程和版本维护策略。

---

## 构建配置

### Rollup 构建配置

xcli 使用 Rollup 作为构建工具，配置文件位于 `rollup.config.mjs`。

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    json(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  external: [
    'chalk',
    'commander',
    'ejs',
    'execa',
    'fs-extra',
    'inquirer',
    'ora',
    'fs',
    'path',
    'url',
    'module',
    'os',
    'crypto',
    'stream',
    'events',
    'util',
    'assert',
    'buffer',
    'process',
    'child_process',
  ],
};
```

#### 配置解析

| 配置项 | 说明 |
|--------|------|
| `input` | 入口文件 `src/index.ts` |
| `output.format` | 输出格式为 ESM，支持 Node.js 原生 ES 模块 |
| `output.sourcemap` | 生成 sourcemap 文件，便于调试 |
| `plugins` | 构建插件列表 |
| `external` | 外部依赖，不打包进输出文件 |

#### 插件说明

| 插件 | 作用 |
|------|------|
| `@rollup/plugin-json` | 导入 JSON 文件 |
| `@rollup/plugin-node-resolve` | 解析 node_modules 中的模块 |
| `@rollup/plugin-commonjs` | 将 CommonJS 模块转换为 ESM |
| `@rollup/plugin-typescript` | 编译 TypeScript 代码 |

### TypeScript 配置

`tsconfig.json` 配置说明：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 关键配置说明

- **`noEmit: true`**：TypeScript 只做类型检查，不输出文件，由 Rollup 负责编译输出
- **`declaration: true`**：生成 `.d.ts` 类型声明文件
- **`declarationMap: true`**：生成声明文件的 sourcemap

---

## package.json 配置

### 核心字段

```json
{
  "name": "@jserxiao/xcli",
  "version": "1.0.21",
  "description": "A pluggable CLI tool for scaffolding TypeScript projects",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "xcli": "dist/index.js"
  },
  "files": [
    "dist"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 字段详解

| 字段 | 说明 |
|------|------|
| `name` | 包名，使用 `@jserxiao` 作用域 |
| `type` | 模块类型为 ESM |
| `bin` | CLI 入口点，安装后创建 `xcli` 命令 |
| `files` | 发布时包含的文件，仅 `dist` 目录 |
| `exports` | 定义导出入口，支持 ESM 和类型声明 |
| `engines` | 运行环境要求，Node.js >= 18.0.0 |

### CLI 入口点

`bin` 字段指向的文件必须有 shebang 行：

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
// ...
```

这样系统才能正确识别并执行 Node.js 脚本。

### npm scripts

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "start": "node dist/index.js",
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "pub": "bash publish.sh"
  }
}
```

| 命令 | 说明 |
|------|------|
| `npm run build` | 构建生产版本 |
| `npm run dev` | 开发模式，监听文件变化 |
| `npm run start` | 运行构建后的 CLI |
| `npm run docs:dev` | 启动文档开发服务器 |
| `npm run pub` | 执行发布脚本 |

---

## 发布流程

### 发布脚本

`publish.sh` 自动化发布脚本：

```bash
#!/bin/bash

# 发布脚本：自动递增版本号并发布到 npm
# 使用方法: ./publish.sh [patch|minor|major]

set -e

# 默认版本递增类型
VERSION_TYPE=${1:-patch}

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 开始发布流程...${NC}"

# 构建项目
echo -e "${GREEN}🔨 构建项目...${NC}"
npm run build

# 获取当前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}📌 当前版本: v${CURRENT_VERSION}${NC}"

# 递增版本号
echo -e "${GREEN}📦 递增版本号 (${VERSION_TYPE})...${NC}"
npm version $VERSION_TYPE --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}✨ 新版本: v${NEW_VERSION}${NC}"

# 提交版本更改
echo -e "${GREEN}📝 提交版本更改...${NC}"
git add package.json
git commit -m "chore: release v${NEW_VERSION}"

# 创建 Git 标签
echo -e "${GREEN}🏷️  创建 Git 标签 v${NEW_VERSION}...${NC}"
git tag "v${NEW_VERSION}"

# 发布到 npm
echo -e "${GREEN}📤 发布到 npm...${NC}"
npm publish

echo -e "${GREEN}✅ 发布完成! v${NEW_VERSION} 已成功发布${NC}"
```

### 发布流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                      发布流程                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 构建项目                                                    │
│     └── npm run build → dist/index.js                           │
│                                                                 │
│  2. 获取当前版本                                                │
│     └── 读取 package.json 中的 version                          │
│                                                                 │
│  3. 递增版本号                                                  │
│     ├── patch: 修复 bug (1.0.0 → 1.0.1)                         │
│     ├── minor: 新功能 (1.0.0 → 1.1.0)                           │
│     └── major: 破坏性变更 (1.0.0 → 2.0.0)                       │
│                                                                 │
│  4. Git 提交                                                    │
│     └── git commit -m "chore: release vX.X.X"                   │
│                                                                 │
│  5. 创建标签                                                    │
│     └── git tag vX.X.X                                          │
│                                                                 │
│  6. 发布到 npm                                                  │
│     └── npm publish                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 版本号规范

遵循语义化版本（Semantic Versioning）规范：

- **MAJOR（主版本号）**：不兼容的 API 变更
- **MINOR（次版本号）**：向后兼容的功能新增
- **PATCH（修订号）**：向后兼容的问题修复

```bash
# 发布补丁版本
./publish.sh patch   # 1.0.21 → 1.0.22

# 发布次版本
./publish.sh minor   # 1.0.21 → 1.1.0

# 发布主版本
./publish.sh major   # 1.0.21 → 2.0.0
```

---

## 版本升级命令

xcli 内置了 `upgrade` 命令，允许用户检查和升级 CLI 版本。

### 实现原理

```typescript
// src/commands/upgrade.ts

import { execa } from 'execa';
import semver from 'semver';
import { logger } from '../utils/logger';

export const CURRENT_VERSION = '1.0.21';

/**
 * 从 npm 获取最新版本号
 */
async function getLatestVersion(): Promise<string> {
  const { stdout } = await execa('npm', [
    'view',
    '@jserxiao/xcli',
    'version',
    '--registry',
    'https://registry.npmmirror.com'
  ]);
  return stdout.trim();
}

/**
 * 升级命令实现
 */
export async function upgrade(options: { check?: boolean; tag?: string }) {
  const spinner = ora('检查更新...').start();

  try {
    const latestVersion = await getLatestVersion();
    spinner.stop();

    // 版本比较
    if (semver.gt(latestVersion, CURRENT_VERSION)) {
      logger.info(`发现新版本: v${latestVersion} (当前: v${CURRENT_VERSION})`);

      if (options.check) {
        logger.info('使用 `xcli upgrade` 命令进行升级');
        return;
      }

      // 执行升级
      const updateSpinner = ora('正在升级...').start();
      await execa('npm', ['install', '-g', '@jserxiao/xcli@latest']);
      updateSpinner.succeed('升级成功!');
    } else {
      logger.success('当前已是最新版本');
    }
  } catch (error) {
    spinner.fail('检查更新失败');
    throw error;
  }
}
```

### 使用方法

```bash
# 检查是否有更新
xcli upgrade --check

# 升级到最新版本
xcli upgrade

# 使用简写
xcli up
```

---

## 维护策略

### 版本依赖管理

所有依赖版本统一管理在 `src/constants/versions.ts` 中：

```typescript
export const CORE_VERSIONS = {
  node: '>=18.0.0',
  typescript: '^5.3.3',
} as const;

export const BUNDLER_VERSIONS = {
  vite: '^5.0.12',
  webpack: '^5.98.0',
  rollup: '^4.9.0',
} as const;

export const LINTER_VERSIONS = {
  eslint: '^9.18.0',
  stylelint: '^16.2.0',
  prettier: '^3.2.4',
} as const;

// ... 其他依赖版本
```

#### 优势

1. **集中管理**：所有版本号集中在一个文件，便于统一更新
2. **类型安全**：使用 `as const` 断言，编译时检查版本号格式
3. **易于维护**：升级依赖时只需修改一处

### 持续集成

建议配置 CI/CD 流程：

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 变更日志

建议使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新插件支持
fix: 修复模板生成的路径问题
docs: 更新 README 文档
chore: 升级依赖版本
refactor: 重构插件系统
test: 添加单元测试
```

配合 [standard-version](https://github.com/conventional-changelog/standard-version) 自动生成 CHANGELOG。

---

## 故障排查

### 常见问题

#### 1. 发布失败：权限错误

```bash
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/@jserxiao%2fxcli
```

**解决方案**：
- 确保已登录 npm 账号：`npm login`
- 对于 scoped package，需要指定 `--access public`

```bash
npm publish --access public
```

#### 2. CLI 命令找不到

```bash
command not found: xcli
```

**解决方案**：
- 全局安装：`npm install -g @jserxiao/xcli`
- 或使用 npx：`npx @jserxiao/xcli init my-project`

#### 3. Node.js 版本不兼容

```bash
Error: xcli requires Node.js version >= 18.0.0
```

**解决方案**：
- 升级 Node.js 到 18 或更高版本
- 或使用 Volta/nvm 管理多版本

```bash
# 使用 Volta
volta install node@20

# 使用 nvm
nvm install 20
nvm use 20
```

---

## 最佳实践

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/jserxiao/xcli.git
cd xcli

# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 在另一个终端测试
node dist/index.js init test-project
```

### 本地测试

```bash
# 使用 npm link 创建本地链接
npm link

# 现在可以在任意目录使用 xcli
xcli init test-project

# 测试完成后取消链接
npm unlink -g @jserxiao/xcli
```

### 发布前检查

```bash
# 1. 确保代码通过类型检查
npx tsc --noEmit

# 2. 确保构建成功
npm run build

# 3. 本地测试
npm link
xcli init test-project

# 4. 检查 package.json 版本和内容
cat package.json

# 5. 发布
./publish.sh patch
```

---

## 总结

xcli 的发布与维护流程体现了以下最佳实践：

1. **自动化构建**：使用 Rollup 构建高效、优化的输出
2. **语义化版本**：遵循 SemVer 规范，便于用户理解版本变化
3. **脚本化发布**：自动化版本递增、Git 提交和 npm 发布
4. **内置升级**：提供 `upgrade` 命令，方便用户保持最新版本
5. **集中管理**：依赖版本统一维护，便于升级和追踪

这套流程确保了 xcli 能够稳定、可靠地迭代，为用户提供持续改进的脚手架工具。
