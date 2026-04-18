# 函数式编程

函数式编程（Functional Programming，FP）是一种编程范式，它将计算视为数学函数的求值，避免状态变化和可变数据。

---

## 📁 模块目录

| 序号 | 模块 | 主要内容 | 文件 |
|------|------|----------|------|
| 1 | 函数式核心概念 | 纯函数、不可变性、高阶函数、柯里化 | [函数式核心概念.md](./函数式核心概念.md) |
| 2 | 函数式组合 | 组合、管道、函子、Point-free 风格 | [函数式组合.md](./函数式组合.md) |

---

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 理解函数式编程的核心原则
- ✅ 编写纯函数，避免副作用
- ✅ 使用高阶函数处理数据
- ✅ 掌握柯里化和偏函数应用
- ✅ 实践函数组合和管道
- ✅ 理解函子（Functor）等高级概念

---

## 📖 核心概念速查

### 纯函数

```javascript
// ✅ 纯函数：相同输入总是返回相同输出，无副作用
const add = (a, b) => a + b;
const double = x => x * 2;

// ❌ 非纯函数：依赖外部状态或有副作用
let counter = 0;
const increment = () => ++counter; // 依赖外部状态
```

### 不可变性

```javascript
// ❌ 可变操作
const arr = [1, 2, 3];
arr.push(4); // 修改原数组

// ✅ 不可变操作
const arr = [1, 2, 3];
const newArr = [...arr, 4]; // 返回新数组
```

### 高阶函数

```javascript
// 接收函数作为参数，或返回函数
const map = fn => arr => arr.map(fn);
const filter = fn => arr => arr.filter(fn);
const compose = (f, g) => x => f(g(x));
```

### 柯里化

```javascript
// 将多参数函数转换为一系列单参数函数
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried.apply(this, [...args, ...more]);
  };
};

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
```

---

## 🔄 函数组合

### 组合与管道

```javascript
// compose: 从右到左执行
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// pipe: 从左到右执行
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// 示例
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const compute = compose(square, double, addOne);
compute(3); // ((3 + 1) * 2)² = 64

const computePipe = pipe(addOne, double, square);
computePipe(3); // ((3 + 1) * 2)² = 64
```

### Point-Free 风格

```javascript
// ❌ 非 Point-Free
const getUserName = user => user.name;
const getUserNameUpper = user => getUserName(user).toUpperCase();

// ✅ Point-Free（无参数风格）
const prop = key => obj => obj[key];
const toUpper = str => str.toUpperCase();

const getUserNameUpper = compose(toUpper, prop('name'));
```

---

## 📊 函数式 vs 命令式

```javascript
// 命令式（如何做）
const numbers = [1, 2, 3, 4, 5];
const result = [];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    result.push(numbers[i] * 2);
  }
}
// [4, 8]

// 函数式（做什么）
const numbers = [1, 2, 3, 4, 5];
const result = numbers
  .filter(x => x % 2 === 0)
  .map(x => x * 2);
// [4, 8]
```

| 特性 | 命令式 | 函数式 |
|------|--------|--------|
| 关注点 | 如何做 | 做什么 |
| 状态 | 可变 | 不可变 |
| 控制流 | 循环、条件 | 递归、组合 |
| 副作用 | 常见 | 避免 |
| 可测试性 | 较难 | 容易 |

---

## 🏗️ 函子（Functor）

```javascript
// 简单的函子实现
class Box {
  constructor(value) {
    this.$value = value;
  }

  // map 方法（Functor 的核心）
  map(fn) {
    return new Box(fn(this.$value));
  }

  // 提取值
  fold(fn) {
    return fn(this.$value);
  }

  // 静态方法
  static of(value) {
    return new Box(value);
  }
}

// 使用
Box.of('hello')
  .map(s => s.toUpperCase())
  .map(s => s + ' world')
  .fold(s => s);
// 'HELLO world'
```

---

## 🔗 学习路径

```
开始
  │
  ▼
[核心概念] ──► 纯函数、不可变性、高阶函数
  │
  ▼
[柯里化] ──► 部分应用、参数复用
  │
  ▼
[组合] ──► compose、pipe、Point-free
  │
  ▼
[高级概念] ──► 函子、Monad
  │
  ▼
完成函数式编程模块 ✓
```

---

## 📚 参考资源

- [Ramda 文档](https://ramdajs.com/)
- [Lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide)
- [Professor Frisby's Mostly Adequate Guide](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)
- [JavaScript 函数式编程](https://www.oreilly.com/library/view/javascript-functional/9781491967662/)

---

[返回上级目录](../)
