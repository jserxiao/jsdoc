# TypeScript 编译原理

## 概述

理解 TypeScript 的编译原理有助于深入掌握 TypeScript，本章将详细介绍 TypeScript 编译器的工作流程和内部机制。

## 一、编译器架构

### 1.1 整体流程

TypeScript 编译器的工作流程：

```
源代码 (.ts)
    ↓
扫描器 (Scanner)
    ↓
词法分析 → Token 流
    ↓
解析器 (Parser)
    ↓
语法分析 → AST (抽象语法树)
    ↓
绑定器 (Binder)
    ↓
符号表 (Symbol Table)
    ↓
检查器 (Checker)
    ↓
类型检查 + 语义分析
    ↓
发射器 (Emitter)
    ↓
目标代码 (.js) + 声明文件 (.d.ts) + Source Map
```

### 1.2 核心组件

```typescript
// TypeScript 编译器的核心组件
interface Compiler {
  scanner: Scanner      // 词法分析器
  parser: Parser        // 语法分析器
  binder: Binder        // 绑定器
  checker: Checker      // 类型检查器
  emitter: Emitter      // 代码生成器
}
```

## 二、词法分析（Lexical Analysis）

### 2.1 扫描器

扫描器将源代码转换为 Token 流：

```typescript
// 源代码
const message: string = 'Hello, TypeScript!'

// Token 流
[
  { kind: SyntaxKind.ConstKeyword, text: 'const' },
  { kind: SyntaxKind.Identifier, text: 'message' },
  { kind: SyntaxKind.ColonToken, text: ':' },
  { kind: SyntaxKind.StringKeyword, text: 'string' },
  { kind: SyntaxKind.EqualsToken, text: '=' },
  { kind: SyntaxKind.StringLiteral, text: "'Hello, TypeScript!'" },
  { kind: SyntaxKind.SemicolonToken, text: ';' }
]
```

### 2.2 Token 类型

TypeScript 定义的 Token 类型（部分）：

```typescript
enum SyntaxKind {
  // 关键字
  ConstKeyword,
  LetKeyword,
  VarKeyword,
  FunctionKeyword,
  ClassKeyword,
  InterfaceKeyword,
  TypeKeyword,

  // 标识符和字面量
  Identifier,
  StringLiteral,
  NumericLiteral,

  // 运算符
  EqualsToken,
  PlusToken,
  MinusToken,
  AsteriskToken,

  // 分隔符
  OpenBraceToken,
  CloseBraceToken,
  OpenParenToken,
  CloseParenToken,
  SemicolonToken,

  // 类型相关
  ColonToken,
  QuestionToken,
  LessThanToken,
  GreaterThanToken
}
```

### 2.3 实际示例

```typescript
// 源代码
function add(a: number, b: number): number {
  return a + b
}

// 词法分析结果
const tokens = [
  'function', 'add', '(', 'a', ':', 'number', ',',
  'b', ':', 'number', ')', ':', 'number', '{',
  'return', 'a', '+', 'b', '}'
]
```

## 三、语法分析（Syntactic Analysis）

### 3.1 解析器

解析器将 Token 流转换为抽象语法树（AST）：

```typescript
// 源代码
const x: number = 10

// AST 结构（简化）
{
  kind: SyntaxKind.VariableStatement,
  declarationList: {
    kind: SyntaxKind.VariableDeclarationList,
    flags: NodeFlags.Const,
    declarations: [{
      kind: SyntaxKind.VariableDeclaration,
      name: {
        kind: SyntaxKind.Identifier,
        text: 'x'
      },
      type: {
        kind: SyntaxKind.NumberKeyword
      },
      initializer: {
        kind: SyntaxKind.NumericLiteral,
        value: 10
      }
    }]
  }
}
```

### 3.2 AST 节点类型

TypeScript 定义了大量的 AST 节点类型：

