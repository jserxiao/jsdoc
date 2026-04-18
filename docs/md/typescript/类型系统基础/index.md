# 类型系统基础

## 模块概述

本章详细介绍 TypeScript 的基础类型系统,包括原始类型、数组、元组、对象类型、联合类型、交叉类型等核心概念。

## 目录

- [原始类型](./原始类型.md)
- [数组与元组](./数组与元组.md)
- [对象类型](./对象类型.md)
- [联合类型与交叉类型](./联合类型与交叉类型.md)
- [字面量类型](./字面量类型.md)
- [枚举类型](./枚举类型.md)
- [特殊类型](./特殊类型.md)

## 核心要点

### TypeScript 的类型分类

```
TypeScript 类型系统
├── 原始类型
│   ├── string
│   ├── number
│   ├── boolean
│   ├── null
│   ├── undefined
│   ├── symbol
│   └── bigint
├── 对象类型
│   ├── object
│   ├── array
│   ├── tuple
│   ├── function
│   └── class
├── 特殊类型
│   ├── any
│   ├── unknown
│   ├── never
│   └── void
├── 复合类型
│   ├── union (联合类型)
│   ├── intersection (交叉类型)
│   └── literal (字面量类型)
└── 自定义类型
    ├── interface
    ├── type alias
    └── enum
```

### 类型注解 vs 类型推断

```typescript
// 类型注解 - 显式指定类型
let name: string = 'Alice'
let age: number = 25
let isActive: boolean = true

// 类型推断 - 自动推断类型
let city = 'Beijing'      // 推断为 string
let count = 42            // 推断为 number
let isReady = true        // 推断为 boolean
```

### 类型检查的严格性

TypeScript 提供了多个严格性选项:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,                    // 启用所有严格选项
    "noImplicitAny": true,             // 禁止隐式 any
    "strictNullChecks": true,          // 严格的 null 检查
    "strictFunctionTypes": true,       // 严格的函数类型
    "strictPropertyInitialization": true // 严格的属性初始化
  }
}
```

## 快速参考

### 常用类型示例

```typescript
// 原始类型
let str: string = 'hello'
let num: number = 42
let bool: boolean = true
let nul: null = null
let undef: undefined = undefined

// 数组
let numbers: number[] = [1, 2, 3]
let strings: Array<string> = ['a', 'b', 'c']

// 元组
let tuple: [string, number] = ['hello', 42]

// 对象
let obj: { name: string; age: number } = {
  name: 'Alice',
  age: 25
}

// 联合类型
let id: string | number = '123'
id = 123

// 字面量类型
let direction: 'up' | 'down' | 'left' | 'right' = 'up'

// 枚举
enum Color {
  Red,
  Green,
  Blue
}
let color: Color = Color.Red
```

## 学习路径

1. **掌握原始类型** - 理解基础类型的特性
2. **学习数组与元组** - 掌握集合类型
3. **理解对象类型** - 学习对象的结构类型
4. **掌握联合与交叉类型** - 理解类型组合
5. **学习字面量类型** - 掌握精确的类型约束
6. **了解枚举** - 学习枚举的使用场景

## 参考资料

- [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Deep Dive - Type System](https://basarat.gitbook.io/typescript/type-system)
