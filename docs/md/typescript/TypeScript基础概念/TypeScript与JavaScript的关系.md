# TypeScript 与 JavaScript 的关系

## 概述

理解 TypeScript 与 JavaScript 的关系是学习 TypeScript 的关键。本章将详细阐述两者的关系、差异和互操作性。

## 一、TypeScript 是 JavaScript 的超集

### 1.1 超集的定义

**TypeScript = JavaScript + 类型系统 + 其他特性**

```
JavaScript 代码 ──┐
                  ├──> TypeScript 编译器 ──> JavaScript 代码
TypeScript 特性 ──┘
```

**核心原则**：
> 任何合法的 JavaScript 代码都是合法的 TypeScript 代码

```typescript
// 以下都是合法的 TypeScript 代码

// 纯 JavaScript 代码
function greet(name) {
  return 'Hello, ' + name
}

console.log(greet('World'))

// ES6+ 语法
const numbers = [1, 2, 3]
const doubled = numbers.map(n => n * 2)

// 异步函数
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

### 1.2 类型系统的渐进式添加

TypeScript 允许逐步添加类型注解：

```typescript
// 第一步：纯 JavaScript（有效的 TypeScript）
function add(a, b) {
  return a + b
}

// 第二步：添加参数类型
function add(a: number, b: number) {
  return a + b
}

// 第三步：添加返回值类型
function add(a: number, b: number): number {
  return a + b
}

// 第四步：严格模式
// tsconfig.json: "strict": true
// 更全面的类型检查
```

## 二、TypeScript 与 JavaScript 的差异

### 2.1 类型系统

| 特性 | JavaScript | TypeScript |
|------|-----------|-----------|
| 类型检查 | 动态（运行时） | 静态（编译时） |
| 类型注解 | 不支持 | 支持 |
| 类型推断 | 无 | 强大的类型推断 |
| 接口 | 无 | 支持 |
| 泛型 | 无 | 支持 |

```typescript
// JavaScript - 运行时类型检查
function process(value) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value
}

// TypeScript - 编译时类型检查
function process<T extends string | number>(value: T): T extends string ? string : number {
  if (typeof value === 'string') {
    return value.toUpperCase() as any
  }
  return value as any
}
```

### 2.2 新增特性

TypeScript 添加了 JavaScript 没有的特性：

#### 接口（Interface）

```typescript
interface User {
  id: number
  name: string
  email: string
}

function createUser(user: User): User {
  return { ...user }
}
```

#### 泛型（Generics）

```typescript
function identity<T>(arg: T): T {
  return arg
}

const str = identity<string>('hello')
const num = identity(42) // 类型推断为 number
```

#### 枚举（Enum）

```typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}

function move(direction: Direction) {
  // ...
}

move(Direction.Up)
```

#### 命名空间（Namespace）

```typescript
namespace Utils {
  export function log(message: string): void {
    console.log(message)
  }

  export const PI = 3.14159
}

Utils.log('Hello')
console.log(Utils.PI)
```

#### 装饰器（Decorators）

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

### 2.3 编译时 vs 运行时

**关键区别**：TypeScript 的类型只在编译时存在

```typescript
// TypeScript 代码
interface User {
  name: string
  age: number
}

const user: User = {
  name: 'Alice',
  age: 25
}

function greet(user: User): string {
  return `Hello, ${user.name}`
}
```

编译后的 JavaScript：

```javascript
// 编译结果 - 类型信息被擦除
var user = {
  name: 'Alice',
  age: 25
}

function greet(user) {
  return `Hello, ${user.name}`
}
```

**要点**：
- 类型注解在编译后被移除
- 接口、类型别名等在运行时不存在
- 枚举会被编译为对象（除非是 const enum）
- 类会被编译为 ES5 构造函数（取决于目标版本）

## 三、类型擦除

### 3.1 类型擦除的过程

TypeScript 编译器会移除所有类型相关的代码：

```typescript
// 编译前
function add(a: number, b: number): number {
  return a + b
}

