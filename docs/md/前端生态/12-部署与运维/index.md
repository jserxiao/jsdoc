# 部署与运维

## 概述

解决应用部署、持续集成、服务器运维等场景的需求。掌握部署运维能力是全栈工程师的必备技能。

## 部署平台

### Vercel
- **定位**：前端部署平台
- **特点**：零配置部署、自动 HTTPS、边缘网络、Serverless Functions
- **适用场景**：Next.js、静态站点、Serverless

### Netlify
- **定位**：静态网站托管
- **特点**：表单处理、无服务器函数、分支预览
- **适用场景**：静态站点、JAMstack

### GitHub Pages
- **定位**：静态站点托管
- **特点**：免费、GitHub 集成、自定义域名
- **适用场景**：文档站、个人博客、开源项目

### 阿里云 OSS + CDN
- **定位**：国内部署方案
- **特点**：国内加速、对象存储、按量付费
- **适用场景**：国内用户、大流量场景

### Cloudflare Pages
- **定位**：全球边缘部署
- **特点**：全球 CDN、免费额度大、Workers 集成
- **适用场景**：全球用户、边缘计算

## CI/CD

### GitHub Actions
- **定位**：持续集成
- **特点**：与 GitHub 深度集成、矩阵构建、自托管 Runner
- **适用场景**：GitHub 项目、自动化流程

```yaml
# 示例工作流
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

### GitLab CI
- **定位**：GitLab 持续集成
- **特点**：内置容器 Registry、完整的 DevOps 平台
- **适用场景**：GitLab 托管项目

### Jenkins
- **定位**：自动化服务器
- **特点**：插件生态、自托管、高度可定制
- **适用场景**：企业内部、复杂流程

## 容器化与服务器

### Docker
- **定位**：容器化部署
- **特点**：环境一致、快速部署、资源隔离
- **适用场景**：服务端应用、微服务

```dockerfile
# Node.js 应用 Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: example
```

### Nginx
- **定位**：Web 服务器与反向代理
- **特点**：高性能、反向代理、负载均衡
- **适用场景**：静态资源、反向代理、HTTPS

```nginx
# 静态站点配置
server {
    listen 80;
    server_name example.com;
    
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}
```

### PM2
- **定位**：Node 进程管理
- **特点**：进程守护、负载均衡、日志管理
- **适用场景**：Node.js 应用部署

```bash
# PM2 常用命令
pm2 start app.js --name "my-app"
pm2 list
pm2 logs
pm2 restart all
pm2 save
```

### Kubernetes
- **定位**：容器编排
- **特点**：自动扩缩容、服务发现、滚动更新
- **适用场景**：大规模微服务、企业级应用

## 监控与日志

### 应用监控
- **Sentry**：错误监控
- **New Relic**：APM 监控
- **Prometheus + Grafana**：指标监控

### 日志管理
- **ELK Stack**：Elasticsearch + Logstash + Kibana
- **Loki + Grafana**：轻量级日志方案

### 告警系统
- **PagerDuty**：事件管理
- **企业微信/钉钉**：国内团队通知

## 安全与性能

### HTTPS 配置
- Let's Encrypt 免费证书
- 自动续期配置
- HTTP 跳转 HTTPS

### CDN 加速
- 静态资源加速
- 全站加速
- 缓存策略配置

### 安全加固
- CSP 配置
- XSS/CSRF 防护
- 请求限流
- 敏感信息保护

## 部署策略

### 蓝绿部署
- 两套环境切换
- 快速回滚
- 零停机

### 金丝雀发布
- 小流量验证
- 渐进式推广
- 降低风险

### 滚动更新
- 逐个替换实例
- 保持服务可用
- Kubernetes 原生支持

## 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 静态站点 | Vercel/Netlify | 零配置、免费额度 |
| Next.js 应用 | Vercel | 官方推荐、功能完善 |
| 国内用户 | 阿里云 OSS + CDN | 国内加速效果好 |
| Node.js 服务 | Docker + PM2 | 容器化、进程管理 |
| 微服务架构 | Kubernetes | 自动扩缩容、服务治理 |
| CI/CD | GitHub Actions | 集成度高、配置简单 |

## 常见问题

### 部署失败
- 检查构建日志
- 验证环境变量
- 确认依赖版本

### 性能问题
- 开启 CDN 加速
- 配置缓存策略
- 优化资源大小

### 安全问题
- 定期更新依赖
- 配置安全响应头
- 监控异常访问

### 成本优化
- 合理选择实例规格
- 利用 Serverless 按需付费
- 配置自动扩缩容
