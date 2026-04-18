# this 绑定与上下文

`this` 是 JavaScript 中最复杂的机制之一。它的值取决于函数的调用方式，而非函数定义的位置。

---

## 概述

### this 是什么

`this` 是函数执行时的上下文对象，它的值在函数被调用时确定：

```javascript
function identify() {
  return this.name.toUpperCase();
}

const person1 = { name: 'John', identify };
const person2 = { name: 'Jane', identify };

person1.identify();  // "JOHN"
person2.identify();  // "JANE"

// 同一个函数，不同的调用对象，this 值不同
```

### 为什么要用 this

```javascript
// 不使用 this
function identify(context) {
  return context.name.toUpperCase();
}

const person = { name: 'John' };
identify(person);  // 需要显式传递上下文

// 使用 this（更优雅）
function identify() {
  return this.name.toUpperCase();
}

const person = { name: 'John', identify };
person.identify();  // this 自动指向 person
```

**`this` 的优势**：
- 隐式传递对象引用
- 实现方法复用
- 支持原型继承
- 更优雅的 API 设计

---

## this 绑定规则

JavaScript 有 4 种 this 绑定规则，按优先级从低到高：

### 1. 默认绑定

独立函数调用时，应用默认绑定。

#### 非严格模式

```javascript
// 非严格模式下，this 指向全局对象
function foo() {
  console.log(this);  // window（浏览器）
}

foo();  // window

// 在全局环境
var a = 2;
function bar() {
  console.log(this.a);  // 2
}
bar();
```

#### 严格模式

```javascript
// 严格模式下，this 为 undefined
function foo() {
  'use strict';
  console.log(this);  // undefined
}

foo();  // undefined

// 注意：严格模式只影响函数内部的 this
function foo() {
  'use strict';
  console.log(this);  // undefined
}

function bar() {
  console.log(this);  // window
}

// 在严格模式下调用非严格模式函数
foo();  // undefined
bar();  // window
```

#### 全局对象

```javascript
// 浏览器环境
console.log(this === window);  // true

// Node.js 环境
console.log(this === global);  // true（全局作用域）

// 全局变量
var a = 2;
console.log(window.a);  // 2
console.log(this.a);    // 2
```

---

### 2. 隐式绑定

当函数作为对象的方法调用时，`this` 指向该对象。

#### 基本用法

```javascript
const obj = {
  name: 'John',
  greet() {
    console.log(`Hello, ${this.name}!`);
  }
};

obj.greet();  // "Hello, John!"
// this 指向 obj（调用位置的对象）
```

#### 对象引用链

```javascript
const obj = {
  name: 'John',
  child: {
    name: 'Jane',
    greet() {
      console.log(`Hello, ${this.name}!`);
    }
  }
};

obj.child.greet();  // "Hello, Jane!"
// 只有最后一层对象影响 this
```

#### this 丢失问题

**最常见的问题**：隐式绑定的函数丢失绑定。

```javascript
const obj = {
  name: 'John',
  greet() {
    console.log(`Hello, ${this.name}!`);
  }
};

// 情况1：赋值给变量
const greet = obj.greet;
greet();  // "Hello, undefined!"
// this 丢失，应用默认绑定

// 情况2：作为回调传递
setTimeout(obj.greet, 100);  // "Hello, undefined!"
// 参数传递时 this 丢失

// 情况3：数组方法
const people = [obj];
people[0].greet();  // "Hello, John!" ✅
const fn = people[0].greet;
fn();  // "Hello, undefined!" ❌

// 情况4：解构赋值
const { greet } = obj;
greet();  // "Hello, undefined!"
```

#### 为什么会丢失

```javascript
// 调用位置决定 this
obj.greet();  // greet() 在 obj 上下文中调用

const greet = obj.greet;
greet();      // greet() 作为独立函数调用
              // 等同于调用位置：greet()
              // 没有对象上下文，应用默认绑定
```

#### 解决方案

```javascript
const obj = {
  name: 'John',
  greet() {
    console.log(`Hello, ${this.name}!`);
  }
};

// 方案1：使用包装函数
setTimeout(function() {
  obj.greet();  // "Hello, John!"
}, 100);

// 方案2：使用 bind
setTimeout(obj.greet.bind(obj), 100);

// 方案3：箭头函数
setTimeout(() => obj.greet(), 100);
```

