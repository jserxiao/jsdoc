# Mixin 模式

Mixin 是一种在不使用继承的情况下复用类代码的模式。TypeScript 提供了对 Mixin 的原生支持。

---

## 目录

- [Mixin 基础](#mixin-基础)
- [实现 Mixin](#实现-mixin)
- [约束 Mixin](#约束-mixin)
- [Mixin 组合](#mixin-组合)
- [实际应用](#实际应用)

---

## Mixin 基础

Mixin 是一种将功能混入类的方式，可以在不创建继承层次的情况下复用代码。

```typescript
// 问题：JavaScript/TypeScript 只支持单继承
class Animal {
  name: string = '';
}

// ❌ 无法同时继承多个类
// class FlyingSwimmingAnimal extends Flying, Swimming {}

// ✅ 解决方案：使用 Mixin
```

---

## 实现 Mixin

### 基本 Mixin

```typescript
// 定义 Mixin 函数
type Constructor<T = {}> = new (...args: any[]) => T;

// Timestamp Mixin
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();

    getTimestamp(): Date {
      return this.timestamp;
    }
  };
}

// Tagged Mixin
function Tagged<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    tags: string[] = [];

    addTag(tag: string): void {
      this.tags.push(tag);
    }

    getTags(): string[] {
      return this.tags;
    }
  };
}

// 基础类
class User {
  constructor(public name: string) {}
}

// 应用 Mixin
const TimestampedUser = Timestamped(User);
const TaggedTimestampedUser = Tagged(TimestampedUser));

// 使用
const user = new TaggedTimestampedUser('Alice');
user.addTag('admin');
console.log(user.name);        // 'Alice'
console.log(user.getTimestamp()); // Date
console.log(user.getTags());   // ['admin']
```

### 使用类表达式简化

```typescript
// 基础类
class Entity {
  constructor(public id: string) {}
}

// 应用多个 Mixin
class User extends Tagged(Timestamped(Entity)) {
  constructor(
    id: string,
    public name: string,
    public email: string
  ) {
    super(id);
  }

  getInfo(): string {
    return `${this.name} (${this.email})`;
  }
}

const user = new User('1', 'Alice', 'alice@example.com');
user.addTag('admin');
console.log(user.getInfo());     // 'Alice (alice@example.com)'
console.log(user.getTimestamp()); // Date
console.log(user.getTags());      // ['admin']
```

---

## 约束 Mixin

### 限定 Mixin 的基类

```typescript
// 定义需要特定属性的基类
interface Nameable {
  name: string;
}

// 只有具有 name 属性的类才能使用此 Mixin
function Loggable<TBase extends Constructor<Nameable>>(Base: TBase) {
  return class extends Base {
    log(message: string): void {
      console.log(`[${this.name}] ${message}`);
    }
  };
}

class User {
  constructor(public name: string) {}
}

// ✅ User 有 name 属性，可以使用 Loggable
class LoggableUser extends Loggable(User) {
  constructor(name: string) {
    super(name);
  }

  doSomething() {
    this.log('Doing something');
  }
}

class Product {
  constructor(public id: string) {}
}

// ❌ Error: Product 缺少 name 属性
// class LoggableProduct extends Loggable(Product) {}
```

### 使用 this 类型

```typescript
// 使用 this 类型保持类型安全
function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }

    static deserialize<T extends ReturnType<typeof Serializable>>(
      this: T,
      json: string
    ): InstanceType<T> {
      return Object.assign(new (this as any)(), JSON.parse(json));
    }
  };
}
```

---

## Mixin 组合

### 多个 Mixin 组合

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin 1: 可激活
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    active: boolean = false;

    activate(): void {
      this.active = true;
    }

    deactivate(): void {
      this.active = false;
    }

    isActive(): boolean {
      return this.active;
    }
  };
}

// Mixin 2: 可锁定
function Lockable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    locked: boolean = false;

    lock(): void {
      this.locked = true;
    }

    unlock(): void {
      this.locked = false;
    }

    isLocked(): boolean {
      return this.locked;
    }
  };
}

// Mixin 3: 可观察
function Observable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private listeners: Map<string, Function[]> = new Map();

    on(event: string, callback: Function): void {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event)!.push(callback);
    }

    emit(event: string, ...args: any[]): void {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.forEach(cb => cb(...args));
      }
    }
  };
}

// 组合多个 Mixin
class Resource extends Observable(Lockable(Activatable(Entity))) {
  constructor(
    public id: string,
    public name: string
  ) {
    super(id);
  }

  use(): void {
    if (this.isLocked()) {
      this.emit('error', 'Resource is locked');
      return;
    }
    if (!this.isActive()) {
      this.emit('error', 'Resource is not active');
      return;
    }
    this.emit('used', this.id);
  }
}

// 使用
const resource = new Resource('1', 'Database');
resource.activate();
resource.on('used', (id: string) => console.log(`Resource ${id} used`));
resource.on('error', (msg: string) => console.error(msg));
resource.use(); // 'Resource 1 used'
```

### Mixin 辅助函数

```typescript
// 组合多个 Mixin 的辅助函数
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}

// 传统的接口继承方式
class User {
  name: string = '';
}

class ActivatableMixin {
  active: boolean = false;
  activate() { this.active = true; }
  deactivate() { this.active = false; }
}

