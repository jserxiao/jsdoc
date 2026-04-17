# 五、函数与作用域

> 函数是 JavaScript 的一等公民，是代码复用和模块化的基础。理解函数与作用域是掌握 JavaScript 的关键。

## 📁 模块目录

| 序号 | 主题 | 文件 | 核心内容 |
|------|------|------|----------|
| 1 | 函数基础 | [01-函数基础.md](./01-函数基础.md) | 函数定义、参数传递、IIFE、递归 |
| 2 | 高阶函数 | [02-高阶函数.md](./02-高阶函数.md) | 回调函数、map/filter/reduce、函数工厂 |
| 3 | this 绑定与上下文 | [03-this绑定与上下文.md](./03-this绑定与上下文.md) | 四种绑定规则、箭头函数、优先级 |
| 4 | 闭包 | [04-闭包.md](./04-闭包.md) | 闭包原理、应用场景、内存管理 |
| 5 | 执行上下文与调用栈 | [05-执行上下文与调用栈.md](./05-执行上下文与调用栈.md) | 变量对象、作用域链、调用栈 |
| 6 | 函数柯里化与偏函数 | [06-函数柯里化与偏函数.md](./06-函数柯里化与偏函数.md) | 柯里化实现、偏函数应用 |

---

## 🎯 学习目标

通过本模块的学习，你将能够：

1. **掌握函数的定义方式** - 理解函数声明、函数表达式、箭头函数的区别
2. **理解参数传递机制** - 掌握默认参数、剩余参数、解构参数的使用
3. **深入理解 this** - 掌握四种 this 绑定规则及其优先级
4. **掌握闭包原理** - 理解闭包的形成条件和应用场景
5. **理解执行机制** - 掌握执行上下文、作用域链、调用栈的工作原理
6. **运用函数式编程** - 学会使用柯里化、偏函数等技术

---

## 📚 核心概念

### 函数的定义方式

```javascript
// 1. 函数声明（会被提升）
function greet(name) {
    return `Hello, ${name}!`;
}

// 2. 函数表达式
const sayHi = function(name) {
    return `Hi, ${name}!`;
};

// 3. 箭头函数（ES6）
const sayHello = (name) => `Hello, ${name}!`;

// 4. 函数构造器（不推荐）
const sayYo = new Function('name', 'return `Yo, ${name}!`');
```

### this 绑定四规则

```javascript
// 1. 默认绑定
function foo() {
    console.log(this); // window（非严格模式）/ undefined（严格模式）
}
foo();

// 2. 隐式绑定
const obj = {
    name: 'John',
    greet() { console.log(this.name); }
};
obj.greet(); // 'John'

// 3. 显式绑定
function bar() { console.log(this.name); }
bar.call({ name: 'John' });   // 'John'
bar.apply({ name: 'Jane' });  // 'Jane'
const bound = bar.bind({ name: 'Bob' });
bound(); // 'Bob'

// 4. new 绑定
function Person(name) { this.name = name; }
const p = new Person('John'); // this 指向新创建的对象

// 优先级：new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定
```

### 闭包的本质

```javascript
// 闭包 = 函数 + 词法环境
function createCounter() {
    let count = 0; // 私有变量
    
    return {
        increment() { return ++count; },
        decrement() { return --count; },
        getCount() { return count; }
    };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
// count 无法直接访问，实现了数据私有化
```

### 执行上下文生命周期

```
创建阶段：
┌─────────────────────────────────────┐
│  1. 创建变量对象（VO）               │
│     - 处理参数（arguments）          │
│     - 函数声明（提升）               │
│     - 变量声明（undefined）          │
│  2. 建立作用域链                    │
│  3. 确定 this 值                     │
└─────────────────────────────────────┘
              ↓
执行阶段：
┌─────────────────────────────────────┐
│  1. 变量赋值                        │
│  2. 函数引用                        │
│  3. 执行其他代码                    │
└─────────────────────────────────────┘
```

---

## 🔄 知识关联