interface Point {
  x: number
  y: number
}

type ID = string | number

const point: Point = { x: 0, y: 0 }
const id: ID = 123
```

```javascript
// 编译后
function add(a, b) {
  return a + b
}

const point = { x: 0, y: 0 }
const id = 123
```

### 3.2 枚举的编译

普通枚举会被编译为对象：

```typescript
// TypeScript
enum Direction {
  Up,
  Down,
  Left,
  Right
}

const dir = Direction.Up
```

```javascript
// 编译结果
var Direction
(function (Direction) {
  Direction[Direction['Up'] = 0] = 'Up'
  Direction[Direction['Down'] = 1] = 'Down'
  Direction[Direction['Left'] = 2] = 'Left'
  Direction[Direction['Right'] = 3] = 'Right'
})(Direction || (Direction = {}))

var dir = Direction.Up
```

Const 枚举会被内联：

```typescript
// TypeScript
const enum Direction {
  Up,
  Down
}

const dir = Direction.Up
```

```javascript
// 编译结果 - 枚举值被内联
var dir = 0 /* Direction.Up */
```

### 3.3 类的编译

TypeScript 类会被编译为 JavaScript 构造函数：

```typescript
// TypeScript
class Person {
  private name: string

  constructor(name: string) {
    this.name = name
  }

  public greet(): string {
    return `Hello, I'm ${this.name}`
  }
}
```

```javascript
// 编译结果（ES5）
var Person = /** @class */ (function () {
  function Person(name) {
    this.name = name
  }
  Person.prototype.greet = function () {
    return "Hello, I'm ".concat(this.name)
  }
  return Person
}())
```

## 四、JavaScript 代码迁移

### 4.1 渐进式迁移策略

**策略一：重命名文件**

```bash
# 将 .js 文件重命名为 .ts
mv src/utils.js src/utils.ts
```

**策略二：允许 JavaScript**

```json
// tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "noImplicitAny": false
  }
}
```

**策略三：JSDoc 类型注解**

```javascript
// utils.js
/**
 * @param {string} name
 * @param {number} age
 * @returns {{name: string, age: number}}
 */
function createUser(name, age) {
  return { name, age }
}
```

### 4.2 迁移步骤

#### 步骤 1：配置 TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "allowJs": true,
    "checkJs": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### 步骤 2：逐步添加类型

```typescript
// 原始 JavaScript
function fetchData(url) {
  return fetch(url).then(res => res.json())
}

// 添加类型
interface ApiResponse {
  data: any
  status: number
}

function fetchData(url: string): Promise<ApiResponse> {
  return fetch(url).then(res => res.json())
}
```

#### 步骤 3：启用严格模式

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 4.3 常见迁移问题

#### 问题 1：缺少类型定义

```typescript
// 错误：找不到模块 'lodash' 的类型定义
import _ from 'lodash'

// 解决方案：安装类型定义
npm install --save-dev @types/lodash
```

#### 问题 2：any 类型过多

```typescript
// 临时解决方案：使用 any
function process(data: any) {
  return data.value
}

// 最终解决方案：定义具体类型
interface Data {
  value: string
}

function process(data: Data) {
  return data.value
}
```

#### 问题 3：第三方库类型错误

```typescript
// 创建类型声明文件
// declarations.d.ts
declare module 'some-library' {
  export function someFunction(input: string): number
}
```

## 五、互操作性

### 5.1 TypeScript 使用 JavaScript 库

#### 方式一：使用 @types

```bash
# 安装类型定义
npm install --save-dev @types/lodash @types/express
```

```typescript
import _ from 'lodash'
import express from 'express'

const app = express()
const sorted = _.sortBy([3, 1, 2])
```

#### 方式二：声明模块

```typescript
// declarations.d.ts
declare module 'untyped-library' {
  export function init(config: {
    apiKey: string
    debug?: boolean
  }): void

