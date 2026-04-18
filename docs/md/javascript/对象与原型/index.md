# 对象与原型

JavaScript 是基于原型的面向对象语言。对象是 JavaScript 的核心数据结构，原型链是实现继承和属性查找的机制。理解对象与原型是掌握 JavaScript 的关键。

---

## 模块概述

JavaScript 的面向对象编程与其他语言（如 Java、C++）有本质区别。它不使用类作为模板（虽然 ES6 引入了 class 语法），而是通过原型链实现继承。本模块将深入探讨对象的创建、操作、原型机制以及现代 JavaScript 中的 Proxy 和 Reflect。

### 学习目标

- 掌握对象的创建、属性操作和遍历方法
- 理解原型链的工作原理和继承实现
- 熟练使用 ES6 class 语法和面向对象编程
- 掌握属性描述符和对象的精细控制
- 学会使用 Proxy 和 Reflect 进行元编程

---

## 📁 模块目录

| 序号 | 模块 | 文件 | 内容概述 |
|------|------|------|----------|
| 1 | 对象操作 | [对象操作.md](./对象操作.md) | 创建、访问、遍历、复制、合并、冻结、比较 |
| 2 | 原型与继承 | [原型与继承.md](./原型与继承.md) | 原型链、继承模式、原型继承、构造函数继承 |
| 3 | 类与面向对象 | [类与面向对象.md](./类与面向对象.md) | class 语法、继承、静态成员、私有字段、new.target |
| 4 | 属性描述符 | [属性描述符.md](./属性描述符.md) | defineProperty、getter/setter、writable、enumerable、configurable |
| 5 | Proxy 与 Reflect | [Proxy与Reflect.md](./Proxy与Reflect.md) | 代理模式、拦截操作、Reflect API、响应式原理 |

---

## 核心概念速览

### 对象创建方式

```javascript
// 1. 对象字面量（最常用）
const obj = { name: 'John', age: 30 };

// 2. new Object()
const obj2 = new Object();
obj2.name = 'John';

// 3. Object.create()（指定原型）
const proto = { greet() { console.log('Hello'); } };
const obj3 = Object.create(proto);

// 4. 构造函数
function Person(name) { this.name = name; }
const obj4 = new Person('John');

// 5. ES6 class
class PersonClass {
  constructor(name) { this.name = name; }
}
const obj5 = new PersonClass('John');
```

### 原型链

```javascript
// 每个对象都有一个原型对象
// 对象从原型继承方法和属性

const obj = {};
console.log(obj.__proto__ === Object.prototype);  // true
console.log(Object.prototype.__proto__);           // null（原型链终点）

// 属性查找：自身 → 原型 → 原型的原型 → ... → null
obj.toString();  // 来自 Object.prototype

// 原型链图示
/*
对象实例
    ↓ __proto__
构造函数.prototype
    ↓ __proto__
Object.prototype
    ↓ __proto__
null
*/
```

### 属性描述符

```javascript
const obj = {};

Object.defineProperty(obj, 'name', {
  value: 'John',       // 属性值
  writable: false,     // 不可修改
  enumerable: true,    // 可枚举
  configurable: false  // 不可删除/重新配置
});

// getter/setter
Object.defineProperty(obj, 'age', {
  get() { return this._age; },
  set(value) { this._age = value; }
});
```

### 类语法

```javascript
class Person {
  // 私有字段（ES2022）
  #secret = 'hidden';
  
  // 静态成员
  static species = 'human';
  
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // 方法
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  // 静态方法
  static create(name, age) {
    return new Person(name, age);
  }
  
  // getter/setter
  get info() {
    return `${this.name}, ${this.age}`;
  }
}

// 继承
class Employee extends Person {
  constructor(name, age, title) {
    super(name, age);  // 必须先调用 super
    this.title = title;
  }
}
```

### Proxy 与 Reflect

```javascript
// Proxy：拦截对象操作
const target = { name: 'John', age: 30 };

const proxy = new Proxy(target, {
  get(obj, prop) {
    console.log(`Getting ${prop}`);
    return Reflect.get(obj, prop);
  },
  
  set(obj, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    return Reflect.set(obj, prop, value);
  }
});

proxy.name;       // Getting name
proxy.age = 31;   // Setting age to 31
```

---

## 知识关联

### 与其他模块的关系

```
对象与原型
    ├── 基础语法与核心概念（数据类型、变量）
    ├── 函数与作用域（构造函数、this）
    ├── ES6+新特性（class、Proxy、Reflect）
    └── 设计模式（原型模式、工厂模式）
```

