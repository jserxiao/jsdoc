# 类型体操

## 模块概述

类型体操是利用 TypeScript 类型系统实现复杂类型运算的技巧。

## 目录

- [01-类型挑战](./01-类型挑战.md)
- [02-常见类型工具实现](./02-常见类型工具实现.md)
- [03-高级类型模式](./03-高级类型模式.md)
- [04-类型体操实战](./04-类型体操实战.md)
- [05-类型性能优化](./05-类型性能优化.md)
- [06-类型安全技巧](./06-类型安全技巧.md)

## 核心要点

### 常见类型工具

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
```

### 类型挑战示例

```typescript
// 实现 Pick
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 实现 Readonly
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

// 实现 Exclude
type MyExclude<T, U> = T extends U ? never : T
```

## 学习路径

1. 掌握基础类型运算
2. 学习条件类型
3. 练习类型挑战
4. 实现工具类型

## 参考资料

- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [TypeScript Type Manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
