# 实战应用

## 模块概述

本章将介绍 TypeScript 在实际项目中的应用,包括前端框架集成、Node.js 开发、工具库开发等场景。

## 目录

- [01-前端框架集成](./01-前端框架集成.md)
- [02-Node.js项目配置](./02-Node.js项目配置.md)
- [03-工具库开发](./03-工具库开发.md)
- [04-类型安全的API设计](./04-类型安全的API设计.md)
- [05-测试与类型](./05-测试与类型.md)
- [06-最佳实践](./06-最佳实践.md)

## 核心要点

### React + TypeScript

```typescript
// 组件定义
interface Props {
  name: string
  age: number
  onClick?: () => void
}

const UserCard: React.FC<Props> = ({ name, age, onClick }) => {
  return (
    <div onClick={onClick}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  )
}

// 自定义 Hook
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser(id).then(data => {
      setUser(data)
      setLoading(false)
    })
  }, [id])

  return { user, loading }
}
```

### Node.js + TypeScript

```typescript
// Express 应用
import express, { Request, Response, NextFunction } from 'express'

const app = express()

interface User {
  id: string
  name: string
  email: string
}

// 类型安全的路由
app.get('/users/:id', async (req: Request<{ id: string }>, res: Response<User>) => {
  const user = await getUserById(req.params.id)
  res.json(user)
})

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})
```

### 工具库开发

```typescript
// 类型安全的工具函数
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T
  }

  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }

  return cloned
}

// 泛型工具类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}
```

### 类型安全的 API 设计

```typescript
// API 类型定义
interface API {
  '/users': {
    GET: {
      query: { page?: number; limit?: number }
      response: User[]
    }
    POST: {
      body: { name: string; email: string }
      response: User
    }
  }
  '/users/:id': {
    GET: {
      params: { id: string }
      response: User
    }
    PUT: {
      params: { id: string }
      body: Partial<User>
      response: User
    }
    DELETE: {
      params: { id: string }
      response: void
    }
  }
}

// 类型安全的请求函数
async function request<T extends keyof API>(
  url: T,
  options: API[T]['GET'] extends { response: infer R }
    ? { method: 'GET'; query?: API[T]['GET']['query'] }
    : never
): Promise<API[T]['GET']['response']>

async function request<T extends keyof API>(
  url: T,
  options: { method: 'POST'; body: API[T]['POST']['body'] }
): Promise<API[T]['POST']['response']>

async function request(url: string, options: any): Promise<any> {
  // 实现代码
}
```

## 学习路径

1. 掌握 React + TypeScript 开发
2. 学会 Node.js + TypeScript 配置
3. 实践工具库开发
4. 学习类型安全的 API 设计
5. 掌握测试与类型结合

## 参考资料

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Node.js TypeScript Guide](https://nodejs.org/en/docs/guides/nodejs-typescript/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
