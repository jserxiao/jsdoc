# HTTP 缓存

> HTTP 缓存是提升 Web 性能的重要手段。通过合理的缓存策略，可以减少网络请求、降低服务器负载、提升页面加载速度。理解缓存机制对于前端开发和性能优化至关重要。

## 学习要点

- 📦 理解 HTTP 缓存的类型和层次结构
- 🔄 掌握强缓存和协商缓存的区别
- 📋 熟悉 Cache-Control 等缓存控制头部
- 🎯 学会制定不同资源的缓存策略

---

## 1. 缓存类型

### 1.1 缓存层次结构

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           HTTP 缓存层次结构                                 │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌─────────────┐                                                         │
│   │   浏览器     │ ← 私有缓存，存储用户个人数据                               │
│   │  (Browser)  │   • Cookie, LocalStorage, SessionStorage                │
│   │             │   • 内存缓存（Cache API, Service Worker）                 │
│   │             │   • 磁盘缓存（HTTP Cache）                                 │
│   └──────┬──────┘                                                         │
│          │                                                                │
│          ↓                                                                │
│   ┌─────────────┐                                                         │
│   │   代理缓存   │ ← 共享缓存，存储多个用户共享的数据                         │
│   │   (Proxy)   │   • 企业代理服务器                                       │
│   │             │   • CDN 节点                                             │
│   └──────┬──────┘                                                         │
│          │                                                                │
│          ↓                                                                │
│   ┌─────────────┐                                                         │
│   │   网关缓存   │ ← 反向代理、负载均衡器缓存                                │
│   │  (Gateway)  │   • Nginx、Varnish                                       │
│   └──────┬──────┘                                                         │
│          │                                                                │
│          ↓                                                                │
│   ┌─────────────┐                                                         │
│   │   源服务器   │ ← 原始数据源                                             │
│   │  (Origin)   │                                                         │
│   └─────────────┘                                                         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 1.2 私有缓存 vs 共享缓存

```
┌─────────────────┬───────────────────────────────────────────────────────┐
│  类型            │  说明                                                   │
├─────────────────┼───────────────────────────────────────────────────────┤
│  私有缓存        │  只能被单个用户使用                                       │
│  (Private)      │  存储在浏览器中                                          │
│                 │  适合用户个性化数据                                       │
│                 │  响应头：Cache-Control: private                         │
├─────────────────┼───────────────────────────────────────────────────────┤
│  共享缓存        │  可以被多个用户共享                                       │
│  (Shared)      │  存储在代理服务器、CDN 等                                 │
│                 │  适合公共资源                                            │
│                 │  响应头：Cache-Control: public                          │
└─────────────────┴───────────────────────────────────────────────────────┘
```

---

## 2. 缓存控制头部

### 2.1 Cache-Control 请求指令

```
┌─────────────────────────────┬─────────────────────────────────────────────┐
│  指令                        │  说明                                         │
├─────────────────────────────┼─────────────────────────────────────────────┤
│  no-cache                   │  使用前必须验证（可缓存但每次验证）             │
│  no-store                   │  不缓存任何内容（请求和响应都不存储）           │
│  max-age=<seconds>          │  接受的响应最大年龄                            │
│  max-stale[=<seconds>]      │  接受过期响应（可指定过期多久）                 │
│  min-fresh=<seconds>        │  要求响应在指定时间内仍然新鲜                   │
│  no-transform               │  不转换响应内容（如压缩）                       │
│  only-if-cached             │  只使用缓存，不访问源服务器                     │
└─────────────────────────────┴─────────────────────────────────────────────┘

示例：
Cache-Control: no-cache
Cache-Control: max-age=3600
Cache-Control: max-stale=86400
```

### 2.2 Cache-Control 响应指令

```
┌─────────────────────────────┬─────────────────────────────────────────────┐
│  指令                        │  说明                                         │
├─────────────────────────────┼─────────────────────────────────────────────┤
│  public                     │  可被任何缓存存储（包括代理缓存）               │
│  private                    │  只能被浏览器缓存存储（私有缓存）               │
│  no-cache                   │  使用前必须验证                               │
│  no-store                   │  不缓存任何内容                               │
│  max-age=<seconds>          │  缓存有效期（相对于请求时间）                   │
│  s-maxage=<seconds>         │  共享缓存有效期（优先于 max-age）               │
│  must-revalidate            │  过期后必须验证                               │
│  proxy-revalidate           │  共享缓存过期后必须验证                        │
│  immutable                  │  资源永不变化，过期后无需验证                   │
│  no-transform               │  不转换响应内容                               │
│  stale-while-revalidate=<s> │  过期后可先返回旧响应，后台异步验证             │
│  stale-if-error=<seconds>   │  验证失败时可使用过期响应                       │
└─────────────────────────────┴─────────────────────────────────────────────┘
```