### 核心概念关系图

```
┌─────────────────────────────────────────────────┐
│                    Object                        │
│  ┌─────────────┐  ┌─────────────┐               │
│  │ 自身属性     │  │ 原型属性    │               │
│  │ (own)       │  │ (prototype) │               │
│  └─────────────┘  └─────────────┘               │
│         ↓                ↓                       │
│  ┌─────────────────────────────────────┐        │
│  │          属性描述符                  │        │
│  │  value | writable | enumerable |     │        │
│  │  configurable | get | set            │        │
│  └─────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
         ↓                    ↓
┌─────────────┐      ┌─────────────┐
│   Proxy     │      │   class     │
│  (拦截操作) │      │  (语法糖)   │
└─────────────┘      └─────────────┘
```

---

## 常见陷阱

### 1. this 指向问题

```javascript
const obj = {
  name: 'John',
  greet: () => {
    console.log(this.name);  // undefined（箭头函数没有 this）
  },
  greet2() {
    console.log(this.name);  // 'John'
  }
};

// 解构后 this 丢失
const { greet2 } = obj;
greet2();  // undefined（this 指向全局或 undefined）
```

### 2. 原型污染

```javascript
// 危险：修改 Object.prototype
Object.prototype.xxx = 'danger';

const obj = {};
console.log(obj.xxx);  // 'danger'（所有对象都受影响）

// 防护
for (const key in obj) {
  if (Object.hasOwn(obj, key)) {  // 只处理自身属性
    // ...
  }
}
```

### 3. 浅拷贝陷阱

```javascript
const original = { a: { b: 1 } };
const copy = { ...original };

copy.a.b = 2;
console.log(original.a.b);  // 2（原对象也被修改）

// 深拷贝方案
const deepCopy = JSON.parse(JSON.stringify(original));
// 或使用 structuredClone
const deepCopy2 = structuredClone(original);
```

### 4. getter/setter 不被复制

```javascript
const source = {
  get value() { return 1; }
};

// Object.assign 和展开运算符会丢失 getter
const copy = { ...source };
console.log(Object.getOwnPropertyDescriptor(copy, 'value'));
// { value: 1, writable: true, enumerable: true, configurable: true }
// getter 变成了普通属性

// 使用 Object.getOwnPropertyDescriptors 保留
const copy2 = Object.create(
  Object.getPrototypeOf(source),
  Object.getOwnPropertyDescriptors(source)
);
```

---

## 最佳实践

### 对象创建

```javascript
// ✅ 使用字面量创建简单对象
const obj = { name: 'John' };

// ✅ 使用 class 创建复杂对象
class Person {
  #private = 'secret';  // 私有字段
  
  constructor(name) {
    this.name = name;
  }
}

// ✅ 使用 Object.create(null) 创建纯字典
const dict = Object.create(null);
dict.key = 'value';  // 没有继承的属性
```

### 属性访问

```javascript
// ✅ 使用可选链
const city = user?.address?.city;

// ✅ 使用 Object.hasOwn 检查属性
if (Object.hasOwn(obj, 'key')) { /* ... */ }

// ❌ 避免 __proto__
// 使用 Object.getPrototypeOf / setPrototypeOf
```

### 不可变对象

```javascript
// ✅ 根据需求选择保护级别
const obj = { a: 1 };

Object.preventExtensions(obj);  // 禁止添加
Object.seal(obj);              // 禁止添加/删除
Object.freeze(obj);            // 完全冻结

// ✅ 深度冻结
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(v => {
    if (v && typeof v === 'object') deepFreeze(v);
  });
}
```

---

## 学习路径

### 初级：基础操作
1. 掌握对象的创建和属性访问
2. 理解对象引用和浅拷贝
3. 学会使用 Object.keys/values/entries
4. 理解 for...in 和 for...of 的区别

### 中级：原型与继承
1. 理解原型链的工作原理
2. 掌握各种继承模式的实现
3. 学会使用 ES6 class 语法
4. 理解 super 和构造函数的关系

### 高级：元编程
1. 掌握属性描述符的使用
2. 学会使用 Proxy 实现响应式
3. 理解 Reflect API 的作用
4. 实现自定义的对象行为拦截

---

## 推荐资源

### 官方文档
- [MDN - Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [MDN - 类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
- [MDN - Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

### 深入学习
- [You Don't Know JS - this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS)
- [JavaScript Info - Objects](https://javascript.info/object)
- [JavaScript Info - Property flags and descriptors](https://javascript.info/property-descriptors)

---

[返回上级目录](../)
