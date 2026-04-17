# 装饰器

## 模块概述

装饰器是一种特殊类型的声明,可以附加到类声明、方法、访问符、属性或参数上,以修改类的行为。

## 目录

- [01-装饰器基础](./01-装饰器基础.md)
- [02-类装饰器](./02-类装饰器.md)
- [03-方法装饰器](./03-方法装饰器.md)
- [04-属性装饰器](./04-属性装饰器.md)
- [05-参数装饰器](./05-参数装饰器.md)
- [06-装饰器工厂](./06-装饰器工厂.md)

## 核心要点

### 启用装饰器

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 类装饰器

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class Greeter {
  greeting: string

  constructor(message: string) {
    this.greeting = message
  }
}
```

### 方法装饰器

```typescript
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args: ${JSON.stringify(args)}`)
    const result = originalMethod.apply(this, args)
    console.log(`Result: ${result}`)
    return result
  }

  return descriptor
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b
  }
}
```

### 装饰器工厂

```typescript
function configurable(value: boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value
  }
}

class Point {
  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    this._x = x
    this._y = y
  }

  @configurable(false)
  get x() {
    return this._x
  }

  @configurable(false)
  get y() {
    return this._y
  }
}
```

### 装饰器执行顺序

```typescript
function ClassDecorator() {
  return function(target: any) {
    console.log('ClassDecorator')
  }
}

function MethodDecorator() {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('MethodDecorator')
  }
}

function PropertyDecorator() {
  return function(target: any, propertyKey: string) {
    console.log('PropertyDecorator')
  }
}

function ParameterDecorator() {
  return function(
    target: any,
    propertyKey: string,
    parameterIndex: number
  ) {
    console.log('ParameterDecorator')
  }
}

@ClassDecorator()
class Example {
  @PropertyDecorator()
  property: string

  @MethodDecorator()
  method(@ParameterDecorator() param: string) {}
}

// 执行顺序:
// 1. PropertyDecorator
// 2. ParameterDecorator
// 3. MethodDecorator
// 4. ClassDecorator
```

## 学习路径

1. 理解装饰器的概念
2. 掌握各类装饰器的用法
3. 学习装饰器工厂
4. 理解装饰器执行顺序
5. 实践装饰器应用场景

## 参考资料

- [TypeScript Handbook - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [TC39 Decorators Proposal](https://github.com/tc39/proposal-decorators)