### 2.3 指令详解

#### public vs private

```
Cache-Control: public
┌─────────────────────────────────────────────────────────────────────────┐
│  • 可以被任何缓存存储（浏览器、CDN、代理服务器）                            │
│  • 适合公共资源（静态文件、公共 API 数据）                                  │
│  • 即使响应不可缓存（如带 Authorization），也可缓存                         │
└─────────────────────────────────────────────────────────────────────────┘

Cache-Control: private
┌─────────────────────────────────────────────────────────────────────────┐
│  • 只能被浏览器缓存，不能被 CDN 等共享缓存存储                              │
│  • 适合用户个性化数据                                                     │
│  • 保护用户隐私                                                           │
└─────────────────────────────────────────────────────────────────────────┘

示例：
// 公共资源
Cache-Control: public, max-age=31536000

// 用户私有数据
Cache-Control: private, max-age=3600
```

#### no-cache vs no-store

```
Cache-Control: no-cache
┌─────────────────────────────────────────────────────────────────────────┐
│  • 可以缓存，但每次使用前必须向服务器验证                                   │
│  • 验证通过后可使用缓存副本                                               │
│  • 保证数据新鲜度                                                         │
│  • 适合需要实时性的数据                                                   │
└─────────────────────────────────────────────────────────────────────────┘

Cache-Control: no-store
┌─────────────────────────────────────────────────────────────────────────┐
│  • 完全不缓存                                                             │
│  • 请求和响应都不存储                                                      │
│  • 每次都必须向服务器请求完整响应                                          │
│  • 适合敏感数据（银行账户、个人隐私）                                       │
└─────────────────────────────────────────────────────────────────────────┘

示例：
// 敏感数据
Cache-Control: no-store, no-cache, must-revalidate

// 需要验证但可缓存
Cache-Control: no-cache, max-age=0
```

#### max-age vs Expires

```
Cache-Control: max-age=3600
┌─────────────────────────────────────────────────────────────────────────┐
│  • 相对时间，从请求开始计算                                                │
│  • 单位：秒                                                               │
│  • 优先级高于 Expires                                                     │
│  • 推荐使用                                                               │
└─────────────────────────────────────────────────────────────────────────┘

Expires: Wed, 15 Jan 2025 10:00:00 GMT
┌─────────────────────────────────────────────────────────────────────────┐
│  • 绝对时间                                                               │
│  • HTTP/1.0 遗留头部                                                      │
│  • 受客户端时间影响（时间不准会导致问题）                                   │
│  • 已被 max-age 取代                                                      │
└─────────────────────────────────────────────────────────────────────────┘

推荐使用 Cache-Control: max-age，Expires 仅作兼容后备
Cache-Control: max-age=3600
Expires: Wed, 15 Jan 2025 10:00:00 GMT
```

#### immutable

```
Cache-Control: max-age=31536000, immutable
┌─────────────────────────────────────────────────────────────────────────┐
│  • 表示资源永远不会变化                                                    │
│  • 过期后也不需要验证                                                     │
│  • 即使刷新页面也不会发送验证请求                                          │
│  • 适合带内容哈希的静态资源                                                │
│                                                                          │
│  示例：app.abc123.js                                                      │
│  文件名包含哈希值，内容变化则文件名变化                                     │
│  同一个 URL 的资源永远不会变                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

#### stale-while-revalidate

```
Cache-Control: max-age=3600, stale-while-revalidate=86400
┌─────────────────────────────────────────────────────────────────────────┐
│  工作流程：                                                               │
│  1. 请求时，如果缓存未过期（< 3600s），直接使用缓存                         │
│  2. 如果缓存过期但在 stale-while-revalidate 时间内（< 86400s）             │
│     • 先返回过期缓存给用户                                                 │
│     • 同时在后台异步验证                                                   │
│     • 验证成功后更新缓存                                                   │
│  3. 如果超过 stale-while-revalidate 时间，同步验证                         │
│                                                                          │
│  优点：                                                                   │
│  • 用户始终能快速获得响应                                                  │
│  • 后台更新，不影响用户体验                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 缓存决策流程