---

### 3. 显式绑定

使用 `call`、`apply` 或 `bind` 显式指定 `this`。

#### call()

立即调用函数，指定 `this` 和参数列表。

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'John' };

greet.call(person, 'Hello', '!');  // "Hello, John!"
// 参数逐个传递
```

**实现原理**：

```javascript
// 简化版实现
Function.prototype.myCall = function(context, ...args) {
  // 1. 处理 context
  context = context ?? window;
  if (typeof context !== 'object') {
    context = Object(context);  // 原始值转为对象
  }

  // 2. 创建唯一键
  const key = Symbol();

  // 3. 将函数设为对象的属性
  context[key] = this;

  // 4. 执行函数
  const result = context[key](...args);

  // 5. 删除属性
  delete context[key];

  // 6. 返回结果
  return result;
};
```

#### apply()

立即调用函数，指定 `this` 和参数数组。

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'John' };

greet.apply(person, ['Hello', '!']);  // "Hello, John!"
// 参数以数组形式传递

// 实际应用：Math.max
const numbers = [1, 5, 3, 9, 2];
Math.max.apply(null, numbers);  // 9
// ES6 更好的写法：
Math.max(...numbers);  // 9
```

**实现原理**：

```javascript
Function.prototype.myApply = function(context, args) {
  context = context ?? window;
  const key = Symbol();
  context[key] = this;
  const result = context[key](...args);
  delete context[key];
  return result;
};
```

#### call vs apply

```javascript
function example(a, b, c) {
  console.log(a, b, c);
}

const obj = {};

// call - 参数逐个传递
example.call(obj, 1, 2, 3);

// apply - 参数以数组传递
example.apply(obj, [1, 2, 3]);

// 记忆技巧：
// C - Comma（逗号分隔）
// A - Array（数组形式）
```

#### bind()

返回新函数，永久绑定 `this`。

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'John' };

// 基本用法
const greetJohn = greet.bind(person);
greetJohn('Hello', '!');  // "Hello, John!"

// 预设参数（柯里化）
const greetHello = greet.bind(person, 'Hello');
greetHello('!');  // "Hello, John!"

const greetHelloExclaim = greet.bind(person, 'Hello', '!');
greetHelloExclaim();  // "Hello, John!"
```

**bind 的特性**：

```javascript
// 1. 永久绑定（无法被覆盖）
const bound = greet.bind(person);
bound.call({ name: 'Jane' }, 'Hi', '!');  // 仍然是 "Hello, John!"

// 2. new 操作符优先级更高
function Person(name) {
  this.name = name;
}

const BoundPerson = Person.bind({ name: 'Bound' });
const p = new BoundPerson('John');
console.log(p.name);  // "John"（new 优先级更高）

// 3. bind 后的函数没有 prototype
const boundFunc = function() {}.bind({});
console.log(boundFunc.prototype);  // undefined

// 4. bind 后的函数 length 属性
function foo(a, b, c) {}
const boundFoo = foo.bind(null, 1);
console.log(boundFoo.length);  // 2（减去已绑定参数）
```

**实现原理**：

```javascript
Function.prototype.myBind = function(context, ...bindArgs) {
  const fn = this;

  const bound = function(...callArgs) {
    // new 操作符时，this 指向新实例
    const isNewCall = this instanceof bound;
    const thisArg = isNewCall ? this : context;

    // 合并参数
    const allArgs = [...bindArgs, ...callArgs];

    return fn.apply(thisArg, allArgs);
  };

  // 继承原函数的 prototype
  bound.prototype = Object.create(fn.prototype);

  return bound;
};
```

#### 硬绑定

```javascript
// 硬绑定模式
function bind(fn, context) {
  return function(...args) {
    return fn.apply(context, args);
  };
}

const obj = { name: 'John' };
function greet() {
  console.log(this.name);
}

const hardBoundGreet = bind(greet, obj);
hardBoundGreet();  // "John"

// 即使尝试改变 this 也无效
hardBoundGreet.call({ name: 'Jane' });  // 仍然是 "John"
```

#### 实际应用

```javascript
// 1. 事件处理器
class Button {
  constructor(text) {
    this.text = text;
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    console.log(`Button clicked: ${this.text}`);
  }