```typescript
// 表达式节点
interface BinaryExpression extends Expression {
  left: Expression
  operatorToken: BinaryOperatorToken
  right: Expression
}

interface CallExpression extends Expression {
  expression: Expression
  arguments: NodeArray<Expression>
}

// 语句节点
interface FunctionDeclaration extends Declaration {
  name: Identifier | undefined
  parameters: NodeArray<ParameterDeclaration>
  type: TypeNode | undefined
  body: Block | undefined
}

interface VariableStatement extends Statement {
  declarationList: VariableDeclarationList
}

// 类型节点
interface TypeReferenceNode extends TypeNode {
  typeName: EntityName
  typeArguments: NodeArray<TypeNode> | undefined
}
```

### 3.3 AST 可视化

使用 TypeScript Compiler API 查看 AST：

```typescript
import * as ts from 'typescript'

const sourceCode = 'const x: number = 10'
const sourceFile = ts.createSourceFile(
  'temp.ts',
  sourceCode,
  ts.ScriptTarget.Latest,
  true
)

function printAST(node: ts.Node, indent: number = 0) {
  const kindName = ts.SyntaxKind[node.kind]
  console.log(' '.repeat(indent) + kindName)

  node.forEachChild(child => {
    printAST(child, indent + 2)
  })
}

printAST(sourceFile)

/*
输出:
SourceFile
  VariableStatement
    VariableDeclarationList
      VariableDeclaration
        Identifier
        NumberKeyword
        NumericLiteral
  EndOfFileToken
*/
```

## 四、绑定（Binding）

### 4.1 符号表构建

绑定器负责构建符号表，将标识符与声明关联：

```typescript
// 源代码
const x = 10
const y = x + 5

// 符号表
{
  x: {
    flags: SymbolFlags.BlockScopedVariable,
    declarations: [VariableDeclaration],
    valueDeclaration: VariableDeclaration
  },
  y: {
    flags: SymbolFlags.BlockScopedVariable,
    declarations: [VariableDeclaration],
    valueDeclaration: VariableDeclaration
  }
}
```

### 4.2 符号标志

```typescript
enum SymbolFlags {
  None                    = 0,
  FunctionScopedVariable  = 1 << 0,  // 函数作用域变量
  BlockScopedVariable     = 1 << 1,  // 块级作用域变量
  Property                = 1 << 2,  // 属性
  EnumMember              = 1 << 3,  // 枚举成员
  Function                = 1 << 4,  // 函数
  Class                   = 1 << 5,  // 类
  Interface               = 1 << 6,  // 接口
  ConstEnum               = 1 << 7,  // const 枚举
  RegularEnum             = 1 << 8,  // 普通枚举
  TypeAlias               = 1 << 9,  // 类型别名
  Module                  = 1 << 10, // 模块
  Alias                   = 1 << 11, // 别名
  // ...更多标志
}
```

### 4.3 作用域链

绑定器构建作用域链：

```typescript
// 源代码
function greet(name: string) {
  const message = `Hello, ${name}`
  console.log(message)
}

// 作用域链
Global Scope {
  greet: Symbol(Function)
  └── Function Scope (greet) {
        name: Symbol(Parameter)
        message: Symbol(BlockScopedVariable)
      }
}
```

## 五、类型检查（Type Checking）

### 5.1 类型系统

TypeScript 的类型系统是编译时的静态类型系统：

```typescript
// 类型定义
interface Type {
  flags: TypeFlags
  symbol?: Symbol
}

enum TypeFlags {
  Any             = 1 << 0,
  Unknown         = 1 << 1,
  String          = 1 << 2,
  Number          = 1 << 3,
  Boolean         = 1 << 4,
  Void            = 1 << 5,
  Undefined       = 1 << 6,
  Null            = 1 << 7,
  Object          = 1 << 8,
  Union           = 1 << 9,
  Intersection    = 1 << 10,
  TypeParameter   = 1 << 11,
  // ...更多类型标志
}
```

### 5.2 类型检查过程

```typescript
// 源代码
function add(a: number, b: number): number {
  return a + b
}

add(1, '2') // 类型错误

// 类型检查过程
1. 检查函数调用表达式
2. 解析函数签名: (a: number, b: number) => number
3. 检查参数类型:
   - 参数 1: 1 (number) ✅
   - 参数 2: '2' (string) ❌ 不匹配 number
4. 报告类型错误
```

### 5.3 类型兼容性