### 3.1 缓存决策图

```
                           ┌──────────────────┐
                           │    发起请求       │
                           └────────┬─────────┘
                                    │
                                    ↓
                        ┌───────────────────────┐
                        │  有缓存？              │
                        └───────────┬───────────┘
                           │                  │
                          有                 无
                           │                  │
                           ↓                  ↓
                   ┌───────────────┐   ┌───────────────┐
                   │  缓存新鲜？    │   │   发送请求     │
                   └───────┬───────┘   └───────────────┘
                      │          │
                     新鲜       过期
                      │          │
                      ↓          ↓
               ┌───────────┐  ┌─────────────────────────┐
               │ 直接使用   │  │ 需要验证？(no-cache/过期) │
               └───────────┘  └───────────┬─────────────┘
                                            │
                                      ┌─────┴─────┐
                                      │           │
                                     是          否
                                      │           │
                                      ↓           ↓
                             ┌───────────────┐ ┌───────────────┐
                             │ 发送验证请求   │ │ 发送完整请求   │
                             │ (条件请求)    │ └───────────────┘
                             └───────┬───────┘
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                       验证通过              验证失败
                     (304 Not Modified)    (200 OK)
                          │                     │
                          ↓                     ↓
                   ┌───────────────┐    ┌───────────────┐
                   │ 使用缓存副本   │    │ 使用新响应     │
                   │ 更新鲜度信息   │    │ 存入缓存       │
                   └───────────────┘    └───────────────┘
```

### 3.2 强缓存 vs 协商缓存

```
┌─────────────────┬───────────────────────────────────────────────────────┐
│  强缓存          │  不发送请求，直接使用缓存                                │
├─────────────────┼───────────────────────────────────────────────────────┤
│  判断依据        │  Cache-Control: max-age                               │
│                 │  Expires（已过时）                                      │
│                 │                                                        │
│  判断流程        │  当前时间 < 响应时间 + max-age → 使用缓存               │
│                 │                                                        │
│  响应状态        │  200 (from disk cache)                                │
│                 │  200 (from memory cache)                               │
│                 │                                                        │
│  优点           │  完全不发送请求，速度最快                                │
│                 │                                                        │
│  缺点           │  过期前无法获取最新内容                                  │
└─────────────────┴───────────────────────────────────────────────────────┘

┌─────────────────┬───────────────────────────────────────────────────────┐
│  协商缓存        │  发送验证请求，服务器决定是否使用缓存                      │
├─────────────────┼───────────────────────────────────────────────────────┤
│  判断依据        │  ETag / If-None-Match                                 │
│                 │  Last-Modified / If-Modified-Since                     │
│                 │                                                        │
│  判断流程        │  发送条件请求，服务器验证                                │
│                 │  未修改 → 304 Not Modified                             │
│                 │  已修改 → 200 OK + 新内容                               │
│                 │                                                        │
│  响应状态        │  304 Not Modified（使用缓存）                           │
│                 │  200 OK（使用新内容）                                   │
│                 │                                                        │
│  优点           │  可以获取最新内容                                       │
│                 │  节省带宽（304 无响应体）                                │
│                 │                                                        │
│  缺点           │  仍需发送请求验证                                       │
└─────────────────┴───────────────────────────────────────────────────────┘
```

---

## 4. 缓存验证

### 4.1 ETag / If-None-Match

```
第一次请求：
─────────────────────────────────────────────
GET /api/users/1 HTTP/1.1
Host: api.example.com

第一次响应：
─────────────────────────────────────────────
HTTP/1.1 200 OK
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Cache-Control: max-age=0, must-revalidate
Content-Type: application/json

{"id":1,"name":"张三"}

第二次请求（验证）：
─────────────────────────────────────────────
GET /api/users/1 HTTP/1.1
Host: api.example.com
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

资源未修改的响应：
─────────────────────────────────────────────
HTTP/1.1 304 Not Modified
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Cache-Control: max-age=0, must-revalidate
（无响应体）

资源已修改的响应：
─────────────────────────────────────────────
HTTP/1.1 200 OK
ETag: "new-etag-value-12345"
Cache-Control: max-age=0, must-revalidate
Content-Type: application/json

{"id":1,"name":"李四"}
```

### 4.2 Last-Modified / If-Modified-Since

