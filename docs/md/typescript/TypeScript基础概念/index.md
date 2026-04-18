# TypeScript 基础概念

## 模块概述

本章将深入探讨 TypeScript 的诞生背景、设计理念、核心原理以及与 JavaScript 的关系。理解这些基础概念对于掌握 TypeScript 至关重要。

## 目录

- [TypeScript 的诞生背景](./TypeScript的诞生背景.md)
- [JavaScript 的局限性](./JavaScript的局限性.md)
- [TypeScript 与 JavaScript 的关系](./TypeScript与JavaScript的关系.md)
- [TypeScript 编译原理](./TypeScript编译原理.md)
- [类型系统理论基础](./类型系统理论基础.md)
- [TypeScript 开发环境搭建](./TypeScript开发环境搭建.md)

## 核心要点

### 什么是 TypeScript？

TypeScript 是由微软开发的**开源编程语言**，它是 JavaScript 的**严格超集**，添加了可选的静态类型和基于类的面向对象编程。

**核心特性**：
- 🔒 **静态类型检查** - 在编译时捕获错误
- 🚀 **类型推断** - 自动推断变量类型
- 🎯 **接口和泛型** - 强大的类型抽象
- 🛠️ **编译时转译** - 编译为纯 JavaScript
- 🔧 **工具支持** - 优秀的 IDE 支持

### 设计目标

TypeScript 的设计目标包括：

1. **静态类型识别** - 静态地识别可能违反类型系统的结构
2. **开发环境支持** - 为大型应用提供更好的开发工具
3. **JavaScript 兼容** - 完全兼容 JavaScript 代码
4. **渐进式采用** - 可以逐步将 JavaScript 项目迁移到 TypeScript

### 为什么需要 TypeScript？

```typescript
// JavaScript - 运行时才能发现错误
function add(a, b) {
  return a + b
}
add(1, '2') // '12' - 非预期结果

// TypeScript - 编译时就能发现错误
function add(a: number, b: number): number {
  return a + b
}
add(1, '2') // ❌ 编译错误: 类型"string"的参数不能赋给类型"number"的参数
```

## 快速开始

### 安装 TypeScript

```bash
# 全局安装
npm install -g typescript

# 项目本地安装
npm install --save-dev typescript
```

### 第一个 TypeScript 程序

```typescript
// hello.ts
function greet(name: string): string {
  return `Hello, ${name}!`
}

const message = greet('TypeScript')
console.log(message)
```

### 编译 TypeScript

```bash
# 编译单个文件
tsc hello.ts

# 使用配置文件编译
tsc

# 监听模式
tsc --watch
```

## 学习路径

1. **理解类型系统** - 学习类型系统的基础理论
2. **掌握基本类型** - 熟悉 TypeScript 的基础类型
3. **学习接口和类** - 掌握面向对象编程
4. **深入泛型** - 理解类型参数化
5. **实战项目** - 在实际项目中应用 TypeScript

## 参考资料

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript 编程（书籍）](https://www.oreilly.com/library/view/programming-typescript/9781492037644/)
