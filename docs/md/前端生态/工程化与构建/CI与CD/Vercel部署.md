# Vercel 部署

## 项目配置

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

## 预览部署

- 每个 PR 自动创建预览环境
- 预览 URL: `https://<branch>-<project>.vercel.app`
- 可在 PR 评论中查看预览链接

## 生产部署

- 推送到 main 分支自动部署
- 支持 Rollback 回滚
- 支持多环境部署

## 环境变量

### 在 Vercel Dashboard 配置

1. 进入项目 Settings → Environment Variables
2. 添加环境变量（支持 Development / Preview / Production）

### 使用 vercel.json

```json
{
  "env": {
    "VITE_API_URL": "https://api.example.com"
  }
}
```

## 常用配置

### SPA 路由重定向

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### API 代理

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://api.example.com/$1" }
  ]
}
```

### 自定义域名

1. 在 Vercel Dashboard 添加域名
2. 配置 DNS 记录
3. 等待 SSL 证书自动配置

### 构建命令

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Next.js 配置

```json
// vercel.json for Next.js
{
  "framework": "nextjs",
  "regions": ["hkg1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```
