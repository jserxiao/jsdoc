# TypeScript 开发环境搭建

## 概述

本章将介绍如何搭建完整的 TypeScript 开发环境,包括安装、配置、IDE 集成等。

## 一、安装 TypeScript

### 1.1 全局安装

```bash
# 使用 npm
npm install -g typescript

# 使用 yarn
yarn global add typescript

# 使用 pnpm
pnpm add -g typescript

# 验证安装
tsc --version
# Version 5.x.x
```

### 1.2 项目本地安装

```bash
# 创建项目
mkdir my-ts-project
cd my-ts-project
npm init -y

# 安装 TypeScript
npm install --save-dev typescript

# 运行编译器
npx tsc --version
```

### 1.3 使用特定版本

```bash
# 安装特定版本
npm install --save-dev typescript@5.0.0

# 安装最新稳定版
npm install --save-dev typescript@latest

# 安装 RC 版本
npm install --save-dev typescript@rc
```

## 二、初始化配置

### 2.1 创建 tsconfig.json

```bash
# 自动生成配置文件
npx tsc --init

# 生成的配置文件包含常用选项和注释
```

### 2.2 基础配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",              // 编译目标版本
    "module": "ESNext",               // 模块系统
    "lib": ["ES2020", "DOM"],         // 包含的库定义
    "outDir": "./dist",               // 输出目录
    "rootDir": "./src",               // 源码目录
    "strict": true,                    // 启用严格模式
    "esModuleInterop": true,           // ES 模块互操作
    "skipLibCheck": true,              // 跳过库文件检查
    "forceConsistentCasingInFileNames": true // 强制文件名大小写一致
  },
  "include": ["src/**/*"],            // 包含的文件
  "exclude": ["node_modules"]         // 排除的文件
}
```

### 2.3 配置选项详解

```json
{
  "compilerOptions": {
    // 基本选项
    "target": "ES2020",           // 编译目标: ES3, ES5, ES6, ES2017, ES2020, ESNext
    "module": "ESNext",           // 模块系统: commonjs, amd, system, umd, es2015, esnext
    "lib": ["ES2020", "DOM"],     // 包含的库定义
    "outDir": "./dist",           // 输出目录
    "outFile": "./bundle.js",     // 输出单个文件(仅 AMD/System)
    "rootDir": "./src",           // 源码根目录

    // 严格类型检查选项
    "strict": true,               // 启用所有严格选项
    "noImplicitAny": true,        // 禁止隐式 any
    "strictNullChecks": true,     // 严格的 null 检查
    "strictFunctionTypes": true,  // 严格的函数类型检查
    "strictBindCallApply": true,  // 严格的 bind/call/apply
    "strictPropertyInitialization": true, // 严格的属性初始化
    "noImplicitThis": true,       // 禁止隐式 this
    "useUnknownInCatchVariables": true, // catch 变量为 unknown
    "alwaysStrict": true,         // 总是使用严格模式

    // 模块解析选项
    "moduleResolution": "node",   // 模块解析策略
    "baseUrl": "./",              // 基础路径
    "paths": {                    // 路径映射
      "@/*": ["src/*"]
    },
    "rootDirs": ["src"],          // 根目录列表
    "typeRoots": ["./node_modules/@types"], // 类型定义根目录
    "types": ["node"],            // 包含的类型定义

    // 源映射选项
    "sourceMap": true,            // 生成 .js.map 文件
    "inlineSourceMap": false,     // 内联 source map
    "declaration": true,          // 生成 .d.ts 文件
    "declarationMap": true,       // 生成声明文件的 source map

    // 其他选项
    "allowJs": true,              // 允许编译 JS 文件
    "checkJs": false,             // 检查 JS 文件
    "removeComments": true,       // 移除注释
    "noEmit": false,              // 不输出文件
    "noEmitOnError": true,        // 错误时不输出
    "importHelpers": true,        // 从 tslib 导入辅助函数
    "downlevelIteration": true,   // 为迭代器提供完整支持
    "experimentalDecorators": true, // 启用装饰器
    "emitDecoratorMetadata": true  // 为装饰器提供元数据
  }
}
```

## 三、项目结构

### 3.1 推荐目录结构

```
my-ts-project/
├── src/                    # 源码目录
│   ├── index.ts           # 入口文件
│   ├── utils/             # 工具函数
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── types/             # 类型定义
│   │   └── index.d.ts
│   └── modules/           # 功能模块
│       └── user/
│           ├── index.ts
│           └── types.ts
├── dist/                  # 编译输出目录
├── tests/                 # 测试目录
│   └── utils.test.ts
├── node_modules/          # 依赖
├── tsconfig.json          # TypeScript 配置
├── package.json           # 项目配置
└── README.md              # 项目文档
```

### 3.2 package.json 配置

```json
{
  "name": "my-ts-project",
  "version": "1.0.0",
  "description": "TypeScript project",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0"
  },
  "dependencies": {}
}
```

## 四、IDE 配置

### 4.1 VS Code 配置

**推荐扩展**:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "usernamehw.errorlens",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

**工作区设置**:

```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### 4.2 其他 IDE

