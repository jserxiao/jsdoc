# 泛型编程

## 模块概述

泛型是 TypeScript 最强大的特性之一,允许创建可重用的组件。本章将深入介绍泛型的概念、用法和高级技巧。

## 目录

- [01-泛型基础](./01-泛型基础.md)
- [02-泛型函数](./02-泛型函数.md)
- [03-泛型接口](./03-泛型接口.md)
- [04-泛型类](./04-泛型类.md)
- [05-泛型约束](./05-泛型约束.md)
- [06-泛型工具类型](./06-泛型工具类型.md)

## 核心要点

### 泛型的本质

泛型允许我们创建可以处理多种类型的组件,同时保持类型安全。

```typescript
// 不使用泛型 - 类型不安全
function identity(arg: any): any {
  return arg
}

// 使用泛型 - 类型安全
function identity<T>(arg: T): T {
  return arg
}

const str = identity<string>('hello')  // string
const num = identity(42)               // number (类型推断)
```

### 泛型函数

```typescript
// 基本语法
function identity<T>(arg: T): T {
  return arg
}

// 箭头函数
const identity = <T>(arg: T): T => arg

// 多个类型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

const result = pair('hello', 42) // [string, number]
```

### 泛型接口

```typescript
// 泛型接口
interface Container<T> {
  value: T
  getValue(): T
  setValue(value: T): void
}

// 实现泛型接口
class Box<T> implements Container<T> {
  value: T

  constructor(value: T) {
    this.value = value
  }

  getValue(): T {
    return this.value
  }

  setValue(value: T): void {
    this.value = value
  }
}
```

### 泛型类

```typescript
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }
}

const numberStack = new Stack<number>()
numberStack.push(1)
numberStack.push(2)
```

### 泛型约束

```typescript
// 约束类型参数
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): number {
  console.log(arg.length)
  return arg.length
}

logLength('hello')     // ✅ string 有 length 属性
logLength([1, 2, 3])   // ✅ array 有 length 属性
// logLength(123)      // ❌ number 没有 length 属性

// 使用 keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 25 }
const name = getProperty(user, 'name')   // ✅
// getProperty(user, 'gender')           // ❌ 'gender' 不是 user 的属性
```

### 泛型工具类型

TypeScript 内置了许多泛型工具类型:

```typescript
// Partial - 所有属性可选
type PartialUser = Partial<User>

// Required - 所有属性必需
type RequiredUser = Required<User>

// Readonly - 所有属性只读
type ReadonlyUser = Readonly<User>

// Pick - 选取部分属性
type UserName = Pick<User, 'name'>

// Omit - 忽略部分属性
type UserWithoutEmail = Omit<User, 'email'>

// Record - 记录类型
type UserMap = Record<string, User>

// Extract - 提取类型
type StringOrNumber = Extract<string | number | boolean, string | number>

// Exclude - 排除类型
type NonString = Exclude<string | number | boolean, string>

// NonNullable - 排除 null 和 undefined
type NonNullableString = NonNullable<string | null | undefined>

// ReturnType - 获取返回值类型
type Result = ReturnType<() => string>  // string

// Parameters - 获取参数类型
type Params = Parameters<(a: string, b: number) => void>  // [string, number]

// InstanceType - 获取实例类型
type Instance = InstanceType<typeof MyClass>
```

### 条件类型

```typescript
// 条件类型
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false

// infer 关键字
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any

type Func = () => string
type Result = ReturnType<Func>  // string
```

## 学习路径

1. 理解泛型的基本概念
2. 掌握泛型函数的使用
3. 学会泛型接口和泛型类
4. 掌握泛型约束
5. 学习内置工具类型
6. 实践自定义工具类型

## 参考资料

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