  render() {
    const btn = document.createElement('button');
    btn.textContent = this.text;
    btn.addEventListener('click', this.onClick);
    return btn;
  }
}

// 2. 定时器
class Timer {
  constructor() {
    this.seconds = 0;
    this.start = this.start.bind(this);
  }

  start() {
    setInterval(function() {
      this.seconds++;
      console.log(this.seconds);
    }.bind(this), 1000);
  }
}

// 3. 借用方法
const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
};

// 借用数组的 map 方法
const result = Array.prototype.map.call(arrayLike, function(item) {
  return item.toUpperCase();
});
console.log(result);  // ['A', 'B', 'C']

// 借用数组的 slice 方法
const arr = Array.prototype.slice.call(arrayLike);
console.log(arr);  // ['a', 'b', 'c']
```

---

### 4. new 绑定

使用 `new` 操作符调用构造函数时，`this` 指向新创建的对象。

#### new 的过程

```javascript
function Person(name) {
  this.name = name;
}

const john = new Person('John');

// new 做了 4 件事：
// 1. 创建一个新对象
// 2. 将新对象的 [[Prototype]] 链接到构造函数的 prototype
// 3. 执行构造函数，绑定 this 到新对象
// 4. 如果构造函数返回对象，则返回该对象；否则返回新对象

// 手动模拟
function myNew(Constructor, ...args) {
  // 1. 创建新对象，原型链接
  const obj = Object.create(Constructor.prototype);

  // 2. 执行构造函数，绑定 this
  const result = Constructor.apply(obj, args);

  // 3. 返回对象或新对象
  return result instanceof Object ? result : obj;
}

const jane = myNew(Person, 'Jane');
console.log(jane.name);  // "Jane"
```

#### 构造函数返回值

```javascript
// 返回原始值（忽略）
function Person1(name) {
  this.name = name;
  return 'ignore';  // 原始值被忽略
}
const p1 = new Person1('John');
console.log(p1.name);  // "John"

// 返回对象（使用返回值）
function Person2(name) {
  this.name = name;
  return { custom: true };  // 对象被使用
}
const p2 = new Person2('John');
console.log(p2.name);     // undefined
console.log(p2.custom);   // true
```

---

## 箭头函数的 this

### 特点

箭头函数没有自己的 `this`，它会捕获外层作用域的 `this` 值。

```javascript
const obj = {
  name: 'John',

  // 普通函数
  greet: function() {
    console.log(this.name);  // "John"
  },

  // 箭头函数
  greetArrow: () => {
    console.log(this.name);  // undefined
    // 箭头函数没有自己的 this
    // 外层作用域是全局作用域，this 为 window/undefined
  }
};

obj.greet();       // "John"
obj.greetArrow();  // undefined
```

### this 的词法绑定

```javascript
const obj = {
  name: 'John',

  greet: function() {
    // 箭头函数捕获外层 this（即 obj）
    const arrow = () => {
      console.log(this.name);  // "John"
    };
    arrow();
  }
};

obj.greet();  // "John"
```

### 实际应用

#### 解决回调中的 this 丢失

```javascript
const obj = {
  name: 'John',
  friends: ['Jane', 'Jack'],

  showFriends: function() {
    // ❌ 普通函数，this 丢失
    this.friends.forEach(function(friend) {
      console.log(`${this.name} knows ${friend}`);
      // this.name 为 undefined
    });

    // ✅ 箭头函数，继承外层 this
    this.friends.forEach(friend => {
      console.log(`${this.name} knows ${friend}`);
      // "John knows Jane"
      // "John knows Jack"
    });
  }
};

obj.showFriends();
```

#### 事件处理器

```javascript
class Button {
  constructor(text) {
    this.text = text;
  }

  setup() {
    const btn = document.querySelector('button');

    // ❌ 普通函数，this 指向元素
    btn.addEventListener('click', function() {
      console.log(this.text);  // undefined（this 是按钮元素）
    });

    // ✅ 箭头函数，继承外层 this
    btn.addEventListener('click', () => {
      console.log(this.text);  // 正确
    });
  }
}
```

#### 定时器

```javascript
const obj = {
  name: 'John',

  // ❌ 普通函数
  delayGreet: function() {
    setTimeout(function() {
      console.log(this.name);  // undefined
    }, 100);
  },

  // ✅ 箭头函数
  delayGreetArrow: function() {
    setTimeout(() => {
      console.log(this.name);  // "John"
    }, 100);
  }
};
```

### 箭头函数的限制

```javascript
// 1. 没有 this
const arrow = () => {
  console.log(this);
};
arrow.call({ name: 'John' });  // window/undefined（无法绑定）