#### WebStorm

WebStorm 内置 TypeScript 支持,无需额外配置。

#### Vim/Neovim

使用 coc.nvim 或 nvim-lspconfig:

```vim
" 使用 coc.nvim
Plug 'neoclide/coc.nvim', {'branch': 'release'}

" TypeScript LSP 配置
:call coc#config('languageserver', {
\  'typescript': {
\    'command': 'typescript-language-server',
\    'args': ['--stdio'],
\    'filetypes': ['typescript', 'typescriptreact']
\  }
\})
```

## 五、编译与运行

### 5.1 编译命令

```bash
# 编译项目
tsc

# 监听模式
tsc --watch

# 编译单个文件
tsc src/index.ts

# 指定配置文件
tsc --project tsconfig.build.json

# 增量编译
tsc --incremental

# 显示详细信息
tsc --listEmittedFiles
```

### 5.2 使用 ts-node 直接运行

```bash
# 安装 ts-node
npm install --save-dev ts-node

# 直接运行 TypeScript
npx ts-node src/index.ts

# 使用 REPL
npx ts-node
```

### 5.3 使用 tsx (更快的替代方案)

```bash
# 安装 tsx
npm install --save-dev tsx

# 运行 TypeScript
npx tsx src/index.ts

# 监听模式
npx tsx watch src/index.ts
```

## 六、代码质量工具

### 6.1 ESLint 配置

```bash
# 安装 ESLint
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
}
```

### 6.2 Prettier 配置

```bash
# 安装 Prettier
npm install --save-dev prettier eslint-config-prettier
```

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

### 6.3 Husky + lint-staged

```bash
# 安装依赖
npm install --save-dev husky lint-staged

# 初始化 husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write"]
  }
}
```

## 七、调试配置

### 7.1 VS Code 调试配置

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "runtimeExecutable": "node",
      "runtimeArgs": ["--loader", "ts-node/esm"],
      "args": ["${workspaceFolder}/src/index.ts"],
      "console": "integratedTerminal",
      "sourceMaps": true,
      "resolveSourceMapLocations": [
        "${workspaceFolder}/**",
        "!**/node_modules/**"
      ]
    }
  ]
}
```

### 7.2 使用 source map 调试

```typescript
// 启用 source map
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

## 八、常见问题与解决

### 8.1 找不到模块

```typescript
// 错误: Cannot find module 'xxx' or its corresponding type declarations

// 解决方案: 安装类型定义
npm install --save-dev @types/xxx

// 或创建类型声明
// declarations.d.ts
declare module 'xxx' {
  export function someFunction(): void
}
```

### 8.2 模块解析错误

```typescript
// 错误: Cannot find module './utils'

// 检查 tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// 确保文件扩展名正确
import { helper } from './utils'     // 推荐
import { helper } from './utils.ts'  // 也可以
```

### 8.3 类型定义冲突

```typescript
// 错误: Type 'xxx' is not compatible with type 'yyy'

// 解决方案: 使用类型断言或调整类型定义
interface A {
  x: number
}

interface B {
  x: number
  y: number
}

const a: A = { x: 1 }
const b: B = { x: 1, y: 2 }

// 使用类型断言
const obj: A = b as A

// 或调整类型定义使其兼容
```

## 九、总结

### 开发环境检查清单

- [ ] TypeScript 已安装
- [ ] tsconfig.json 已配置
- [ ] IDE 已配置 TypeScript 支持
- [ ] ESLint 已配置
- [ ] Prettier 已配置
- [ ] Git hooks 已设置
- [ ] 调试配置已完成

### 推荐工具链

```
TypeScript
  ├── 编译: tsc / tsx
  ├── 运行: ts-node / tsx
  ├── 检查: ESLint
  ├── 格式化: Prettier
  ├── 测试: Jest / Vitest
  └── 构建: Vite / esbuild
```

### 下一步

- 学习 TypeScript 基础类型
- 掌握接口和类型别名
- 理解类型推断机制
- 实践项目开发

---

**返回**: [TypeScript 基础概念](./README.md)
