# 函数类型

## 模块概述

函数是 TypeScript 中的一等公民,本章详细介绍函数的类型定义、参数类型、重载等特性。

## 目录

- [01-函数类型定义](./01-函数类型定义.md)
- [02-可选参数与默认参数](./02-可选参数与默认参数.md)
- [03-函数重载](./03-函数重载.md)
- [04-this类型](./04-this类型.md)
- [05-剩余参数](./05-剩余参数.md)
- [06-函数类型推断](./06-函数类型推断.md)

## 核心要点

### 函数类型定义

```typescript
// 函数声明
function add(a: number, b: number): number {
  return a + b
}

// 函数表达式
const multiply = (a: number, b: number): number => a * b

// 函数类型
type MathFunction = (a: number, b: number) => number

const divide: MathFunction = (a, b) => a / b
```

### 可选参数和默认参数

```typescript
// 可选参数
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}`
}

// 默认参数
function greet2(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}`
}
```

### 函数重载

```typescript
function reverse(x: number): number
function reverse(x: string): string
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''))
  } else {
    return x.split('').reverse().join('')
  }
}
```

### this 类型

```typescript
interface User {
  name: string
  greet(this: User): void
}

const user: User = {
  name: 'Alice',
  greet() {
    console.log(`Hello, ${this.name}`)
  }
}
```

## 学习路径

1. 掌握函数类型定义
2. 理解参数类型特性
3. 学会使用函数重载
4. 掌握 this 类型
5. 理解函数类型推断

## 参考资料

- [TypeScript Handbook - Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
