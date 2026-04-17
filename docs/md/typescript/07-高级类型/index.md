# 高级类型

## 模块概述

高级类型是 TypeScript 类型系统的精华部分,包括映射类型、条件类型、类型推断等强大的特性。

## 目录

- [01-映射类型](./01-映射类型.md)
- [02-条件类型](./02-条件类型.md)
- [03-类型推断](./03-类型推断.md)
- [04-递归类型](./04-递归类型.md)
- [05-模板字面量类型](./05-模板字面量类型.md)
- [06-类型体操技巧](./06-类型体操技巧.md)

## 核心要点

### 映射类型

```typescript
// 基本语法
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 示例
interface User {
  name: string
  age: number
}

type ReadonlyUser = Readonly<User>
// { readonly name: string; readonly age: number }

type PartialUser = Partial<User>
// { name?: string; age?: number }

// 自定义映射类型
type Nullable<T> = {
  [P in keyof T]: T[P] | null
}

type NullableUser = Nullable<User>
// { name: string | null; age: number | null }
```

### 条件类型

```typescript
// 基本语法
type IsString<T> = T extends string ? 'yes' : 'no'

type A = IsString<string>  // 'yes'
type B = IsString<number>  // 'no'

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never

type Result = ToArray<string | number>
// string[] | number[]

// infer 关键字
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T

type A = UnwrapPromise<Promise<string>>  // string
type B = UnwrapPromise<string>           // string
```

### 模板字面量类型

```typescript
// 基本用法
type World = 'world'
type Greeting = `hello ${World}`  // 'hello world'

// 联合类型组合
type Color = 'red' | 'blue'
type Size = 'small' | 'large'

type ColorSize = `${Color}-${Size}`
// 'red-small' | 'red-large' | 'blue-small' | 'blue-large'

// 内置工具类型
type UppercaseGreeting = Uppercase<'hello'>  // 'HELLO'
type LowercaseGreeting = Lowercase<'HELLO'>  // 'hello'
type Capitalized = Capitalize<'hello'>       // 'Hello'
type Uncapitalized = Uncapitalize<'Hello'>   // 'hello'
```

### 类型体操

```typescript
// DeepReadonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

// DeepPartial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}

// RequiredKeys
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

// OptionalKeys
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
```

## 学习路径

1. 理解映射类型的基本概念
2. 掌握条件类型的用法
3. 学习 infer 关键字
4. 掌握模板字面量类型
5. 实践类型体操

## 参考资料

- [TypeScript Handbook - Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [TypeScript Handbook - Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
