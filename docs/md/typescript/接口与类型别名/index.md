# 接口与类型别名

## 模块概述

接口和类型别名是 TypeScript 中定义自定义类型的两种主要方式。本章将详细介绍它们的使用方法和最佳实践。

## 目录

- [接口定义](./接口定义.md)
- [类型别名](./类型别名.md)
- [接口与类型别名的区别](./接口与类型别名的区别.md)
- [接口继承与实现](./接口继承与实现.md)
- [索引签名](./索引签名.md)
- [接口合并](./接口合并.md)

## 核心要点

### 接口 (Interface)

```typescript
// 定义对象类型
interface User {
  id: number
  name: string
  age?: number           // 可选属性
  readonly email: string // 只读属性
}

// 定义函数类型
interface SearchFunc {
  (source: string, subString: string): boolean
}

// 定义可索引类型
interface StringArray {
  [index: number]: string
}
```

### 类型别名 (Type Alias)

```typescript
// 基本类型别名
type ID = string | number

// 对象类型别名
type Point = {
  x: number
  y: number
}

// 联合类型
type Direction = 'up' | 'down' | 'left' | 'right'

// 交叉类型
type Name = { name: string }
type Age = { age: number }
type Person = Name & Age

// 泛型类型
type Container<T> = { value: T }
```

### 接口 vs 类型别名

| 特性 | Interface | Type Alias |
|------|-----------|-----------|
| 对象类型 | ✅ | ✅ |
| 联合类型 | ❌ | ✅ |
| 交叉类型 | ❌ | ✅ |
| 声明合并 | ✅ | ❌ |
| extends/implements | ✅ | ✅ (不同语法) |
| 元组类型 | ❌ | ✅ |

### 最佳实践

```typescript
// ✅ 对象类型优先使用 interface
interface User {
  id: number
  name: string
}

// ✅ 联合类型、元组类型使用 type
type ID = string | number
type Point = [number, number]

// ✅ 工具类型使用 type
type ReadonlyUser = Readonly<User>
type PartialUser = Partial<User>
```

## 学习路径

1. 掌握接口的基本语法
2. 理解类型别名的用途
3. 学会选择 interface 还是 type
4. 掌握接口的继承和实现
5. 理解索引签名和声明合并

## 参考资料

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