```
第一次请求：
─────────────────────────────────────────────
GET /api/articles/1 HTTP/1.1
Host: api.example.com

第一次响应：
─────────────────────────────────────────────
HTTP/1.1 200 OK
Last-Modified: Wed, 15 Jan 2024 08:00:00 GMT
Cache-Control: max-age=0, must-revalidate
Content-Type: application/json

{"id":1,"title":"文章标题"}

第二次请求（验证）：
─────────────────────────────────────────────
GET /api/articles/1 HTTP/1.1
Host: api.example.com
If-Modified-Since: Wed, 15 Jan 2024 08:00:00 GMT

资源未修改的响应：
─────────────────────────────────────────────
HTTP/1.1 304 Not Modified
Last-Modified: Wed, 15 Jan 2024 08:00:00 GMT
（无响应体）
```

### 4.3 ETag vs Last-Modified

```
┌─────────────────────┬─────────────────────────────────────────────────────┐
│  ETag               │  Last-Modified                                       │
├─────────────────────┼─────────────────────────────────────────────────────┤
│  精确到内容级别       │  精确到秒级别                                         │
│  可检测内容变化       │  可能误判（一秒内多次修改）                             │
│  可处理内容不变       │  无法处理修改时间变但内容不变                           │
│  需要计算哈希         │  只需记录修改时间                                      │
│  优先级更高           │  优先级较低                                           │
│  支持弱验证（W/）     │  不支持弱验证                                         │
└─────────────────────┴─────────────────────────────────────────────────────┘

ETag 强验证 vs 弱验证：
强 ETag: "etag-value"
弱 ETag: W/"etag-value"

强验证：内容完全相同才匹配（字节级别）
弱验证：语义相同即可匹配（如格式化、注释变化）

推荐：同时使用两者，ETag 优先
```

### 4.4 验证流程

```javascript
// 服务端验证逻辑（伪代码）
async function handleRequest(req, res) {
  const resource = await getResource();
  
  // 1. 检查 If-None-Match（ETag 验证）
  const clientETag = req.headers['if-none-match'];
  if (clientETag === resource.etag) {
    return res.status(304).end();
  }
  
  // 2. 检查 If-Modified-Since（时间验证）
  const clientTime = req.headers['if-modified-since'];
  if (clientTime && new Date(clientTime) >= resource.lastModified) {
    return res.status(304).end();
  }
  
  // 3. 资源已修改，返回新内容
  res.set('ETag', resource.etag);
  res.set('Last-Modified', resource.lastModified.toUTCString());
  res.json(resource.data);
}
```

---

## 5. 缓存策略建议

### 5.1 不同资源类型的缓存策略

```
┌─────────────────────────────────────────────────────────────────────────┐
│  资源类型              │  推荐缓存策略                                        │
├─────────────────────────────────────────────────────────────────────────┤
│  静态资源（带哈希）      │  Cache-Control: max-age=31536000, immutable         │
│  (app.abc123.js)       │  一年有效期，永不验证                                 │
│                        │  内容变化 → 文件名变化 → 新 URL                       │
├─────────────────────────────────────────────────────────────────────────┤
│  静态资源（无哈希）      │  Cache-Control: no-cache                             │
│  (index.html)          │  每次验证                                            │
│                        │  确保获取最新版本                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  API 数据              │  Cache-Control: no-store 或 private, max-age=60     │
│                        │  根据数据实时性要求                                    │
│                        │  私有数据用 private                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  用户私有数据           │  Cache-Control: private, no-cache                    │
│                        │  仅浏览器缓存，每次验证                                │
│                        │  敏感数据用 no-store                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  图片/字体等媒体资源    │  Cache-Control: max-age=86400, stale-while-revalidate=86400 │
│                        │  一天有效期，过期后异步验证                             │
│                        │  长期不变可用更长的 max-age                            │
├─────────────────────────────────────────────────────────────────────────┤
│  第三方资源            │  遵循第三方缓存策略                                    │
│  (CDN 资源)            │  或自行代理控制                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 缓存配置示例

```nginx
# Nginx 配置示例

# 静态资源（带哈希）- 永久缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header ETag "";
}

# HTML - 不缓存或短缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
}

# API - 根据业务需求
location /api/ {
    # 不缓存
    add_header Cache-Control "no-store, no-cache, must-revalidate";
    
    # 或短缓存
    # add_header Cache-Control "private, max-age=60, must-revalidate";
}