class LoggableMixin {
  log(message: string) {
    console.log(message);
  }
}

class AdvancedUser extends User implements ActivatableMixin, LoggableMixin {
  // 声明属性
  active!: boolean;

  // 方法将在运行时由 applyMixins 填充
  activate!: () => void;
  deactivate!: () => void;
  log!: (message: string) => void;
}

applyMixins(AdvancedUser, [ActivatableMixin, LoggableMixin]);

const user = new AdvancedUser();
user.name = 'Alice';
user.activate();
user.log(`User active: ${user.active}`);
```

---

## 实际应用

### 1. 事件发射器 Mixin

```typescript
type EventHandler = (...args: any[]) => void;

function EventEmitter<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private _events: Map<string, EventHandler[]> = new Map();

    on(event: string, handler: EventHandler): this {
      if (!this._events.has(event)) {
        this._events.set(event, []);
      }
      this._events.get(event)!.push(handler);
      return this;
    }

    off(event: string, handler?: EventHandler): this {
      if (!handler) {
        this._events.delete(event);
      } else {
        const handlers = this._events.get(event);
        if (handlers) {
          const index = handlers.indexOf(handler);
          if (index !== -1) {
            handlers.splice(index, 1);
          }
        }
      }
      return this;
    }

    emit(event: string, ...args: any[]): this {
      const handlers = this._events.get(event);
      if (handlers) {
        handlers.forEach(handler => handler(...args));
      }
      return this;
    }

    once(event: string, handler: EventHandler): this {
      const wrappedHandler = (...args: any[]) => {
        this.off(event, wrappedHandler);
        handler(...args);
      };
      return this.on(event, wrappedHandler);
    }
  };
}

// 使用
class Button extends EventEmitter(Constructor) {
  constructor(public label: string) {
    super();
  }

  click(): void {
    this.emit('click', this);
  }
}

const button = new Button('Submit');
button.on('click', (btn: Button) => {
  console.log(`Button "${btn.label}" clicked`);
});
button.click();
```

### 2. 状态管理 Mixin

```typescript
function Stateful<TState extends object>(Base: Constructor) {
  return class extends Base {
    private _state: TState;
    private _prevState: TState | null = null;

    constructor(...args: any[]) {
      super(...args);
      this._state = {} as TState;
    }

    get state(): TState {
      return this._state;
    }

    setState(newState: Partial<TState>): void {
      this._prevState = { ...this._state };
      this._state = { ...this._state, ...newState };
    }

    get prevState(): TState | null {
      return this._prevState;
    }

    resetState(): void {
      this._prevState = this._state;
      this._state = {} as TState;
    }
  };
}

// 使用
interface CounterState {
  count: number;
}

class Counter extends Stateful<CounterState>(class {}) {
  increment(): void {
    this.setState({ count: (this.state.count || 0) + 1 });
  }

  decrement(): void {
    this.setState({ count: (this.state.count || 0) - 1 });
  }
}

const counter = new Counter();
counter.increment();
counter.increment();
console.log(counter.state.count); // 2
```

### 3. 异步操作 Mixin

```typescript
function AsyncOperation<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private _loading: boolean = false;
    private _error: Error | null = null;

    get loading(): boolean {
      return this._loading;
    }

    get error(): Error | null {
      return this._error;
    }

    async withLoading<T>(operation: () => Promise<T>): Promise<T> {
      this._loading = true;
      this._error = null;
      try {
        const result = await operation();
        return result;
      } catch (error) {
        this._error = error instanceof Error ? error : new Error(String(error));
        throw error;
      } finally {
        this._loading = false;
      }
    }

    clearError(): void {
      this._error = null;
    }
  };
}

// 使用
class DataService extends AsyncOperation(class {}) {
  async fetchData(url: string): Promise<any> {
    return this.withLoading(async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    });
  }
}
```

---

## 最佳实践

### 1. 保持 Mixin 简单

```typescript
// ✅ 好：单一职责
function Timestamped<T extends Constructor>(Base: T) {
  return class extends Base {
    createdAt = new Date();
  };
}

// ❌ 差：功能过多
function BigMixin<T extends Constructor>(Base: T) {
  return class extends Base {
    // 几十个属性和方法
  };
}
```

### 2. 使用接口声明 Mixin 类型

```typescript
interface ITimestamped {
  createdAt: Date;
  getAge(): number;
}

interface ITagged {
  tags: string[];
  addTag(tag: string): void;
}

// 类声明时实现接口
class Document implements ITimestamped, ITagged {
  createdAt: Date = new Date();
  tags: string[] = [];

  getAge(): number {
    return Date.now() - this.createdAt.getTime();
  }

  addTag(tag: string): void {
    this.tags.push(tag);
  }
}
```

### 3. 注意属性冲突

```typescript
// 两个 Mixin 有同名属性时要注意
function MixinA<T extends Constructor>(Base: T) {
  return class extends Base {
    value: string = 'A';
  };
}

function MixinB<T extends Constructor>(Base: T) {
  return class extends Base {
    value: number = 1;
  };
}

// 组合时后者会覆盖前者
class Combined extends MixinB(MixinA(class {})) {
  test() {
    console.log(this.value); // 1 (number)，'A' 被覆盖
  }
}
```

---

**返回**: [类与面向对象目录](./index.md)
