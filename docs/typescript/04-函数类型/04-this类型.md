# this类型

## 概述

TypeScript 通过 `this` 类型确保方法调用时的上下文正确。

## 一、this 参数

```typescript
interface User {
  name: string
  greet(this: User): void
}

const user: User = {
  name: 'Alice',
  greet() {
    console.log(`Hello, ${this.name}`)
  }
}

user.greet()  // ✅ 正确

const greet = user.greet
// greet()  // ❌ 编译错误: 需要正确的 this
```

## 二、箭头函数与 this

```typescript
class User {
  constructor(private name: string) {}

  // 方法: 需要正确的 this
  greet(this: User) {
    console.log(`Hello, ${this.name}`)
  }

  // 箭头函数: 自动绑定 this
  greetArrow = () => {
    console.log(`Hello, ${this.name}`)
  }
}

const user = new User('Alice')
const greet = user.greet
const greetArrow = user.greetArrow

// greet()      // ❌ 编译错误
greetArrow()    // ✅ 正确
```

## 三、类中的 this 类型

```typescript
class Box {
  private value: any

  setValue(this: this, value: any): this {
    this.value = value
    return this
  }

  getValue(): any {
    return this.value
  }
}

class DerivedBox extends Box {
  private extra: any

  setExtra(value: any): this {
    this.extra = value
    return this
  }
}

const box = new DerivedBox()
  .setValue('hello')
  .setExtra('world')  // ✅ 链式调用
```

## 四、实战示例

```typescript
class EventEmitter {
  private events: Map<string, Function[]> = new Map()

  on(this: this, event: string, handler: Function): this {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(handler)
    return this
  }

  emit(this: this, event: string, ...args: any[]): this {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
    return this
  }
}

const emitter = new EventEmitter()
  .on('click', () => console.log('clicked'))
  .emit('click')
```

## 五、总结

- `this` 参数用于约束方法调用的上下文
- 箭头函数自动绑定 this
- `this: this` 支持链式调用

---

**下一节**: [剩余参数](./05-剩余参数.md)
