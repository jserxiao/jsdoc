# ES近年新特性

JavaScript 持续演进，每年都会发布新特性。本文档详细介绍 ES2020 至 ES2024 的重要新特性。

---

## 目录

- [ES2020](#es2020)
- [ES2021](#es2021)
- [ES2022](#es2022)
- [ES2023](#es2023)
- [ES2024](#es2024)
- [特性兼容性检测](#特性兼容性检测)

---

## ES2020

### 可选链操作符 (Optional Chaining)

```javascript
const user = {
  profile: {
    address: {
      city: 'NYC'
    }
  }
};

// 传统方式
const city = user && user.profile && user.profile.address && user.profile.address.city;

// 可选链
const city = user?.profile?.address?.city; // 'NYC'
const country = user?.profile?.address?.country; // undefined

// 与方法调用结合
const result = obj?.method?.();

// 与数组访问结合
const first = arr?.[0];

// 与构造函数结合
const instance = new Class?.();

// 实际应用：API 响应处理
const userName = response?.data?.user?.name ?? 'Unknown';

// 链式调用
const value = obj
  ?.method?.()
  ?.property
  ?.nested?.();

// 注意事项
// 1. 不能用于赋值
// user?.profile = {}; // SyntaxError

// 2. 对 null/undefined 以外的 falsy 值不生效
const obj = { count: 0 };
console.log(obj?.count); // 0（不是 undefined）

// 3. 短路评估
obj?.method?.(); // 如果 obj 是 null/undefined，不会执行 method
```

### 空值合并操作符 (Nullish Coalescing)

```javascript
// || 操作符的问题
const value = 0;
const result = value || 'default'; // 'default'（0 被 falsy 判断）

// ?? 只在 null/undefined 时使用默认值
const result = value ?? 'default'; // 0

// 各种情况
null ?? 'default';     // 'default'
undefined ?? 'default'; // 'default'
0 ?? 'default';        // 0
'' ?? 'default';       // ''
false ?? 'default';    // false
NaN ?? 'default';      // NaN

// 与可选链结合
const city = user?.profile?.address?.city ?? 'Unknown';

// 短路评估
const value = null ?? console.log('executed'); // 打印 'executed'
const value2 = 0 ?? console.log('not executed'); // 不打印

// 优先级
// ?? 优先级低于 || 和 &&
null || undefined ?? 'default'; // SyntaxError
(null || undefined) ?? 'default'; // 'default'

// 实际应用
function getConfig(options) {
  return {
    timeout: options.timeout ?? 5000,
    retries: options.retries ?? 3,
    enabled: options.enabled ?? true
  };
}
```

### BigInt

```javascript
// 创建 BigInt
const big1 = 9007199254740991n;  // 后缀 n
const big2 = BigInt(9007199254740991);
const big3 = BigInt('9007199254740991');

// Number 的安全整数限制
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(9007199254740991 + 1 === 9007199254740991 + 2); // true（精度丢失）

// BigInt 无此限制
console.log(9007199254740991n + 1n === 9007199254740991n + 2n); // false

// 运算
const a = 10n;
const b = 5n;

a + b;  // 15n
a - b;  // 5n
a * b;  // 50n
a / b;  // 2n（整数除法）
a % b;  // 0n
a ** 2n; // 100n

// 不能混用 BigInt 和 Number
// 10n + 5; // TypeError
10n + BigInt(5); // 15n
Number(10n) + 5; // 15

// 比较运算可以混用
10n > 5;   // true
10n === 10; // false（类型不同）
10n == 10;  // true

// 类型转换
Number(10n); // 10
String(10n); // '10'
parseInt('10n'); // 10

// JSON.stringify 不支持 BigInt
const obj = { big: 10n };
// JSON.stringify(obj); // TypeError

// 解决方案
BigInt.prototype.toJSON = function() {
  return this.toString();
};
JSON.stringify(obj); // '{"big":"10"}'

// 应用场景：处理大整数 ID
const response = {
  id: '9007199254740992', // 后端返回的字符串
  name: 'Item'
};

const id = BigInt(response.id);
```

### globalThis

```javascript
// 获取全局对象的不同方式
// 浏览器: window, self, frames
// Web Worker: self
// Node.js: global
// 通用: this（在严格模式下是 undefined）

// globalThis 统一了全局对象访问
console.log(globalThis);

// 浏览器中
globalThis === window; // true

// Node.js 中
globalThis === global; // true

// 实际应用：跨环境代码
function getGlobal() {
  // 旧方式
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  throw new Error('No global object found');
}

// 新方式
const global = globalThis;
```

### Promise.allSettled

```javascript
// Promise.all 的问题：一个失败就全部失败
Promise.all([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).catch(err => console.log(err)); // 'error'，丢失了成功的结果

// Promise.allSettled 等待所有 Promise 完成
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 }
  // ]
});

// 应用场景：批量请求，即使部分失败也要处理
async function fetchAllUrls(urls) {
  const promises = urls.map(url => fetch(url));
  const results = await Promise.allSettled(promises);

  const fulfilled = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const rejected = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  return { fulfilled, rejected };
}

// 处理 allSettled 结果
async function processResults(promises) {
  const results = await Promise.allSettled(promises);

  for (const result of results) {
    if (result.status === 'fulfilled') {
      console.log('Success:', result.value);
    } else {
      console.error('Failed:', result.reason);
    }
  }
}
```

### String.prototype.matchAll

```javascript
const str = 'test1test2test3';
const regex = /test(\d)/g;

// 传统方式：需要多次 exec
let match;
while ((match = regex.exec(str)) !== null) {
  console.log(match[1]); // 1, 2, 3
}

// matchAll：返回迭代器
const matches = [...str.matchAll(regex)];
// [
//   ['test1', '1', index: 0, input: 'test1test2test3'],
//   ['test2', '2', index: 5, input: 'test1test2test3'],
//   ['test3', '3', index: 10, input: 'test1test2test3']
// ]

// 提取所有捕获组
const nums = [...str.matchAll(regex)].map(m => m[1]);
console.log(nums); // ['1', '2', '3']

// 应用：提取 HTML 标签属性
const html = '<div class="a" id="x"></div><span class="b"></span>';
const tagRegex = /<(\w+)([^>]*)>/g;

for (const match of html.matchAll(tagRegex)) {
  console.log('Tag:', match[1], 'Attributes:', match[2]);
}
// Tag: div Attributes:  class="a" id="x"
// Tag: span Attributes:  class="b"
```

### for...in 顺序

```javascript
// ES2020 规范了 for...in 的迭代顺序
const obj = {
  2: 'two',
  1: 'one',
  b: 'B',
  a: 'A',
  0: 'zero'
};

for (const key in obj) {
  console.log(key);
}
// 顺序：0, 1, 2, b, a（整数键升序，然后是字符串键按插入顺序）
```

---

## ES2021

### 逻辑赋值操作符

```javascript
// ||= 或赋值
let a = false;
a ||= true;
console.log(a); // true
// 等同于: a = a || true

// &&= 与赋值
let b = true;
b &&= false;
console.log(b); // false
// 等同于: b = b && false

// ??= 空值合并赋值
let c = null;
c ??= 'default';
console.log(c); // 'default'
// 等同于: c = c ?? 'default'

// 实际应用
// 设置默认值
user.name ||= 'Anonymous';
options.timeout ??= 5000;

// 条件更新
obj.valid &&= validate(obj);

// 惰性初始化
cache[key] ??= computeExpensiveValue(key);

// DOM 操作
element.textContent ||= 'Loading...';

// 对比
// a = a || b  -> 总是会赋值
// a ||= b     -> 只在 a 为 falsy 时赋值（短路）
```

### 数字分隔符

```javascript
// 使用下划线分隔数字，提高可读性
const billion = 1_000_000_000;
const bytes = 0xFF_FF_FF_FF;
const bits = 0b1010_0001;
const octal = 0o1234_5670;
const hex = 0xA0_B0_C0;
const fraction = 0.000_001;
const exp = 1e10_000;

// 计算结果与不带分隔符相同
console.log(1_000_000 === 1000000); // true
console.log(0xFF_FF === 0xFFFF);    // true

// 限制
// 不能连续使用两个下划线
// const num = 1__000; // SyntaxError

// 不能在数字开头或结尾
// const num = _1000; // SyntaxError（这是变量名）
// const num = 1000_; // SyntaxError

// 不能在小数点旁边
// const num = 1000_.0; // SyntaxError
// const num = 1000._0; // SyntaxError

// 不能在指数 e 旁边
// const num = 1_e10; // SyntaxError
// const num = 1e_10; // SyntaxError

// BigInt 也可以使用
const bigNum = 1_000_000_000n;
```

### String.prototype.replaceAll

```javascript
const str = 'hello world, hello universe';

// 传统方式：使用正则全局标志
str.replace(/hello/g, 'hi'); // 'hi world, hi universe'

// replaceAll：更直观
str.replaceAll('hello', 'hi'); // 'hi world, hi universe'

// 特殊字符需要转义
'1+2+3'.replaceAll('+', '-'); // '1-2-3'
'1+2+3'.replaceAll(/\+/g, '-'); // '1-2-3'

// 函数作为替换值
'aabbcc'.replaceAll(/(.)/g, (match, p1) => p1.toUpperCase());
// 'AABBCC'

// 实际应用
// 清理文本
const clean = text
  .replaceAll('\n', ' ')
  .replaceAll('\t', ' ')
  .replaceAll(/\s+/g, ' ')
  .trim();

// 转义 HTML
const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

function escapeHtml(str) {
  return Object.entries(escapeMap).reduce(
    (s, [char, entity]) => s.replaceAll(char, entity),
    str
  );
}
```

### Promise.any

```javascript
// Promise.any：任意一个成功就返回
Promise.any([
  Promise.reject('Error 1'),
  Promise.resolve('Success'),
  Promise.reject('Error 2')
]).then(result => {
  console.log(result); // 'Success'
});

// 全部失败时抛出 AggregateError
Promise.any([
  Promise.reject('Error 1'),
  Promise.reject('Error 2')
]).catch(err => {
  console.log(err instanceof AggregateError); // true
  console.log(err.errors); // ['Error 1', 'Error 2']
});

// 应用场景
// 1. 从多个镜像源获取资源
async function fetchFromMirrors(url, mirrors) {
  const promises = mirrors.map(mirror => fetch(mirror + url));
  return Promise.any(promises);
}

// 2. 最快响应
async function getFastestResponse(urls) {
  return Promise.any(urls.map(url => fetch(url)));
}

// Promise 方法对比
// Promise.all:    全部成功 → 返回所有结果；一个失败 → 失败
// Promise.allSettled: 返回所有结果（不管成功失败）
// Promise.race:   第一个完成的结果（不管成功失败）
// Promise.any:    第一个成功的结果；全部失败 → AggregateError
```

### WeakRef 和 FinalizationRegistry

```javascript
// WeakRef：弱引用对象
let obj = { name: 'John' };
const weakRef = new WeakRef(obj);

console.log(weakRef.deref()); // { name: 'John' }

obj = null; // 可以被垃圾回收

// 稍后检查（实际 GC 时间不确定）
setTimeout(() => {
  console.log(weakRef.deref()); // 可能是 undefined
}, 1000);

// FinalizationRegistry：注册清理回调
const registry = new FinalizationRegistry((id) => {
  console.log(`Object ${id} was garbage collected`);
});

function createObject(id) {
  const obj = { data: new Array(1000000) };
  registry.register(obj, id);
  return obj;
}

let largeObj = createObject('obj1');
largeObj = null; // 触发 GC 后会打印 "Object obj1 was garbage collected"

// 应用场景：缓存
class Cache {
  constructor() {
    this.cache = new Map();
    this.registry = new FinalizationRegistry((key) => {
      this.cache.delete(key);
    });
  }

  get(key, factory) {
    let ref = this.cache.get(key);
    let value = ref?.deref();

    if (value === undefined) {
      value = factory();
      ref = new WeakRef(value);
      this.cache.set(key, ref);
      this.registry.register(value, key);
    }

    return value;
  }
}

// 注意：避免过度使用
// 1. GC 行为不可预测
// 2. 清理回调不一定执行
// 3. 仅用于优化内存等特殊场景
```

---

## ES2022

### 顶层 await

```javascript
// 传统方式：必须在 async 函数中使用 await
async function main() {
  const data = await fetch('/api/data');
  console.log(data);
}
main();

// ES2022：顶层 await（在模块中）
const response = await fetch('/api/data');
const data = await response.json();
console.log(data);

// 应用场景
// 1. 动态导入
const module = await import('./module.js');

// 2. 初始化
const config = await loadConfig();
const db = await connectDB(config);

// 3. 条件导入
const heavy = condition ? await import('./heavy.js') : null;

// 4. 资源加载
const texture = await loadTexture('image.png');

// 注意：顶层 await 只能在 ES Module 中使用
// package.json 中设置 "type": "module"
```

### 类的私有字段和方法

```javascript
class Person {
  // 私有字段
  #name;
  #age;

  // 私有静态字段
  static #count = 0;

  constructor(name, age) {
    this.#name = name;
    this.#age = age;
    Person.#count++;
  }

  // 私有方法
  #validateAge(age) {
    return age >= 0 && age <= 150;
  }

  // 公共方法访问私有成员
  get name() {
    return this.#name;
  }

  set name(value) {
    this.#name = value;
  }

  get age() {
    return this.#age;
  }

  set age(value) {
    if (this.#validateAge(value)) {
      this.#age = value;
    } else {
      throw new Error('Invalid age');
    }
  }

  // 私有静态方法
  static #getCount() {
    return Person.#count;
  }

  static getCount() {
    return Person.#getCount();
  }

  // 私有 getter/setter
  get #info() {
    return `${this.#name}, ${this.#age}`;
  }

  printInfo() {
    console.log(this.#info);
  }
}

const person = new Person('John', 30);
console.log(person.name); // John
// console.log(person.#name); // SyntaxError
// console.log(person.#validateAge(20)); // SyntaxError

// 静态私有字段检查
class Example {
  #private = 42;

  static isExample(obj) {
    return #private in obj; // 检查私有字段是否存在
  }
}

console.log(Example.isExample(new Example())); // true
console.log(Example.isExample({})); // false
```

### Object.hasOwn

```javascript
const obj = { name: 'John' };

// 传统方式
obj.hasOwnProperty('name'); // true
Object.prototype.hasOwnProperty.call(obj, 'name'); // true（更安全）

// Object.hasOwn：更简洁安全
Object.hasOwn(obj, 'name'); // true
Object.hasOwn(obj, 'toString'); // false

// 处理原型链问题
const obj = Object.create(null);
obj.name = 'John';

// obj.hasOwnProperty('name'); // TypeError: obj.hasOwnProperty is not a function
Object.hasOwn(obj, 'name'); // true

// 与 in 操作符的区别
const obj = { name: 'John' };

'name' in obj; // true（包括继承的属性）
Object.hasOwn(obj, 'name'); // true（只有自身属性）

'toString' in obj; // true（继承自 Object.prototype）
Object.hasOwn(obj, 'toString'); // false
```

### Array.prototype.at

```javascript
const arr = [1, 2, 3, 4, 5];

// 传统方式获取最后一个元素
arr[arr.length - 1]; // 5
arr.slice(-1)[0]; // 5

// at() 方法
arr.at(0); // 1
arr.at(-1); // 5（最后一个）
arr.at(-2); // 4（倒数第二个）

// 超出范围返回 undefined
arr.at(10); // undefined
arr.at(-10); // undefined

// 字符串也支持
'hello'.at(0); // 'h'
'hello'.at(-1); // 'o'

// 应用场景
function getLastItems(arr, n) {
  return Array.from({ length: n }, (_, i) => arr.at(-1 - i));
}

// 判断是否为空
function isEmpty(arr) {
  return arr.at(0) === undefined;
}
```

### Error Cause

```javascript
// 链式错误，保留原始错误信息
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch user ${id}`, { cause: error });
  }
}

async function processUser(id) {
  try {
    const user = await fetchUser(id);
    return user;
  } catch (error) {
    throw new Error('User processing failed', { cause: error });
  }
}

// 使用
try {
  await processUser(1);
} catch (error) {
  console.log(error.message); // 'User processing failed'
  console.log(error.cause.message); // 'Failed to fetch user 1'
  console.log(error.cause.cause); // 原始网络错误
}

// 自定义错误类
class AppError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = 'AppError';
    this.timestamp = Date.now();
  }
}

// 错误链遍历
function getErrorChain(error) {
  const chain = [error];
  let current = error;

  while (current.cause) {
    chain.push(current.cause);
    current = current.cause;
  }

  return chain;
}
```

---

## ES2023

### 从后查找数组元素

```javascript
const arr = [1, 2, 3, 4, 3, 2, 1];

// findLast：从后往前查找
arr.findLast(x => x > 2); // 3（最后一个大于 2 的元素）
arr.findLast(x => x > 10); // undefined

// findLastIndex：从后往前查找索引
arr.findLastIndex(x => x > 2); // 4
arr.findLastIndex(x => x > 10); // -1

// 与 find/findIndex 对比
arr.find(x => x > 2); // 3（第一个大于 2 的元素）
arr.findIndex(x => x > 2); // 2

// 应用场景
const transactions = [
  { type: 'buy', amount: 100 },
  { type: 'sell', amount: 50 },
  { type: 'buy', amount: 200 },
  { type: 'sell', amount: 75 }
];

// 找最后一次交易
const lastSell = transactions.findLast(t => t.type === 'sell');
// { type: 'sell', amount: 75 }
```

### 非破坏性数组方法

```javascript
const arr = [3, 1, 4, 1, 5, 9];

// toSorted：返回新排序数组（不改变原数组）
const sorted = arr.toSorted((a, b) => a - b);
console.log(sorted); // [1, 1, 3, 4, 5, 9]
console.log(arr); // [3, 1, 4, 1, 5, 9]（原数组不变）

// 对比 sort
arr.sort((a, b) => a - b);
console.log(arr); // [1, 1, 3, 4, 5, 9]（原数组被修改）

// toReversed：返回新反转数组
const arr2 = [1, 2, 3, 4, 5];
const reversed = arr2.toReversed();
console.log(reversed); // [5, 4, 3, 2, 1]
console.log(arr2); // [1, 2, 3, 4, 5]

// toSpliced：返回新拼接数组
const arr3 = [1, 2, 3, 4, 5];
const spliced = arr3.toSpliced(1, 2, 'a', 'b'); // 从索引 1 删除 2 个，插入 'a', 'b'
console.log(spliced); // [1, 'a', 'b', 4, 5]
console.log(arr3); // [1, 2, 3, 4, 5]

// with：返回修改指定索引的新数组
const arr4 = [1, 2, 3, 4, 5];
const updated = arr4.with(2, 'three'); // 索引 2 改为 'three'
console.log(updated); // [1, 2, 'three', 4, 5]
console.log(arr4); // [1, 2, 3, 4, 5]

// 支持负索引
const arr5 = [1, 2, 3, 4, 5];
console.log(arr5.with(-1, 'last')); // [1, 2, 3, 4, 'last']

// 链式调用
const result = [3, 1, 4, 1, 5]
  .toSorted((a, b) => b - a)  // 降序排序
  .toSpliced(0, 1)            // 删除第一个
  .with(0, 'first');          // 修改第一个
console.log(result); // ['first', 4, 3, 1, 1]

// 与 Immutable.js 的对比
// 原生方法性能更好，无需额外库
```

### Hashbang 语法

```javascript
// 文件开头的 #! 被识别为注释
#!/usr/bin/env node

console.log('Hello from script');

// 使得 JavaScript 文件可以作为可执行脚本
// chmod +x script.js
// ./script.js
```

### Symbols 作为 WeakMap 键

```javascript
// ES2023：Symbol 可以作为 WeakMap 的键
const weakMap = new WeakMap();
const key = Symbol('key');

weakMap.set(key, 'value');
console.log(weakMap.get(key)); // 'value'

// 应用场景：私有数据存储
const privateData = new WeakMap();

class Person {
  #key = Symbol('private');

  constructor(name) {
    privateData.set(this.#key, { name });
  }

  getName() {
    return privateData.get(this.#key)?.name;
  }
}
```

---

## ES2024

### 数组分组

```javascript
const people = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Alice', age: 30 }
];

// Object.groupBy：按条件分组
const byAge = Object.groupBy(people, person => person.age);
console.log(byAge);
// {
//   25: [{ name: 'John', age: 25 }, { name: 'Bob', age: 25 }],
//   30: [{ name: 'Jane', age: 30 }, { name: 'Alice', age: 30 }]
// }

// Map.groupBy：返回 Map
const byAgeMap = Map.groupBy(people, person => person.age);
console.log(byAgeMap.get(25)); // [{ name: 'John', age: 25 }, { name: 'Bob', age: 25 }]

// 复杂分组
const students = [
  { name: 'John', grade: 'A' },
  { name: 'Jane', grade: 'B' },
  { name: 'Bob', grade: 'A' },
  { name: 'Alice', grade: 'C' }
];

const byGrade = Object.groupBy(students, s => s.grade);
const passFail = Object.groupBy(students, s => s.grade === 'A' ? 'pass' : 'fail');
```

### Promise.withResolvers

```javascript
// 传统方式
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

// ES2024
const { promise, resolve, reject } = Promise.withResolvers();

// 应用场景
function delay(ms) {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(resolve, ms);
  return promise;
}

// 可取消的异步操作
function createCancellableTask() {
  const { promise, resolve, reject } = Promise.withResolvers();

  const task = asyncOperation();

  return {
    promise,
    cancel: () => reject(new Error('Cancelled'))
  };
}
```

### Atomics.waitAsync

```javascript
// 异步等待
const sab = new SharedArrayBuffer(4);
const view = new Int32Array(sab);

// 异步等待
async function waitForValue() {
  const result = Atomics.waitAsync(view, 0, 0);
  await result.async;
  console.log('Value changed');
}

// 在另一个线程中
Atomics.store(view, 0, 1);
Atomics.notify(view, 0, 1);
```

### 正则表达式 v 标志

```javascript
// v 标志：Unicode 属性转义增强
const regex = /[\p{Emoji}--\p{ASCII}]/v;

// 字符串集合操作
// 差集
const notDigits = /[\p{ASCII}--\p{Decimal_Number}]/v;

// 交集
const onlyDigits = /[\p{ASCII}&&\p{Decimal_Number}]/v;

// Unicode 属性
const emojis = /^\p{RGI_Emoji}$/v;
```

---

## 特性兼容性检测

```javascript
// 检测特性支持
const features = {
  optionalChaining: () => {
    try {
      eval('const a = {}; a?.b');
      return true;
    } catch {
      return false;
    }
  },

  nullishCoalescing: () => {
    try {
      eval('const a = null ?? "default"');
      return true;
    } catch {
      return false;
    }
  },

  bigInt: () => typeof BigInt !== 'undefined',

  promiseAllSettled: () => typeof Promise.allSettled !== 'undefined',

  replaceAll: () => typeof String.prototype.replaceAll !== 'undefined',

  privateFields: () => {
    try {
      eval('class A { #x = 1 }');
      return true;
    } catch {
      return false;
    }
  },

  topLevelAwait: () => {
    // 只能在模块中检测
    return false;
  },

  arrayAt: () => typeof Array.prototype.at !== 'undefined',

  objectHasOwn: () => typeof Object.hasOwn !== 'undefined',

  findLast: () => typeof Array.prototype.findLast !== 'undefined',

  toSorted: () => typeof Array.prototype.toSorted !== 'undefined'
};

// 使用
console.log(features.optionalChaining()); // true/false
```

---

## 小结

| ES版本 | 主要特性 |
|--------|---------|
| ES2020 | 可选链、空值合并、BigInt、globalThis、Promise.allSettled |
| ES2021 | 逻辑赋值、数字分隔符、replaceAll、Promise.any、WeakRef |
| ES2022 | 顶层 await、私有字段、Object.hasOwn、Array.at、Error Cause |
| ES2023 | findLast、toSorted、toReversed、toSpliced、with |
| ES2024 | Object.groupBy、Promise.withResolvers、RegExp v 标志 |

---

[返回模块目录](./)
