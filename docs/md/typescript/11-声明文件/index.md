# 声明文件

## 模块概述

声明文件用于描述 JavaScript 代码的类型信息。

## 目录

- [01-声明文件基础](./01-声明文件基础.md)
- [02-编写声明文件](./02-编写声明文件.md)
- [03-模块声明](./03-模块声明.md)
- [04-全局声明](./04-全局声明.md)
- [05-@types组织](./05-@types组织.md)
- [06-发布声明文件](./06-发布声明文件.md)

## 核心要点

### 全局声明

```typescript
// global.d.ts
declare function fetch(url: string): Promise<Response>

declare namespace NodeJS {
  interface Process {
    env: {
      NODE_ENV: string
    }
  }
}
```

### 模块声明

```typescript
// lodash.d.ts
declare module 'lodash' {
  function debounce(fn: Function, wait: number): Function
  function throttle(fn: Function, wait: number): Function

  export { debounce, throttle }
}
```

### 扩展第三方类型

```typescript
// express.d.ts
declare module 'express' {
  interface Request {
    user?: {
      id: string
      name: string
    }
  }
}
```

## 学习路径

1. 理解声明文件的作用
2. 学习声明文件语法
3. 掌握模块和全局声明
4. 学会发布声明文件

## 参考资料

- [TypeScript Handbook - Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