  export function getData(id: string): Promise<any>
}
```

#### 方式三：JSDoc

```javascript
// untyped-library.js
/**
 * @param {string} name
 * @returns {string}
 */
function greet(name) {
  return `Hello, ${name}`
}

export { greet }
```

```typescript
// TypeScript 会识别 JSDoc 类型
import { greet } from './untyped-library'
const message: string = greet('Alice')
```

### 5.2 JavaScript 使用 TypeScript

编译后的 TypeScript 代码可以被 JavaScript 直接使用：

```typescript
// calculator.ts
export interface Calculator {
  add(a: number, b: number): number
  subtract(a: number, b: number): number
}

export class BasicCalculator implements Calculator {
  add(a: number, b: number): number {
    return a + b
  }

  subtract(a: number, b: number): number {
    return a - b
  }
}
```

```javascript
// app.js - JavaScript 代码
import { BasicCalculator } from './calculator'

const calc = new BasicCalculator()
console.log(calc.add(1, 2)) // 3
console.log(calc.subtract(5, 3)) // 2
```

### 5.3 混合项目

在同一项目中混合使用 JavaScript 和 TypeScript：

```
my-project/
├── src/
│   ├── typescript/
│   │   └── module.ts
│   ├── javascript/
│   │   └── script.js
│   └── index.ts
├── tsconfig.json
└── package.json
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false
  },
  "include": ["src/**/*"]
}
```

## 六、版本对应关系

### 6.1 TypeScript 与 ECMAScript

TypeScript 紧跟 ECMAScript 标准：

| TypeScript 版本 | ECMAScript 特性 |
|----------------|----------------|
| TS 4.0+ | 可选链、空值合并 |
| TS 4.1+ | 模板字面量类型 |
| TS 4.2+ | 引入/导出类型 |
| TS 4.3+ | override 关键字 |
| TS 4.4+ | 抽象构造签名 |
| TS 4.5+ | 类型修饰符 |
| TS 4.6+ | 索引访问推断改进 |
| TS 4.7+ | Node.js ESM 支持 |
| TS 4.8+ | 类型收窄改进 |
| TS 4.9+ | satisfies 操作符 |
| TS 5.0+ | 装饰器标准、const 类型参数 |

### 6.2 目标编译版本

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",  // 编译目标
    "lib": ["ES2020", "DOM"]  // 包含的库定义
  }
}
```

**可选目标**：
- `"ES3"` - IE 8
- `"ES5"` - 所有浏览器
- `"ES6"`/`"ES2015"` - 现代浏览器
- `"ES2017"` - async/await 原生支持
- `"ES2020"` - 最新特性
- `"ESNext"` - 最新 ECMAScript 特性

## 七、总结

### 核心关系

```
┌─────────────────────────────────────┐
│          TypeScript                 │
│  ┌───────────────────────────────┐  │
│  │       JavaScript              │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   ECMAScript Standard   │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
│  + 类型系统                         │
│  + 编译时检查                       │
│  + 接口、泛型、枚举等               │
└─────────────────────────────────────┘
```

### 关键要点

1. **完全兼容** - TypeScript 是 JavaScript 的严格超集
2. **渐进采用** - 可以逐步将 JavaScript 迁移到 TypeScript
3. **类型擦除** - 编译后类型信息被移除
4. **互操作性** - 可以与 JavaScript 无缝互操作
5. **工具增强** - 为 JavaScript 提供更好的开发体验

### 学习建议

1. **不要害怕 TypeScript** - 它只是 JavaScript + 类型
2. **渐进式学习** - 从简单类型开始，逐步深入
3. **理解编译过程** - 了解 TypeScript 如何转换为 JavaScript
4. **实践迁移** - 尝试将小型 JavaScript 项目迁移到 TypeScript

---

**下一节**: [TypeScript 编译原理](./TypeScript编译原理.md)