TypeScript 使用**结构化类型系统**（鸭子类型）：

```typescript
interface Point {
  x: number
  y: number
}

interface Point3D {
  x: number
  y: number
  z: number
}

const point: Point = { x: 0, y: 0 }
const point3D: Point3D = { x: 0, y: 0, z: 0 }

// ✅ Point3D 包含 Point 的所有属性
const p: Point = point3D

// ❌ Point 缺少 z 属性
const p3d: Point3D = point // 编译错误
```

### 5.4 类型推断

```typescript
// 变量类型推断
let x = 10        // 推断为 number
let y = 'hello'   // 推断为 string
let z = [1, 2, 3] // 推断为 number[]

// 函数返回值推断
function add(a: number, b: number) {
  return a + b     // 返回值推断为 number
}

// 泛型推断
function identity<T>(arg: T): T {
  return arg
}

const result = identity(42) // T 推断为 number, result: number
```

## 六、代码生成（Emission）

### 6.1 发射器

发射器将 AST 转换为目标代码：

```typescript
// TypeScript 源代码
enum Direction {
  Up = 'UP',
  Down = 'DOWN'
}

const dir: Direction = Direction.Up

// 编译后的 JavaScript (ES5)
var Direction
(function (Direction) {
  Direction['Up'] = 'UP'
  Direction['Down'] = 'DOWN'
})(Direction || (Direction = {}))

var dir = Direction.Up
```

### 6.2 类型擦除

```typescript
// TypeScript
interface User {
  name: string
  age: number
}

function greet(user: User): string {
  return `Hello, ${user.name}`
}

const user: User = { name: 'Alice', age: 25 }
greet(user)

// 编译后的 JavaScript
function greet(user) {
  return `Hello, ${user.name}`
}

const user = { name: 'Alice', age: 25 }
greet(user)
```

### 6.3 Source Map 生成

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true
  }
}

// 生成的 .js.map 文件
{
  "version": 3,
  "file": "app.js",
  "sourceRoot": "",
  "sources": ["app.ts"],
  "names": [],
  "mappings": "..." // Base64 VLQ 编码的映射信息
}
```

## 七、编译器选项

### 7.1 严格模式选项

```json
{
  "compilerOptions": {
    "strict": true,                    // 启用所有严格选项
    "noImplicitAny": true,             // 禁止隐式 any
    "strictNullChecks": true,          // 严格的 null 检查
    "strictFunctionTypes": true,       // 严格的函数类型检查
    "strictBindCallApply": true,       // 严格的 bind/call/apply
    "strictPropertyInitialization": true, // 严格的属性初始化
    "noImplicitThis": true,            // 禁止隐式 this
    "useUnknownInCatchVariables": true // catch 变量为 unknown
  }
}
```

### 7.2 模块解析选项

```json
{
  "compilerOptions": {
    "module": "ESNext",           // 模块系统
    "moduleResolution": "node",   // 模块解析策略
    "baseUrl": "./",              // 基础路径
    "paths": {                    // 路径映射
      "@/*": ["src/*"]
    },
    "esModuleInterop": true,      // ES 模块互操作
    "allowSyntheticDefaultImports": true
  }
}
```

### 7.3 输出选项

```json
{
  "compilerOptions": {
    "target": "ES2020",           // 编译目标
    "outDir": "./dist",           // 输出目录
    "outFile": "./bundle.js",     // 输出单个文件（仅 AMD/System）
    "declaration": true,          // 生成 .d.ts 文件
    "declarationMap": true,       // 生成声明文件的 source map
    "sourceMap": true,            // 生成 .js.map 文件
    "removeComments": true,       // 移除注释
    "importHelpers": true         // 从 tslib 导入辅助函数
  }
}
```

## 八、编译器 API

### 8.1 创建程序

```typescript
import * as ts from 'typescript'

const program = ts.createProgram(
  ['src/index.ts'],
  {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    strict: true
  }
)

const typeChecker = program.getTypeChecker()
```

### 8.2 遍历 AST

```typescript
import * as ts from 'typescript'

