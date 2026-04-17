# @types 组织

@types 是 DefinitelyTyped 项目提供的类型声明包，为 npm 上的 JavaScript 库提供类型支持。

---

## 目录

- [@types 包概述](#types-包概述)
- [安装和使用](#安装和使用)
- [贡献类型声明](#贡献类型声明)
- [维护指南](#维护指南)

---

## @types 包概述

### 什么是 DefinitelyTyped

DefinitelyTyped 是一个 GitHub 仓库，包含数千个 JavaScript 库的类型声明文件。这些声明以 `@types/` 包的形式发布到 npm。

```bash
# 类型声明包命名规则
@types/lodash          # lodash 的类型
@types/express         # express 的类型
@types/react           # react 的类型
```

### 为什么使用 @types

1. **官方不提供类型**：库作者未使用 TypeScript
2. **类型更完善**：社区维护，覆盖更全面
3. **版本独立**：类型声明可以独立于库更新

---

## 安装和使用

### 安装类型包

```bash
# 安装类型声明
npm install --save-dev @types/lodash
npm install --save-dev @types/express
npm install --save-dev @types/node

# yarn
yarn add -D @types/lodash
```

### 自动获取类型

TypeScript 会自动从 `node_modules/@types` 获取类型：

```
node_modules/
├── @types/
│   ├── lodash/
│   │   └── index.d.ts
│   ├── express/
│   │   └── index.d.ts
│   └── node/
│       └── index.d.ts
```

### 配置类型根目录

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": [
      "./types",
      "./node_modules/@types"
    ]
  }
}
```

### 类型版本匹配

```json
// package.json
{
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/lodash": "^4.14.0"  // 主版本号应与库一致
  }
}
```

---

## 贡献类型声明

### 项目结构

```
types/
├── my-library/
│   ├── index.d.ts       # 主声明文件
│   ├── my-library-tests.ts  # 测试文件
│   ├── tsconfig.json    # TypeScript 配置
│   ├── tslint.json      # Lint 配置
│   └── README.md        # 说明文档
```

### 声明文件示例

```typescript
// types/my-library/index.d.ts

/**
 * 我的库
 */
declare namespace MyLibrary {
  interface Options {
    debug?: boolean;
    timeout?: number;
  }
  
  interface Result<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
}

declare function myLibrary(options?: MyLibrary.Options): void;

export = myLibrary;
```

### 测试文件

```typescript
// types/my-library/my-library-tests.ts
import myLibrary = require('my-library');

// 测试函数调用
myLibrary({ debug: true });

// 测试类型推断
const options: MyLibrary.Options = { timeout: 1000 };
const result: MyLibrary.Result<string> = { success: true, data: 'test' };
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "lib": ["es6"],
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "types": [],
    "noEmit": true,
    "forceConsistentCasingInFileNames": true
  },
  "files": [
    "index.d.ts",
    "my-library-tests.ts"
  ]
}
```

---

## 维护指南

### 版本号规则

- **主版本号**：与库的主版本号对应
- **次版本号**：类型更新
- **修订号**：bug 修复

### 提交 PR 流程

1. Fork DefinitelyTyped 仓库
2. 创建类型目录
3. 编写声明文件和测试
4. 运行测试：`npm test`
5. 提交 PR

### 代码规范

```typescript
// ✅ 好：完整的文档注释
/**
 * 发送网络请求
 * @param url - 请求地址
 * @param options - 请求选项
 * @example
 * ```ts
 * request('/api/users', { method: 'GET' })
 * ```
 */
export function request(
  url: string,
  options?: RequestOptions
): Promise<Response>;

// ❌ 差：无文档
export function request(url: string, options?: any): Promise<any>;
```

---

**下一节**: [发布声明文件](./06-发布声明文件.md)