// 2. 没有 arguments
const arrow = () => {
  console.log(arguments);  // ReferenceError
};

// 3. 不能用作构造函数
const Arrow = () => {};
new Arrow();  // TypeError

// 4. 没有 prototype
const arrow = () => {};
console.log(arrow.prototype);  // undefined

// 5. 不能用作 Generator
const arrow = () => {
  yield 1;  // SyntaxError
};
```

### 箭头函数 vs bind

```javascript
const obj = { name: 'John' };

function greet() {
  console.log(this.name);
}

// 使用 bind
const boundGreet = greet.bind(obj);
setTimeout(boundGreet, 100);

// 使用箭头函数
setTimeout(() => greet.call(obj), 100);

// 箭头函数更简洁
setTimeout(() => console.log(obj.name), 100);
```

---

## this 绑定优先级

优先级从高到低：

1. **new 绑定**
2. **显式绑定**（call、apply、bind）
3. **隐式绑定**（对象方法）
4. **默认绑定**（独立调用）

### 验证优先级

```javascript
function foo(something) {
  this.a = something;
}

// 显式绑定 vs 默认绑定
const obj1 = { foo };
obj1.foo(2);
console.log(obj1.a);  // 2（隐式绑定）

const obj2 = {};
foo.call(obj2, 3);
console.log(obj2.a);  // 3（显式绑定优先级更高）

// new 绑定 vs 显式绑定
const bar = foo.bind(obj2);
const obj3 = new bar(4);
console.log(obj2.a);  // 3（bind 的 this 未被改变）
console.log(obj3.a);  // 4（new 优先级最高）
```

### 判断 this 的流程

```javascript
// 1. 函数是否在 new 中调用？是 -> this 是新对象
const p = new Person();

// 2. 函数是否通过 call/apply/bind 调用？是 -> this 是指定的对象
greet.call(obj);
greet.apply(obj);
const bound = greet.bind(obj);

// 3. 函数是否在某个上下文对象中调用？是 -> this 是该对象
obj.greet();

// 4. 都不是？使用默认绑定
greet();  // 严格模式：undefined，非严格模式：全局对象
```

---

## 特殊情况

### 忽略 this

```javascript
// call/apply/bind 传入 null/undefined 时被忽略
function foo() {
  console.log(this);
}

foo.call(null);       // window（非严格模式）
foo.call(undefined);  // window（非严格模式）
foo.bind(null)();     // window

// 更安全的做法：使用空对象
const ø = Object.create(null);
foo.call(ø);  // ø（安全，避免意外修改全局对象）
```

### 间接引用

```javascript
function foo() {
  console.log(this.a);
}

const obj1 = { a: 2, foo };
const obj2 = { a: 3 };

(obj2.foo = obj1.foo)();  // undefined
// 间接引用表达式的值是 foo 函数
// 函数作为独立函数调用，应用默认绑定
```

### 软绑定

```javascript
// 硬绑定无法被覆盖，软绑定提供灵活性
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function(context, ...args) {
    const fn = this;

    const bound = function(...callArgs) {
      // 如果 this 是全局对象或 undefined，使用指定的 context
      // 否则保持 this 不变
      const thisArg = (!this || this === window || this === global)
        ? context
        : this;

      return fn.apply(thisArg, [...args, ...callArgs]);
    };

    bound.prototype = Object.create(fn.prototype);
    return bound;
  };
}

// 使用
function foo() {
  console.log(this.name);
}

const obj = { name: 'obj', foo };
const obj2 = { name: 'obj2' };

const boundFoo = foo.softBind(obj);
boundFoo();  // "obj"（默认绑定到 obj）

obj2.foo = boundFoo;
obj2.foo();  // "obj2"（可以重新绑定）
```

---

## 常见错误

### 1. 误解 this 指向

```javascript
// ❌ 错误：认为 this 指向函数自身
function foo(num) {
  console.log(`foo: ${num}`);
  this.count++;
}

foo.count = 0;

