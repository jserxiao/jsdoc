# 模块与命名空间

## 模块概述

TypeScript 支持 ES 模块和命名空间两种代码组织方式。

## 目录

- [ES模块](./ES模块.md)
- [命名空间](./命名空间.md)
- [模块解析策略](./模块解析策略.md)
- [声明合并](./声明合并.md)
- [模块augmentation](./模块augmentation.md)
- [项目引用](./项目引用.md)

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
