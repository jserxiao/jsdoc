# TypeScript 类型检查

## 严格模式配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 类型检查脚本

```json
// package.json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch"
  }
}
```

## 常用编译选项

| 选项 | 说明 |
|------|------|
| `strict` | 启用所有严格类型检查选项 |
| `noImplicitAny` | 禁止隐式 any 类型 |
| `strictNullChecks` | 严格的 null 检查 |
| `strictFunctionTypes` | 严格的函数类型检查 |
| `noUnusedLocals` | 检查未使用的局部变量 |
| `noUnusedParameters` | 检查未使用的参数 |
| `noImplicitReturns` | 检查每个分支是否有返回值 |
| `noFallthroughCasesInSwitch` | 检查 switch 穿透 |

## 类型检查最佳实践

### 1. 避免使用 any

```typescript
// ❌ 不推荐
function process(data: any) {
  return data.value
}

// ✅ 推荐
function process<T extends { value: unknown }>(data: T) {
  return data.value
}
```

### 2. 使用类型守卫

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: unknown) {
  if (isString(value)) {
    // value 是 string 类型
    console.log(value.toUpperCase())
  }
}
```

### 3. 使用 const 断言

```typescript
// 普通
const config = {
  endpoint: '/api',
  method: 'GET'
} // { endpoint: string, method: string }

// const 断言
const config = {
  endpoint: '/api',
  method: 'GET'
} as const // { readonly endpoint: "/api", readonly method: "GET" }
```
