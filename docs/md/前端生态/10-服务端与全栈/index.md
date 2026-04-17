# 服务端与全栈

## 概述

解决 BFF 层、服务端渲染、全栈开发等场景的需求。全栈能力让前端工程师能够独立完成完整功能，提升开发效率。

## Node.js 框架

### Express
- **定位**：灵活的 Web 应用框架
- **特点**：中间件生态、简单易用、高度灵活
- **适用场景**：REST API、简单服务、学习入门

### Koa
- **定位**：下一代 Web 框架
- **特点**：async/await、洋葱模型、轻量
- **适用场景**：现代 API、中间件定制

### Fastify
- **定位**：高性能 Web 框架
- **特点**：性能优秀、Schema 验证、插件体系
- **适用场景**：高性能 API、微服务

### NestJS
- **定位**：企业级 Node 框架
- **特点**：TypeScript、依赖注入、模块化、装饰器
- **适用场景**：企业级应用、团队协作

### Hono
- **定位**：轻量级跨运行时框架
- **特点**：超轻量、多运行时支持、Edge 友好
- **适用场景**：Serverless、边缘计算

## 服务端渲染 (SSR)

### Next.js SSR
- **特点**：React 生态、混合渲染、API Routes
- **适用场景**：SEO 要求高的 React 应用

### Nuxt.js SSR
- **特点**：Vue 生态、自动路由、数据获取
- **适用场景**：Vue 全栈应用

### Remix
- **特点**：Web 标准、嵌套路由、数据加载策略
- **适用场景**：现代 Web 应用、渐进增强

## BFF 层

### GraphQL
- **定位**：API 查询语言
- **特点**：按需查询、类型系统、单端点
- **适用场景**：复杂数据需求、多客户端

### Apollo Server
- **定位**：GraphQL 服务端
- **特点**：与 Apollo Client 集成、订阅支持
- **适用场景**：GraphQL 全栈应用

### tRPC
- **定位**：端到端类型安全 API
- **特点**：无需 Schema、自动类型推导
- **适用场景**：TypeScript 全栈项目

## 数据库与 ORM

### Prisma
- **定位**：下一代 ORM
- **特点**：类型安全、迁移工具、查询优化
- **适用场景**：TypeScript 项目首选

### TypeORM
- **定位**：TypeScript ORM
- **特点**：装饰器、Active Record、Data Mapper
- **适用场景**：TypeScript 企业项目

### Mongoose
- **定位**：MongoDB ODM
- **特点**：Schema 定义、中间件、验证
- **适用场景**：MongoDB 项目

### Drizzle ORM
- **定位**：轻量级 TypeScript ORM
- **特点**：SQL-like、无运行时、性能好
- **适用场景**：追求性能、SQL 熟悉者

## 认证与授权

### 认证方案
- **JWT**：无状态、跨服务
- **Session**：传统方案、服务端存储
- **OAuth 2.0**：第三方登录

### 认证库
- **NextAuth.js** - Next.js 认证
- **Passport.js** - Node.js 认证中间件
- **Lucia** - 现代认证库

## API 设计

### RESTful API
```
GET    /users      # 获取用户列表
GET    /users/:id  # 获取单个用户
POST   /users      # 创建用户
PUT    /users/:id  # 更新用户
DELETE /users/:id  # 删除用户
```

### GraphQL Schema
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!): User!
}
```

## 部署与托管

### Serverless
- Vercel Functions
- Netlify Functions
- AWS Lambda
- Cloudflare Workers

### 传统部署
- PM2 进程管理
- Docker 容器化
- Nginx 反向代理

## 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 快速 API | Express/Fastify | 简单灵活 |
| 企业应用 | NestJS | 架构完善、团队协作 |
| 全栈应用 | Next.js | React 生态、SSR 完善 |
| Serverless | Hono | 轻量、多平台 |
| 数据库 ORM | Prisma | 类型安全、开发体验好 |
| 类型安全 API | tRPC | 端到端类型共享 |

## 常见问题

### 性能优化
- 连接池配置
- 缓存策略
- 异步处理
- 流式响应

### 安全措施
- 输入验证
- SQL 注入防护
- XSS 防护
- CORS 配置
- Rate Limiting

### 错误处理
- 全局错误处理中间件
- 日志记录
- 错误响应格式化
- 监控告警