# 图片等媒体资源
location ~* \.(png|jpg|jpeg|gif|webp)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800, stale-while-revalidate=86400";
}
```

### 5.3 Service Worker 缓存

```javascript
// Service Worker 缓存策略

// 1. 缓存优先（Cache First）
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  const cache = await caches.open('v1');
  cache.put(request, response.clone());
  return response;
}

// 2. 网络优先（Network First）
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open('v1');
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// 3. 网络优先带超时（Network First with Timeout）
async function networkFirstWithTimeout(request, timeout = 3000) {
  const cached = await caches.match(request);
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeout);
  });
  
  try {
    const response = await Promise.race([
      fetch(request),
      timeoutPromise
    ]);
    const cache = await caches.open('v1');
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// 4. 后台更新（Stale While Revalidate）
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    const cache = caches.open('v1');
    cache.then(c => c.put(request, response.clone()));
    return response;
  });
  
  return cached || fetchPromise;
}
```

---

## 6. 缓存清除

### 6.1 清除缓存的方法

```
┌─────────────────────────────────────────────────────────────────────────┐
│  方法                          │  说明                                    │
├────────────────────────────────┼─────────────────────────────────────────┤
│  URL 变更                      │  改变 URL（添加版本号或哈希）              │
│  app.js?v=1.0.1               │  最可靠的方法                            │
│  app.abc123.js                │                                          │
├────────────────────────────────┼─────────────────────────────────────────┤
│  强制刷新                      │  Ctrl+F5 / Cmd+Shift+R                  │
│                               │  添加 Cache-Control: no-cache           │
│                               │  仅影响当前用户                          │
├────────────────────────────────┼─────────────────────────────────────────┤
│  清除浏览器缓存                 │  手动清除浏览器缓存                        │
│                               │  仅影响当前用户                          │
├────────────────────────────────┼─────────────────────────────────────────┤
│  服务器响应新版本               │  修改 ETag / Last-Modified              │
│                               │  返回新内容                             │
├────────────────────────────────┼─────────────────────────────────────────┤
│  使用 Service Worker           │  更新 Service Worker 版本                 │
│                               │  触发 cache.delete()                    │
└────────────────────────────────┴─────────────────────────────────────────┘
```

### 6.2 版本化资源

```html
<!-- 方式1：查询参数 -->
<link rel="stylesheet" href="style.css?v=1.0.1">
<script src="app.js?v=1.0.1"></script>

<!-- 方式2：文件名哈希（推荐） -->
<link rel="stylesheet" href="style.abc123.css">
<script src="app.def456.js"></script>

<!-- 构建工具自动生成 -->
<!-- webpack/Vite 等会自动处理 -->
```

### 6.3 Service Worker 更新

```javascript
// sw.js
const CACHE_NAME = 'v2';  // 更新版本号

self.addEventListener('install', (event) => {
  // 清除旧缓存
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  
  // 缓存新资源
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/app.abc123.js',
        '/style.def456.css'
      ]);
    })
  );
});
```

---

## 小结

### 缓存策略速查

| 资源类型 | 推荐策略 | 头部设置 |
|---------|---------|---------|
| 静态资源（带哈希） | 永久缓存 | `max-age=31536000, immutable` |
| HTML 文档 | 每次验证 | `no-cache` |
| API 数据 | 不缓存或短缓存 | `no-store` 或 `private, max-age=60` |
| 用户私有数据 | 私有缓存 | `private, no-cache` |
| 图片/字体 | 长期缓存 | `max-age=86400, stale-while-revalidate` |

### Cache-Control 指令速查

| 指令 | 作用 | 使用场景 |
|------|------|---------|
| max-age | 设置缓存有效期 | 所有可缓存资源 |
| public | 允许共享缓存 | 公共资源、CDN |
| private | 仅浏览器缓存 | 用户个性化数据 |
| no-cache | 使用前验证 | 需要新鲜度的资源 |
| no-store | 不缓存 | 敏感数据 |
| immutable | 永不验证 | 带哈希的静态资源 |
| must-revalidate | 过期后必须验证 | 需要保证新鲜度 |

---

## 参考资源

- [MDN - HTTP 缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)
- [HTTP 缓存规范 (RFC 7234)](https://www.rfc-editor.org/rfc/rfc7234)
- [Google Web Fundamentals - HTTP 缓存](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
- [Cache-Control 详解](https://www.keycdn.com/blog/http-cache-headers)

---

[返回模块目录](../index.md)
