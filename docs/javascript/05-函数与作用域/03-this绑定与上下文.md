# this 绑定与上下文

## 默认绑定

```javascript
// 严格模式下，this 为 undefined
function foo() {
    'use strict';
    console.log(this); // undefined
}

// 非严格模式下，this 为全局对象
function bar() {
    console.log(this); // window（浏览器）
}
```

---

## 隐式绑定

```javascript
const obj = {
    name: 'John',
    greet() {
        console.log(`Hello, ${this.name}!`);
    }
};

obj.greet(); // Hello, John!

// 丢失绑定
const greet = obj.greet;
greet(); // Hello, undefined!（this 丢失）

// 回调中丢失
setTimeout(obj.greet, 100); // Hello, undefined!
```

---

## 显式绑定（call、apply、bind）

```javascript
const obj = { name: 'John' };
const obj2 = { name: 'Jane' };

function greet(greeting) {
    console.log(`${greeting}, ${this.name}!`);
}

// call - 立即调用
greet.call(obj, 'Hello');  // Hello, John!
greet.call(obj2, 'Hi');    // Hi, Jane!

// apply - 参数为数组
greet.apply(obj, ['Hello']); // Hello, John!

// bind - 返回新函数
const greetJohn = greet.bind(obj);
greetJohn('Hello'); // Hello, John!

// bind 预设参数
const greetHello = greet.bind(obj, 'Hello');
greetHello(); // Hello, John!
```

---

## new 绑定

```javascript
function Person(name) {
    this.name = name;
}

const john = new Person('John');
console.log(john.name); // John

// new 做的事情：
// 1. 创建一个新对象
// 2. 原型链接到构造函数
// 3. 绑定 this
// 4. 返回新对象
```

---

## 箭头函数的 this

```javascript
const obj = {
    name: 'John',
    greet: function() {
        // 箭头函数没有自己的 this，继承外层
        const arrow = () => {
            console.log(this.name);
        };
        arrow(); // John
    }
};

// 对比普通函数
const obj2 = {
    name: 'John',
    greet: function() {
        setTimeout(() => {
            console.log(this.name); // John（继承外层）
        }, 100);
    }
};
```

---

## this 绑定优先级

new > 显式绑定 > 隐式绑定 > 默认绑定

```javascript
function foo() {
    console.log(this.a);
}

const obj = { a: 2, foo };
const bar = foo.bind({ a: 3 });

obj.foo();  // 2（隐式绑定）
bar.call({ a: 4 }); // 3（bind 不能被覆盖）

// new 优先级最高
const baz = new bar(); // this 是新对象，a 为 undefined
```

---

## 练习题

```javascript
// 1. 预测输出
const obj = {
    a: 1,
    foo() {
        console.log(this.a);
    },
    bar: () => {
        console.log(this.a);
    }
};

obj.foo();
obj.bar();

// 2. 如何让 obj.bar 输出 1？

// 3. 实现一个 call 方法
Function.prototype.myCall = function(context, ...args) {
    // 你的实现
};
```

---

[返回模块目录](./README.md)
