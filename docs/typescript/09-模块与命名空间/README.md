# 模块与命名空间

## 模块概述

TypeScript 支持 ES 模块和命名空间两种代码组织方式。

## 目录

- [01-ES模块](./01-ES模块.md)
- [02-命名空间](./02-命名空间.md)
- [03-模块解析策略](./03-模块解析策略.md)
- [04-声明合并](./04-声明合并.md)
- [05-模块augmentation](./05-模块augmentation.md)
- [06-项目引用](./06-项目引用.md)

## 核心要点

### ES 模块

```typescript
// 导出
export interface User {
  id: number
  name: string
}

export function createUser(name: string): User {
  return { id: Date.now(), name }
}

// 导入
import { User, createUser } from './user'
```

### 命名空间

```typescript
namespace Utils {
  export function log(message: string): void {
    console.log(message)
  }

  export const PI = 3.14159
}

Utils.log('hello')
console.log(Utils.PI)
```

### 模块解析

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 学习路径

1. 掌握 ES 模块语法
2. 理解命名空间用法
3. 学习模块解析策略
4. 掌握声明合并
5. 学习项目引用

## 参考资料

- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
