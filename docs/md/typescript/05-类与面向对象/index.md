# 类与面向对象

## 模块概述

TypeScript 完整支持面向对象编程,包括类、继承、抽象类、接口实现等特性。

## 目录

- [01-类的基本概念](./01-类的基本概念.md)
- [02-访问修饰符](./02-访问修饰符.md)
- [03-抽象类](./03-抽象类.md)
- [04-接口实现](./04-接口实现.md)
- [05-类的类型](./05-类的类型.md)
- [06-Mixin模式](./06-Mixin模式.md)

## 核心要点

### 类的基本语法

```typescript
class User {
  // 属性
  public name: string
  private age: number
  protected email: string
  readonly id: number

  // 构造函数
  constructor(id: number, name: string, age: number, email: string) {
    this.id = id
    this.name = name
    this.age = age
    this.email = email
  }

  // 方法
  greet(): string {
    return `Hello, I'm ${this.name}`
  }
}
```

### 访问修饰符

```typescript
class Animal {
  public name: string        // 公有,任何地方可访问
  private secret: string     // 私有,仅类内部可访问
  protected family: string   // 受保护,类及子类可访问
  readonly id: number        // 只读,不可修改

  constructor(name: string, secret: string, family: string) {
    this.name = name
    this.secret = secret
    this.family = family
  }
}
```

### 继承

```typescript
class Animal {
  constructor(public name: string) {}

  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m`)
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name)
  }

  bark() {
    console.log('Woof! Woof!')
  }
}
```

### 抽象类

```typescript
abstract class Animal {
  abstract makeSound(): void

  move(): void {
    console.log('Moving...')
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log('Woof!')
  }
}
```

### 接口实现

```typescript
interface Printable {
  print(): void
}

interface Loggable {
  log(): void
}

class Document implements Printable, Loggable {
  print() {
    console.log('Printing...')
  }

  log() {
    console.log('Logging...')
  }
}
```

## 学习路径

1. 掌握类的基本语法
2. 理解访问修饰符
3. 学会继承和多态
4. 掌握抽象类和接口
5. 学习高级设计模式

## 参考资料

- [TypeScript Handbook - Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
