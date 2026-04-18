# ES6+ 新特性

ES6（ECMAScript 2015）是 JavaScript 历史上最重要的更新之一，后续每年都会发布新版本。本模块详细介绍 ES6 及后续版本的新特性。

---

## 📁 模块目录

| 序号 | 模块 | 主要内容 | 文件 |
|------|------|----------|------|
| 1 | 语法增强 | let/const、箭头函数、模板字符串、解构、扩展运算符 | [语法增强.md](./语法增强.md) |
| 2 | 新增特性 | Symbol、Proxy、Generator、Map/Set、Class | [新增特性.md](./新增特性.md) |
| 3 | ES近年新特性 | ESES2024 新特性 | [ES近年新特性.md](./ES近年新特性.md) |
| 4 | 解构赋值 | 数组解构、对象解构、函数参数解构 | [解构赋值.md](./解构赋值.md) |

---

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 熟练使用 `let`、`const` 和箭头函数
- ✅ 掌握解构赋值和扩展运算符的各种用法
- ✅ 理解并使用 Symbol、Proxy、Generator 等高级特性
- ✅ 了解 ES2020 至 ES2024 的最新特性
- ✅ 在实际项目中正确选择和应用 ES6+ 新特性

---

## 📖 ES 发展历程

```
ES6 (2015) ──── 里程碑式更新
   │
   ├── ES7 (2016) ─── includes, ** 运算符
   ├── ES8 (2017) ─── async/await, Object.entries
   ├── ES9 (2018) ─── 异步迭代, rest/spread
   ├── ES10 (2019) ── flat, fromEntries
   │
ES11 (2020) ──── 重要更新
   │
   ├── 可选链 ?.
   ├── 空值合并 ??
   ├── BigInt
   └── Promise.allSettled
   │
ES12 (2021) ────
   │
   ├── 逻辑赋值 ||=, &&=, ??=
   ├── 数字分隔符 1_000_000
   ├── replaceAll
   └── Promise.any
   │
ES13 (2022) ────
   │
   ├── 顶层 await
   ├── 私有字段 #field
   ├── Object.hasOwn
   └── Array.at
   │
ES14 (2023) ────
   │
   ├── findLast/findLastIndex
   ├── toSorted/toReversed
   └── toSpliced/with
   │
ES15 (2024) ────
   │
   ├── Object.groupBy
   ├── Promise.withResolvers
   └── RegExp v 标志
```

---

## 🔑 核心特性速查

### 变量声明

```javascript
// ES5
var name = 'John';

// ES6+
let count = 0;        // 可重新赋值
const PI = 3.14159;   // 常量
```

### 箭头函数

```javascript
// ES5
function add(a, b) {
  return a + b;
}

// ES6+
const add = (a, b) => a + b;
```

### 模板字符串

```javascript
// ES5
var greeting = 'Hello, ' + name + '!';

// ES6+
const greeting = `Hello, ${name}!`;
```

### 解构赋值

```javascript
// 数组解构
const [a, b] = [1, 2];

// 对象解构
const { name, age } = person;

// 函数参数解构
function fn({ x, y = 0 }) {}
```

### 类

```javascript
class Person {
  #private = 'secret';  // 私有字段

  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}
```

### Promise 和异步

```javascript
// Promise
const p = new Promise((resolve, reject) => {});

// async/await
async function fetch() {
  const data = await getData();
  return data;
}

// 顶层 await (ES2022)
const config = await import('./config.js');
```

### 模块

```javascript
// 导出
export const name = 'value';
export default function() {}

// 导入
import { name } from './module.js';
import fn from './module.js';
```

---

## ⚠️ 兼容性注意事项

### 浏览器支持

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| let/const | 49+ | 36+ | 10+ | 12+ |
| 箭头函数 | 45+ | 22+ | 10+ | 12+ |
| class | 49+ | 45+ | 10+ | 13+ |
| 可选链 | 80+ | 74+ | 13.1+ | 80+ |
| 私有字段 | 74+ | 90+ | 14.1+ | 79+ |

### 转译工具

```javascript
// Babel 配置示例
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead",
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
```

### 特性检测

```javascript
// 运行时检测
const supports = {
  optionalChaining: (() => {
    try { eval('a?.b'); return true; } catch { return false; }
  })(),
  nullishCoalescing: (() => {
    try { eval('a ?? b'); return true; } catch { return false; }
  })(),
  privateFields: (() => {
    try { eval('class A { #x }'); return true; } catch { return false; }
  })()
};
```

---

## 🔗 学习路径

```
开始
  │
  ▼
[语法增强] ──► let/const、箭头函数、模板字符串
  │
  ▼
[解构赋值] ──► 数组解构、对象解构、参数解构
  │
  ▼
[新增特性] ──► Symbol、Proxy、Generator、Map/Set
  │
  ▼
[近年新特性] ──► 可选链、空值合并、BigInt、私有字段
  │
  ▼
完成 ES6+ 模块 ✓
```

---

## 📚 参考资源

- [ECMAScript 规范](https://tc39.es/ecma262/)
- [ECMAScript 提案](https://github.com/tc39/proposals)
- [MDN JavaScript 参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [ES6 入门教程](https://es6.ruanyifeng.com/)
- [caniuse.com](https://caniuse.com/) - 特性兼容性查询

---

[返回上级目录](../)
