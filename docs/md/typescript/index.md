# TypeScript 学习指南

## 📚 模块概述

TypeScript 是 JavaScript 的超集，为 JavaScript 添加了静态类型检查和面向对象编程特性。本模块将系统性地介绍 TypeScript 的核心概念、类型系统、高级特性以及实战应用。

## 🎯 学习目标

- 理解 TypeScript 的设计理念和工作原理
- 掌握 TypeScript 的类型系统和类型推断
- 学会使用接口、泛型、装饰器等高级特性
- 能够编写类型安全的代码和声明文件
- 掌握 TypeScript 工程化实践和最佳实践

## 📖 章节目录

### [一、TypeScript 基础概念](./01-TypeScript基础概念/)
- TypeScript 的诞生背景
- JavaScript 的局限性
- TypeScript 与 JavaScript 的关系
- TypeScript 编译原理
- 类型系统基础理论

### [二、类型系统基础](./02-类型系统基础/)
- 原始类型
- 数组与元组
- 对象类型
- 联合类型与交叉类型
- 字面量类型
- 枚举类型

### [三、接口与类型别名](./03-接口与类型别名/)
- 接口定义
- 类型别名
- 接口与类型别名的区别
- 接口继承与实现
- 索引签名
- 接口合并

### [四、函数类型](./04-函数类型/)
- 函数类型定义
- 可选参数与默认参数
- 函数重载
- this 类型
- 剩余参数
- 函数类型推断

### [五、类与面向对象](./05-类与面向对象/)
- 类的基本概念
- 访问修饰符
- 抽象类
- 接口实现
- 类的类型
- Mixin 模式

### [六、泛型编程](./06-泛型编程/)
- 泛型基础
- 泛型函数
- 泛型接口
- 泛型类
- 泛型约束
- 泛型工具类型

### [七、高级类型](./07-高级类型/)
- 映射类型
- 条件类型
- 类型推断
- 递归类型
- 模板字面量类型
- 类型体操技巧

### [八、类型推断与类型守卫](./08-类型推断与类型守卫/)
- 类型推断原理
- 类型守卫
- 类型断言
- 类型缩小
- 可辨识联合
- 类型兼容性

### [九、模块与命名空间](./09-模块与命名空间/)
- ES 模块
- 命名空间
- 模块解析策略
- 声明合并
- 模块 augmentation
- 项目引用

### [十、装饰器](./10-装饰器/)
- 装饰器基础
- 类装饰器
- 方法装饰器
- 属性装饰器
- 参数装饰器
- 装饰器工厂

### [十一、声明文件](./11-声明文件/)
- 声明文件基础
- 编写声明文件
- 模块声明
- 全局声明
- @types 组织
- 发布声明文件

### [十二、编译器选项](./12-编译器选项/)
- tsconfig.json 配置
- 基本选项
- 严格类型检查选项
- 模块解析选项
- 源映射选项
- 实验性选项

### [十三、类型体操](./13-类型体操/)
- 类型挑战
- 常见类型工具实现
- 高级类型模式
- 类型体操实战
- 类型性能优化
- 类型安全技巧

### [十四、实战应用](./14-实战应用/)
- 前端框架集成
- Node.js 项目配置
- 工具库开发
- 类型安全的 API 设计
- 测试与类型
- 最佳实践

## 🔑 核心关键字速查

### 类型关键字
- `type` - 类型别名
- `interface` - 接口定义
- `enum` - 枚举类型
- `namespace` - 命名空间
- `declare` - 声明文件
- `readonly` - 只读属性

### 类型操作符
- `&` - 交叉类型
- `|` - 联合类型
- `keyof` - 键名联合
- `typeof` - 类型查询
- `infer` - 类型推断
- `as` - 类型断言

### 泛型相关
- `<T>` - 泛型参数
- `extends` - 泛型约束
- `infer` - 条件类型推断

### 访问修饰符
- `public` - 公有成员
- `private` - 私有成员
- `protected` - 受保护成员
- `abstract` - 抽象类/方法

### 工具类型
- `Partial<T>` - 可选属性
- `Required<T>` - 必需属性
- `Readonly<T>` - 只读属性
- `Pick<T, K>` - 选取属性
- `Omit<T, K>` - 忽略属性
- `Record<K, T>` - 记录类型
- `Extract<T, U>` - 提取类型
- `Exclude<T, U>` - 排除类型
- `NonNullable<T>` - 非空类型
- `ReturnType<T>` - 返回类型
- `Parameters<T>` - 参数类型
- `InstanceType<T>` - 实例类型

## 📚 参考资源

### 官方文档
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### 推荐书籍
- 《TypeScript 编程》 - Boris Cherny
- 《深入理解 TypeScript》 - Basarat Ali Syed
- 《Effective TypeScript》 - Dan Vanderkam
- 《TypeScript 高级编程》 - Sebasian Pekcan

### 在线资源
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [TypeScript Challenges](https://github.com/type-challenges/type-challenges)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)

## 💡 学习建议

1. **循序渐进**：从基础类型开始，逐步掌握高级特性
2. **动手实践**：在 TypeScript Playground 中验证每个概念
3. **类型体操**：通过 type-challenges 提升类型编程能力
4. **阅读源码**：研究知名库的类型定义，学习最佳实践
5. **项目实战**：在实际项目中应用 TypeScript，积累经验

## 🚀 快速开始

```bash
# 安装 TypeScript
npm install -g typescript

# 创建 tsconfig.json
tsc --init

# 编译 TypeScript 文件
tsc

# 实时编译
tsc --watch
```

## 📝 版本说明

本教程基于 TypeScript 5.x 版本编写，涵盖了最新的特性如：
- const 类型参数
- satisfies 操作符
- 模板字面量类型
- 类型推断改进
- 装饰器标准实现

---

*持续更新中，欢迎提出建议和反馈！*