function visit(node: ts.Node, typeChecker: ts.TypeChecker) {
  if (ts.isFunctionDeclaration(node)) {
    const symbol = typeChecker.getSymbolAtLocation(node.name!)
    const type = typeChecker.getTypeOfSymbolAtLocation(
      symbol!,
      node
    )

    console.log(`Function: ${node.name!.text}`)
    console.log(`Type: ${typeChecker.typeToString(type)}`)
  }

  node.forEachChild(child => visit(child, typeChecker))
}

const sourceFile = program.getSourceFile('src/index.ts')
visit(sourceFile!, typeChecker)
```

### 8.3 代码转换

```typescript
import * as ts from 'typescript'

// 转换函数：将所有 console.log 替换为 customLog
function transformFactory(
  context: ts.TransformationContext
): (node: ts.SourceFile) => ts.SourceFile {
  return (sourceFile: ts.SourceFile) => {
    function visit(node: ts.Node): ts.Node {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.expression.getText() === 'console' &&
        node.expression.name.getText() === 'log'
      ) {
        return ts.factory.updateCallExpression(
          node,
          ts.factory.createIdentifier('customLog'),
          undefined,
          node.arguments
        )
      }

      return ts.visitEachChild(node, visit, context)
    }

    return ts.visitNode(sourceFile, visit) as ts.SourceFile
  }
}

const result = ts.transform(sourceFile, [transformFactory])
const transformedSourceFile = result.transformed[0]
const printer = ts.createPrinter()
const newCode = printer.printFile(transformedSourceFile)
```

## 九、性能优化

### 9.1 增量编译

```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,          // 启用增量编译
    "tsBuildInfoFile": "./.tsbuildinfo" // 构建信息文件
  }
}
```

```bash
# 首次编译
tsc

# 后续编译（增量）
tsc --incremental
```

### 9.2 项目引用

```json
// tsconfig.json (根目录)
{
  "references": [
    { "path": "./src/shared" },
    { "path": "./src/server" },
    { "path": "./src/client" }
  ],
  "files": []
}

// tsconfig.json (src/shared)
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "../../dist/shared"
  }
}

// tsconfig.json (src/server)
{
  "compilerOptions": {
    "outDir": "../../dist/server"
  },
  "references": [
    { "path": "../shared" }
  ]
}
```

### 9.3 跳过类型检查

```json
{
  "compilerOptions": {
    "skipLibCheck": true,         // 跳过库文件类型检查
    "noUnusedLocals": false,      // 不检查未使用的变量
    "noUnusedParameters": false   // 不检查未使用的参数
  }
}
```

## 十、总结

### 编译流程总结

```
┌─────────────────────────────────────────┐
│         TypeScript 编译流程             │
├─────────────────────────────────────────┤
│                                         │
│  源代码 (.ts)                           │
│     ↓                                   │
│  Scanner (词法分析)                     │
│     ↓                                   │
│  Token 流                               │
│     ↓                                   │
│  Parser (语法分析)                      │
│     ↓                                   │
│  AST                                    │
│     ↓                                   │
│  Binder (绑定)                          │
│     ↓                                   │
│  Symbol Table + Scope                   │
│     ↓                                   │
│  Checker (类型检查)                     │
│     ↓                                   │
│  Type Errors / Type Information         │
│     ↓                                   │
│  Emitter (代码生成)                     │
│     ↓                                   │
│  JavaScript + .d.ts + Source Map        │
│                                         │
└─────────────────────────────────────────┘
```

### 关键要点

1. **多层架构** - 扫描器、解析器、绑定器、检查器、发射器
2. **类型擦除** - 编译后类型信息被移除
3. **结构化类型** - 基于属性兼容性而非名义类型
4. **增量编译** - 利用缓存提升性能
5. **可扩展 API** - 提供完整的编译器 API

### 学习建议

1. 使用 [TypeScript AST Viewer](https://ts-ast-viewer.com/) 可视化 AST
2. 阅读 TypeScript 编译器源码（用 TypeScript 编写）
3. 尝试使用 Compiler API 编写代码转换工具
4. 理解每个编译阶段的作用和输出

---

**下一节**: [类型系统理论基础](./05-类型系统理论基础.md)
