# 类型推断与类型守卫

## 模块概述

类型推断和类型守卫是 TypeScript 类型系统的核心机制,让代码既简洁又安全。

## 目录

- [类型推断原理](./类型推断原理.md)
- [类型守卫](./类型守卫.md)
- [类型断言](./类型断言.md)
- [类型缩小](./类型缩小.md)
- [可辨识联合](./可辨识联合.md)
- [类型兼容性](./类型兼容性.md)

## 核心要点

### 类型推断

```typescript
// 变量推断
let x = 10          // number
let y = 'hello'     // string

// 函数返回值推断
function add(a: number, b: number) {
  return a + b      // 返回 number
}

// 上下文推断
type Handler = (event: MouseEvent) => void
const handler: Handler = e => {
  console.log(e.clientX)  // e: MouseEvent
}
```

### 类型守卫

```typescript
// typeof 守卫
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()  // string
  } else {
    return value * 2           // number
  }
}

// instanceof 守卫
if (error instanceof Error) {
  console.log(error.message)
}

// 自定义守卫
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === 'string'
}
```

### 类型缩小

```typescript
function process(value: unknown) {
  // typeof
  if (typeof value === 'string') {
    return value.toUpperCase()
  }

  // in 操作符
  if ('name' in value) {
    return value.name
  }

  // instanceof
  if (value instanceof Date) {
    return value.toISOString()
  }
}
```

## 学习路径

1. 理解类型推断机制
2. 掌握各种类型守卫
3. 学会类型缩小技巧
4. 掌握可辨识联合模式
5. 理解类型兼容性

## 参考资料

- [TypeScript Handbook - Type Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
