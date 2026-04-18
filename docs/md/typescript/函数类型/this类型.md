# this 类型

在 JavaScript 中，`this` 的值取决于函数如何被调用，这可能导致类型安全问题。TypeScript 提供了 `this` 类型来确保方法调用时的上下文正确。

---

## 目录

- [this 参数](#this-参数)
- [箭头函数与 this](#箭头函数与-this)
- [类中的 this 类型](#类中的-this-类型)
- [this 类型与继承](#this-类型与继承)
- [this 类型约束](#this-类型约束)
- [回调函数中的 this](#回调函数中的-this)
- [实战示例](#实战示例)
- [最佳实践](#最佳实践)

---

## this 参数

### 基本语法

```typescript
interface User {
  name: string;
  greet(this: User): void;
}

const user: User = {
  name: 'Alice',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

// ✅ 正确：通过对象调用
user.greet(); // "Hello, Alice"

// ❌ 错误：直接调用会丢失 this
const greet = user.greet;
// greet(); // Error: The 'this' context of type 'void' is not assignable to method's 'this' of type 'User'
```

### 为什么需要 this 参数

```typescript
// 没有 this 参数的问题
interface Counter {
  count: number;
  increment(): void;
}

const counter: Counter = {
  count: 0,
  increment() {
    this.count++; // this 可能是 undefined
  }
};

// 解构后调用
const { increment } = counter;
// increment(); // 运行时错误: Cannot read property 'count' of undefined

// 使用 this 参数解决
interface SafeCounter {
  count: number;
  increment(this: SafeCounter): void;
}

const safeCounter: SafeCounter = {
  count: 0,
  increment() {
    this.count++;
  }
};

safeCounter.increment(); // ✅ OK
const { increment: inc } = safeCounter;
// inc(); // ❌ 编译时错误
```

### 函数类型中的 this

```typescript
// 函数类型定义
type ClickHandler = (this: HTMLButtonElement, event: MouseEvent) => void;

// 使用
const handler: ClickHandler = function(event) {
  console.log(this.textContent); // this 类型正确
  console.log(event.clientX);
};

// 在 DOM 中使用
document.querySelector('button')!.addEventListener('click', handler);
```

---

## 箭头函数与 this

### 箭头函数的 this 绑定

```typescript
class User {
  constructor(private name: string) {}

  // 普通方法：this 需要正确绑定
  greet(this: User) {
    console.log(`Hello, ${this.name}`);
  }

  // 箭头函数：自动绑定 this 到实例
  greetArrow = () => {
    console.log(`Hello, ${this.name}`);
  };
}

const user = new User('Alice');

// 普通方法解构后调用
const greet = user.greet;
// greet(); // ❌ 编译错误

// 箭头函数解构后调用
const greetArrow = user.greetArrow;
greetArrow(); // ✅ 正常工作: "Hello, Alice"
```

### 两种方式的对比

```typescript
class Timer {
  private seconds = 0;

  // 方法 1: 普通方法 + this 参数
  start(this: Timer): void {
    // 需要 bind 或通过对象调用
    console.log('Started');
  }

  // 方法 2: 箭头函数
  stop = (): void => {
    console.log(`Stopped at ${this.seconds}s`);
  };

  // 方法 3: 在构造函数中 bind
  private pauseFn: () => void;

  constructor() {
    this.pauseFn = this.pause.bind(this);
  }

  pause(): void {
    console.log('Paused');
  }
}

const timer = new Timer();
const { start, stop, pauseFn } = timer;

// start();     // ❌ 编译错误
stop();          // ✅ 正常工作
pauseFn();       // ✅ 正常工作
```

### 编译后的代码

```typescript
// 源码
class User {
  name = 'Alice';

  greet() {
    console.log(this.name);
  }

  greetArrow = () => {
    console.log(this.name);
  };
}

// 编译后
class User {
  constructor() {
    this.name = 'Alice';
    // 箭头函数在构造函数中绑定
    this.greetArrow = () => {
      console.log(this.name);
    };
  }

  greet() {
    console.log(this.name);
  }
}
```

---

## 类中的 this 类型

### 返回 this 实现链式调用

```typescript
class StringBuilder {
  private parts: string[] = [];

  append(text: string): this {
    this.parts.push(text);
    return this;
  }

  prepend(text: string): this {
    this.parts.unshift(text);
    return this;
  }

  toString(): string {
    return this.parts.join('');
  }
}

const result = new StringBuilder()
  .append('World')
  .prepend('Hello ')
  .append('!')
  .toString(); // "Hello World!"
```

### this 与继承

```typescript
class Animal {
  constructor(public name: string) {}

  clone(): this {
    // 返回当前实例的副本
    return new (this.constructor as any)(this.name);
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
const clonedDog = dog.clone(); // 类型是 Dog

console.log(clonedDog.name);   // 'Buddy'
console.log(clonedDog.breed);  // 'Golden Retriever'
```

### this 类型作为参数

```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): this {
    this.items.push(item);
    return this;
  }

  // 使用 this 参数确保调用上下文
  log(this: Container<T>): this {
    console.log(this.items);
    return this;
  }
}
```

---

## this 类型与继承

### 多态 this

```typescript
class Animal {
  constructor(public name: string) {}

  // 返回 this 类型，在子类中会自动变为子类类型
  setName(name: string): this {
    this.name = name;
    return this;
  }
}

class Dog extends Animal {
  bark(): this {
    console.log(`${this.name} says: Woof!`);
    return this;
  }
}

class Cat extends Animal {
  meow(): this {
    console.log(`${this.name} says: Meow!`);
    return this;
  }
}

// 链式调用
const dog = new Dog('Buddy')
  .setName('Max')
  .bark(); // 类型仍然是 Dog

const cat = new Cat('Whiskers')
  .setName('Mittens')
  .meow(); // 类型仍然是 Cat
```

### Builder 模式

```typescript
class HttpRequest {
  private method: string = 'GET';
  private url: string = '';
  private headers: Record<string, string> = {};
  private body?: any;

  setMethod(method: string): this {
    this.method = method;
    return this;
  }

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setBody(body: any): this {
    this.body = body;
    return this;
  }

  async send(): Promise<Response> {
    return fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body)
    });
  }
}

// 使用
const response = await new HttpRequest()
  .setUrl('/api/users')
  .setMethod('POST')
  .setHeader('Content-Type', 'application/json')
  .setBody({ name: 'Alice' })
  .send();
```

### 继承 Builder

```typescript
class RequestBuilder {
  protected url: string = '';
  protected method: string = 'GET';

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  setMethod(method: string): this {
    this.method = method;
    return this;
  }

  build(): Request {
    return new Request(this.url, { method: this.method });
  }
}

class JsonRequestBuilder extends RequestBuilder {
  private body?: any;

  setBody(body: any): this {
    this.body = body;
    return this;
  }

  override build(): Request {
    return new Request(this.url, {
      method: this.method,
      body: JSON.stringify(this.body),
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 链式调用
const builder = new JsonRequestBuilder()
  .setUrl('/api/users')
  .setMethod('POST')
  .setBody({ name: 'Alice' }); // 类型是 JsonRequestBuilder
```

---

## this 类型约束

### ThisType 工具类型

```typescript
interface MyObject {
  name: string;
  greet(): void;
}

// ThisType 标记 this 的类型
const obj: MyObject & ThisType<MyObject> = {
  name: 'Alice',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

obj.greet(); // "Hello, Alice"
```

### 在对象字面量中使用

```typescript
interface State {
  count: number;
  increment(): void;
  decrement(): void;
}

const state: State & ThisType<State> = {
  count: 0,

  increment() {
    this.count++;
  },

  decrement() {
    this.count--;
  }
};
```

### 配合 Object.create 使用

```typescript
interface UserMethods {
  greet(this: User): void;
  getInfo(this: User): string;
}

interface User extends UserMethods {
  name: string;
  age: number;
}

const userMethods: UserMethods & ThisType<User> = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },

  getInfo() {
    return `${this.name}, ${this.age} years old`;
  }
};

const user: User = Object.create(userMethods);
user.name = 'Alice';
user.age = 25;
user.greet(); // "Hello, I'm Alice"
```

---

## 回调函数中的 this

### 事件处理器

```typescript
interface Button {
  text: string;
  onClick(this: Button, event: MouseEvent): void;
}

class MyButton implements Button {
  text = 'Click Me';

  onClick(this: MyButton, event: MouseEvent): void {
    console.log(`${this.text} was clicked`);
    console.log(`Position: ${event.clientX}, ${event.clientY}`);
  }
}

const button = new MyButton();
// 使用 bind 保持 this
document.addEventListener('click', button.onClick.bind(button));
```

### 数组方法回调

```typescript
class DataProcessor {
  private data: number[] = [];

  constructor(data: number[]) {
    this.data = data;
  }

  // 使用 this 参数
  process(this: DataProcessor): number[] {
    return this.data.map(function(this: DataProcessor, item) {
      return item * 2;
    }, this); // 传递 this 作为第二个参数
  }

  // 使用箭头函数
  processWithArrow(): number[] {
    return this.data.map(item => item * 2);
  }
}
```

### setTimeout 中的 this

```typescript
class Timer {
  private seconds = 0;

  // 方法 1: 箭头函数
  startArrow() {
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }

  // 方法 2: bind
  startBind() {
    setInterval(this.tick.bind(this), 1000);
  }

  private tick(this: Timer) {
    this.seconds++;
    console.log(this.seconds);
  }

  // 方法 3: 保存 this
  startVar() {
    const self = this;
    setInterval(function() {
      self.seconds++;
      console.log(self.seconds);
    }, 1000);
  }
}
```

---

## 实战示例

### 链式 API

```typescript
class Query<T> {
  private items: T[];

  constructor(items: T[]) {
    this.items = items;
  }

  filter(predicate: (item: T) => boolean): this {
    this.items = this.items.filter(predicate);
    return this;
  }

  map<U>(mapper: (item: T) => U): Query<U> {
    return new Query(this.items.map(mapper));
  }

  sort(compare: (a: T, b: T) => number): this {
    this.items.sort(compare);
    return this;
  }

  take(n: number): this {
    this.items = this.items.slice(0, n);
    return this;
  }

  toArray(): T[] {
    return [...this.items];
  }

  first(): T | undefined {
    return this.items[0];
  }
}

// 使用
const result = new Query([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(3)
  .toArray(); // [4, 8, 12]
```

### 事件发射器

```typescript
type EventHandler<T = any> = (data: T) => void;

class EventEmitter<EventMap extends Record<string, any>> {
  private handlers = new Map<keyof EventMap, Set<EventHandler>>();

  on<K extends keyof EventMap>(
    this: EventEmitter<EventMap>,
    event: K,
    handler: EventHandler<EventMap[K]>
  ): this {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return this;
  }

  off<K extends keyof EventMap>(
    this: EventEmitter<EventMap>,
    event: K,
    handler: EventHandler<EventMap[K]>
  ): this {
    this.handlers.get(event)?.delete(handler);
    return this;
  }

  emit<K extends keyof EventMap>(
    this: EventEmitter<EventMap>,
    event: K,
    data: EventMap[K]
  ): this {
    this.handlers.get(event)?.forEach(handler => handler(data));
    return this;
  }
}

// 使用
interface AppEvents {
  login: { userId: string };
  logout: void;
  message: string;
}

const emitter = new EventEmitter<AppEvents>()
  .on('login', ({ userId }) => console.log(`User ${userId} logged in`))
  .on('message', msg => console.log(`Message: ${msg}`))
  .emit('login', { userId: '123' })
  .emit('message', 'Hello World');
```

---

## 最佳实践

### 选择合适的方式

```typescript
class Example {
  private value = 0;

  // ✅ 使用 this 参数：当需要确保调用上下文时
  method(this: Example) {
    return this.value;
  }

  // ✅ 使用箭头函数：作为回调函数时
  callback = () => {
    return this.value;
  };

  // ✅ 返回 this：链式调用
  setValue(value: number): this {
    this.value = value;
    return this;
  }
}
```

### 避免 this 问题

```typescript
// ❌ 问题代码
class BadExample {
  private items: string[] = [];

  addItem(item: string) {
    this.items.push(item);
  }
}

const example = new BadExample();
const { addItem } = example;
// addItem('test'); // 运行时错误

// ✅ 正确做法 1：this 参数
class GoodExample1 {
  private items: string[] = [];

  addItem(this: GoodExample1, item: string) {
    this.items.push(item);
  }
}

// ✅ 正确做法 2：箭头函数
class GoodExample2 {
  private items: string[] = [];

  addItem = (item: string) => {
    this.items.push(item);
  };
}
```

---

## 小结

| 特性 | 用途 |
|------|------|
| `this: Type` | 约束方法的 this 类型 |
| `this` 返回类型 | 支持链式调用和多态 |
| 箭头函数属性 | 自动绑定 this 到实例 |
| `ThisType<T>` | 标记对象方法的 this 类型 |

---

**下一节**: [剩余参数](./剩余参数.md)