for (let i = 0; i < 5; i++) {
  foo(i);
}

console.log(foo.count);  // 0（没有变化）
// this 不是 foo，而是 window

// ✅ 正确方案1：使用 foo 标识符
function foo(num) {
  console.log(`foo: ${num}`);
  foo.count++;
}

// ✅ 正确方案2：强制 this 指向 foo
function foo(num) {
  console.log(`foo: ${num}`);
  this.count++;
}

foo.call(foo, i);
```

### 2. 箭头函数误用

```javascript
const obj = {
  name: 'John',

  // ❌ 错误：对象字面量中的箭头函数
  greet: () => {
    console.log(this.name);  // undefined
  },

  // ✅ 正确：使用普通函数
  greet: function() {
    console.log(this.name);  // "John"
  }
};
```

### 3. 方法提取

```javascript
const obj = {
  name: 'John',
  greet() {
    console.log(this.name);
  }
};

// ❌ 错误
const greet = obj.greet;
greet();  // undefined

// ✅ 正确
const greet = obj.greet.bind(obj);
greet();  // "John"
```

---

## 最佳实践

### 1. 明确 this 绑定

```javascript
class Component {
  constructor() {
    // 构造函数中绑定方法
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this);
  }
}

// 或使用箭头函数（类字段）
class Component {
  handleClick = () => {
    console.log(this);
  };
}
```

### 2. 选择合适的函数类型

```javascript
const obj = {
  name: 'John',

  // 方法：使用普通函数
  greet() {
    console.log(this.name);
  },

  // 回调：使用箭头函数
  showFriends() {
    this.friends.forEach(friend => {
      console.log(`${this.name} knows ${friend}`);
    });
  }
};
```

### 3. 避免使用 null/undefined

```javascript
// ❌ 不安全
foo.call(null);

// ✅ 安全
const emptyObj = Object.create(null);
foo.call(emptyObj);
```

---

## 练习题

### 题目1

```javascript
var name = 'window';

const obj = {
  name: 'obj',

  foo: function() {
    console.log(this.name);
  },

  bar: () => {
    console.log(this.name);
  }
};

obj.foo();     // ?
obj.bar();     // ?

const foo = obj.foo;
foo();         // ?

const bar = obj.bar;
bar();         // ?
```

<details>
<summary>答案</summary>

```javascript
obj.foo();     // "obj"（隐式绑定）
obj.bar();     // "window"（箭头函数，外层作用域）

const foo = obj.foo;
foo();         // "window"（默认绑定）

const bar = obj.bar;
bar();         // "window"（箭头函数，this 已确定）
```
</details>

### 题目2

```javascript
const obj = {
  name: 'obj',

  foo: function() {
    console.log(this.name);
  }
};

const obj2 = { name: 'obj2' };

obj.foo.call(obj2);           // ?
new obj.foo();                // ?

const boundFoo = obj.foo.bind(obj2);
new boundFoo();               // ?
```

<details>
<summary>答案</summary>

```javascript
obj.foo.call(obj2);           // "obj2"（显式绑定）
new obj.foo();                // undefined（new 绑定，新对象没有 name）

const boundFoo = obj.foo.bind(obj2);
new boundFoo();               // undefined（new 优先级高于 bind）
```
</details>

### 题目3

```javascript
function Foo() {
  getName = function() {
    console.log(1);
  };
  return this;
}

Foo.getName = function() {
  console.log(2);
};

Foo.prototype.getName = function() {
  console.log(3);
};

var getName = function() {
  console.log(4);
};

function getName() {
  console.log(5);
}

// 输出？
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```

<details>
<summary>答案</summary>

```javascript
Foo.getName();              // 2（静态方法）
getName();                  // 4（变量提升后，函数被覆盖）
Foo().getName();            // 1（Foo() 返回 this 即 window，getName 被重新赋值）
getName();                  // 1（已被重新赋值）
new Foo.getName();          // 2（new 静态方法）
new Foo().getName();        // 3（原型方法）
new new Foo().getName();    // 3（new 原型方法）
```
</details>

---

## 参考资源

- 《你不知道的 JavaScript（上卷）》第二章：this 全面解析
- [MDN - this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
- [JavaScript Info - Object methods, "this"](https://javascript.info/object-methods)

---

[返回模块目录](./)