```
函数定义 ──→ 作用域 ──→ 闭包
    │           │         │
    ↓           ↓         ↓
  this绑定 ←── 执行上下文 ←── 调用栈
    │
    ↓
 高阶函数 ──→ 柯里化/偏函数
```

---

## ⚠️ 常见陷阱

### 1. 循环中的闭包问题

```javascript
// ❌ 问题代码
for (var i = 1; i <= 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// 输出：4, 4, 4

// ✅ 解决方案1：使用 let
for (let i = 1; i <= 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// 输出：1, 2, 3

// ✅ 解决方案2：使用 IIFE
for (var i = 1; i <= 3; i++) {
    ((j) => {
        setTimeout(() => console.log(j), 100);
    })(i);
}
```

### 2. this 丢失问题

```javascript
const obj = {
    name: 'John',
    greet() { console.log(this.name); }
};

// ❌ this 丢失
const greet = obj.greet;
greet(); // undefined

// ✅ 解决方案
const greetBound = obj.greet.bind(obj);
greetBound(); // 'John'

// ✅ 使用箭头函数
setTimeout(() => obj.greet(), 100); // 'John'
```

### 3. 箭头函数的 this

```javascript
const obj = {
    name: 'John',
    
    // ❌ 箭头函数没有自己的 this
    greetArrow: () => {
        console.log(this.name); // undefined
    },
    
    // ✅ 使用普通函数
    greet() {
        console.log(this.name); // 'John'
    }
};
```

---

## 💡 最佳实践

### 1. 选择合适的函数定义方式

```javascript
const obj = {
    name: 'John',
    
    // 方法：使用普通函数（需要 this）
    greet() {
        console.log(this.name);
    },
    
    // 回调：使用箭头函数（继承 this）
    showFriends() {
        this.friends.forEach(friend => {
            console.log(`${this.name} knows ${friend}`);
        });
    }
};
```

### 2. 合理使用闭包

```javascript
// ✅ 实现私有变量
function createCounter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
}

// ⚠️ 注意内存泄漏
function setupHandler() {
    const largeData = new Array(1000000).fill('x');
    
    // ❌ 保留了大数组引用
    element.addEventListener('click', () => {
        console.log(largeData.length);
    });
    
    // ✅ 只保留需要的值
    const length = largeData.length;
    element.addEventListener('click', () => {
        console.log(length);
    });
}
```

### 3. 高阶函数的使用

```javascript
// 数据处理管道
const data = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
    { name: 'Bob', age: 35 }
];

const processNames = (data) => data
    .filter(item => item.age >= 30)
    .map(item => item.name)
    .sort();

console.log(processNames(data)); // ['Bob', 'John']
```

---

## 🗺️ 学习路径

```
初级阶段：
1. 学习函数的定义方式（声明、表达式、箭头函数）
2. 理解参数传递（默认参数、剩余参数）
3. 掌握基本的数组方法（map、filter、reduce）

中级阶段：
4. 深入理解 this 绑定规则
5. 理解闭包的原理和应用
6. 掌握执行上下文和作用域链

高级阶段：
7. 掌握柯里化和偏函数
8. 学习函数组合和管道
9. 实践函数式编程范式
```

---

## 📖 推荐资源

### 书籍
- 《你不知道的 JavaScript（上卷）》- 第二部分：this 和对象原型
- 《JavaScript 高级程序设计》- 函数、变量、作用域与内存
- 《JavaScript 函数式编程》

### 在线资源
- [MDN - 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)
- [JavaScript Info - 函数](https://javascript.info/functions)
- [JavaScript Info - 闭包](https://javascript.info/closure)

---

## 📝 练习建议

1. **实现一个防抖函数** - 理解闭包和定时器的结合
2. **实现 call/apply/bind** - 深入理解 this 绑定
3. **实现柯里化函数** - 掌握高阶函数的应用
4. **分析执行上下文** - 画出调用栈和作用域链
5. **手写 Promise** - 综合运用闭包、this、异步

---

[返回上级目录](../index.md)
