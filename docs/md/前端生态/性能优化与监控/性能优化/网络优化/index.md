# 网络优化

> 网络优化关注的是如何减少网络延迟、优化请求策略，通过减少请求数量、并行加载和连接优化来提升加载性能。

## 学习要点

- 🔗 理解网络请求优化策略
- 📡 掌握 CDN 加速原理
- ⚡ 运用 HTTP/2 多路复用特性
- 🌐 了解域名分片与合并策略

---

## 1. 请求优化

### 1.1 减少请求数量

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  减少请求数量的策略                                                                    │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  策略                │  方法                          │  效果                        │
│  ──────────────────┼───────────────────────────────┼─────────────────────────────   │
│  合并文件           │  JS/CSS 打包合并               │  减少请求次数                │
│  CSS Sprites       │  小图标合并为雪碧图            │  图标请求合并为 1 个         │
│  内联资源           │  小文件转 base64 内联          │  消除小请求                  │
│  图标字体           │  使用 icon font                │  多图标合并                  │
│  SVG Sprite        │  SVG 符号合并                  │  多个 SVG 合并               │
│  字体子集           │  只包含使用的字符              │  减少字体文件大小和数量      │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  注意事项                                                                             │
│                                                                                       │
│  HTTP/1.1：减少请求数量是关键（浏览器对同一域名并发请求有限制）                         │
│  HTTP/2：请求数量不再是主要问题（多路复用），应关注缓存和压缩                          │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 内联资源策略

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 小文件内联
// ────────────────────────────────────────────────────────────────────────────────────

// Webpack 内联资源
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024  // 8KB 以下转 base64
                    }
                }
            },
            {
                test: /\.svg$/,
                type: 'asset/inline'  // 强制内联
            }
        ]
    }
};

// Vite 内联配置
export default {
    build: {
        assetsInlineLimit: 8192  // 8KB 以下内联
    }
};

// ────────────────────────────────────────────────────────────────────────────────────
// 关键 CSS 内联
// ────────────────────────────────────────────────────────────────────────────────────

// 使用 critters 或 critical 提取首屏 CSS
const Critters = require('critters-webpack-plugin');

module.exports = {
    plugins: [
        new Critters({
            // 内联关键 CSS
            preload: 'swap',
            // 异步加载剩余 CSS
            noscriptFallback: true
        })
    ]
};

// 手动内联关键 CSS
const criticalCSS = `
    body { margin: 0; font-family: system-ui; }
    .header { height: 60px; background: #fff; }
    .main { max-width: 1200px; margin: 0 auto; }
`;

// 在 HTML 中内联
/*
<head>
    <style>${criticalCSS}</style>
    <link rel="preload" href="main.css" as="style" onload="this.rel='stylesheet'">
</head>
*/
```

### 1.3 请求合并与拆分

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// API 请求合并
// ────────────────────────────────────────────────────────────────────────────────────

// ❌ 多个独立请求
async function fetchBad() {
    const user = await fetch('/api/user/1');
    const posts = await fetch('/api/posts?userId=1');
    const comments = await fetch('/api/comments?userId=1');
    return { user, posts, comments };
}

// ✅ 批量请求
async function fetchGood() {
    const [user, posts, comments] = await Promise.all([
        fetch('/api/user/1'),
        fetch('/api/posts?userId=1'),
        fetch('/api/comments?userId=1')
    ]);
    return { user, posts, comments };
}

// ✅ 使用 GraphQL 或 BFF 合并请求
const query = `
    query UserDashboard($userId: ID!) {
        user(id: $userId) { id name avatar }
        posts(userId: $userId) { id title }
        comments(userId: $userId) { id content }
    }
`;

// ────────────────────────────────────────────────────────────────────────────────────
// 请求批量处理中间件
// ────────────────────────────────────────────────────────────────────────────────────

class RequestBatcher {
    constructor(options = {}) {
        this.batchWindow = options.batchWindow || 10;  // 批处理窗口（ms）
        this.maxBatchSize = options.maxBatchSize || 10;
        this.pending = new Map();
        this.timer = null;
    }
    
    // 添加请求
    add(key, params) {
        return new Promise((resolve, reject) => {
            if (!this.pending.has(key)) {
                this.pending.set(key, { params: [], resolves: [], rejects: [] });
            }
            
            const batch = this.pending.get(key);
            batch.params.push(params);
            batch.resolves.push(resolve);
            batch.rejects.push(reject);
            
            // 触发批处理
            this.scheduleBatch();
        });
    }
    
    // 调度批处理
    scheduleBatch() {
        if (this.timer) return;
        
        this.timer = setTimeout(() => {
            this.processBatch();
            this.timer = null;
        }, this.batchWindow);
    }
    
    // 处理批量请求
    async processBatch() {
        const batches = new Map(this.pending);
        this.pending.clear();
        
        for (const [key, { params, resolves, rejects }] of batches) {
            try {
                const result = await fetch(`/api/${key}/batch`, {
                    method: 'POST',
                    body: JSON.stringify({ items: params })
                }).then(r => r.json());
                
                result.forEach((item, i) => resolves[i](item));
            } catch (error) {
                rejects.forEach(reject => reject(error));
            }
        }
    }
}

// 使用
const batcher = new RequestBatcher();

// 多个组件同时请求，会合并为一个
batcher.add('user', { id: 1 }).then(user => console.log(user));
batcher.add('user', { id: 2 }).then(user => console.log(user));
batcher.add('user', { id: 3 }).then(user => console.log(user));

// 实际只发送一个请求：POST /api/user/batch
// Body: { items: [{ id: 1 }, { id: 2 }, { id: 3 }] }
```

---

## 2. CDN 加速

### 2.1 CDN 原理与优势

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  CDN（Content Delivery Network）内容分发网络                                           │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  工作原理：                                                                            │
│                                                                                       │
│   用户 ──► 最近的 CDN 边缘节点 ──► 源站                                                │
│            （就近访问）         （缓存未命中时回源）                                    │
│                                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐                    │
│   │                     源站（Origin）                          │                    │
│   │                      北京/上海                              │                    │
│   └─────────────────────────────────────────────────────────────┘                    │
│                              ▲                                                        │
│          ┌───────────────────┼───────────────────┐                                   │
│          │                   │                   │                                    │
│   ┌──────┴──────┐    ┌──────┴──────┐    ┌──────┴──────┐                             │
│   │  华北节点    │    │  华南节点    │    │  华东节点    │                             │
│   │   (北京)    │    │   (广州)    │    │   (上海)    │                              │
│   └─────────────┘    └─────────────┘    └─────────────┘                             │
│          ▲                   ▲                   ▲                                   │
│     用户A              用户B              用户C                                       │
│    (华北用户)          (华南用户)          (华东用户)                                  │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  CDN 优势                                                                              │
│                                                                                       │
│  • 降低延迟：就近访问，减少网络传输时间                                                │
│  • 减轻源站压力：边缘节点缓存，减少回源请求                                            │
│  • 提高可用性：多节点冗余，单点故障不影响整体                                           │
│  • 安全防护：DDoS 防护、WAF 防火墙                                                    │
│  • 带宽优化：边缘节点承担大部分流量                                                    │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  适用场景                                                                              │
│                                                                                       │
│  • 静态资源：JS、CSS、图片、字体、视频                                                 │
│  • 文件下载：安装包、文档、媒体文件                                                    │
│  • 视频直播/点播                                                                       │
│  • API 加速（动态加速）                                                                │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 CDN 配置策略

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// CDN 域名配置
// ────────────────────────────────────────────────────────────────────────────────────

/*
推荐架构：

主站域名：www.example.com
静态资源 CDN：static.example.com 或 cdn.example.com
图片 CDN：img.example.com
视频 CDN：video.example.com

配置示例：
*/

// 静态资源 CDN 配置
const CDN_BASE = 'https://cdn.example.com';

// 构建配置
module.exports = {
    output: {
        publicPath: CDN_BASE + '/assets/'
    }
};

// Vite 配置
export default {
    base: CDN_BASE + '/assets/'
};

// ────────────────────────────────────────────────────────────────────────────────────
// 多 CDN 域名策略
// ────────────────────────────────────────────────────────────────────────────────────

// 域名分片（HTTP/1.1 时代优化，HTTP/2 下不再需要）
const CDN_DOMAINS = [
    'https://cdn1.example.com',
    'https://cdn2.example.com',
    'https://cdn3.example.com'
];

function getCDNUrl(path, index = 0) {
    const domain = CDN_DOMAINS[index % CDN_DOMAINS.length];
    return `${domain}${path}`;
}

// ────────────────────────────────────────────────────────────────────────────────────
// CDN 缓存策略
// ────────────────────────────────────────────────────────────────────────────────────

/*
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  CDN 缓存配置建议                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  资源类型          │  缓存时间        │  缓存策略                                      │
│  ─────────────────┼─────────────────┼───────────────────────────────────────────    │
│  带哈希的静态资源   │  1 年           │  强缓存 + CDN 边缘缓存                         │
│  图片              │  1 月 - 1 年    │  强缓存 + CDN 边缘缓存                         │
│  字体              │  1 年           │  强缓存 + CDN 边缘缓存                         │
│  HTML              │  不缓存/短时间  │  协商缓存，CDN 不缓存或短时间                   │
│  API               │  按需           │  通常不缓存                                     │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  CDN 刷新策略                                                                          │
│                                                                                       │
│  • 带哈希的资源无需刷新，文件名变化自动更新                                            │
│  • HTML 需要设置较短缓存或实时刷新                                                    │
│  • 紧急情况可使用 CDN 控制台手动刷新                                                  │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
*/
```

### 2.3 预连接优化

```html
<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- DNS 预解析和预连接 -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<head>
    <!-- DNS 预解析：提前解析域名 -->
    <link rel="dns-prefetch" href="//cdn.example.com">
    <link rel="dns-prefetch" href="//api.example.com">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    
    <!-- 预连接：提前建立 TCP 连接 + TLS 握手 -->
    <link rel="preconnect" href="https://cdn.example.com">
    <link rel="preconnect" href="https://api.example.com" crossorigin>
    
    <!-- 关键资源预加载 -->
    <link rel="preload" href="https://cdn.example.com/critical.js" as="script">
    <link rel="preload" href="https://cdn.example.com/font.woff2" as="font" crossorigin>
</head>

<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- 预连接时机 -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<!--
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  连接建立过程                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  无预连接：                                                                            │
│  请求 ──► DNS 解析 ──► TCP 连接 ──► TLS 握手 ──► 发送请求                             │
│          (20-120ms)    (20-100ms)   (50-200ms)                                        │
│                                                                                       │
│  有预连接：                                                                            │
│  页面加载时提前完成 ──► 请求 ──► 直接发送请求                                          │
│  DNS + TCP + TLS              (0ms)                                                   │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  推荐使用预连接的域名                                                                  │
│                                                                                       │
│  • CDN 域名                                                                           │
│  • API 域名                                                                           │
│  • 第三方字体服务                                                                      │
│  • 第三方统计服务                                                                      │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
-->
```

---

## 3. HTTP/2 与 HTTP/3

### 3.1 HTTP/2 特性与优化

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  HTTP/2 核心特性                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  1. 多路复用（Multiplexing）                                                          │
│     • 单个 TCP 连接并行处理多个请求                                                    │
│     • 解决 HTTP/1.1 的队头阻塞问题                                                    │
│     • 无需域名分片                                                                    │
│                                                                                       │
│  2. 二进制分帧（Binary Framing）                                                       │
│     • 将数据分解为更小的帧                                                            │
│     • 更高效的解析                                                                    │
│                                                                                       │
│  3. 头部压缩（HPACK）                                                                  │
│     • 压缩 HTTP 头部                                                                  │
│     • 减少传输数据量                                                                  │
│                                                                                       │
│  4. 服务器推送（Server Push）                                                          │
│     • 服务器主动推送资源                                                              │
│     • 减少请求延迟                                                                    │
│                                                                                       │
│  5. 请求优先级                                                                         │
│     • 可设置请求优先级                                                                │
│     • 关键资源优先加载                                                                │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  HTTP/2 对优化的影响                                                                   │
│                                                                                       │
│  ❌ 不再需要的优化：                                                                   │
│     • 域名分片（多域名并行请求）                                                       │
│     • 合并文件（内联小资源）                                                           │
│     • 图片精灵（合并小图片）                                                           │
│                                                                                       │
│  ✅ 仍然需要的优化：                                                                   │
│     • 减少资源大小（压缩）                                                             │
│     • 合理的缓存策略                                                                  │
│     • CDN 加速                                                                        │
│     • 关键路径优化                                                                    │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 HTTP/2 Server Push

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Nginx HTTP/2 Push 配置
// ────────────────────────────────────────────────────────────────────────────────────

/*
server {
    listen 443 ssl http2;
    
    # 推送关键资源
    location / {
        http2_push /css/critical.css;
        http2_push /js/critical.js;
        http2_push /fonts/main.woff2;
    }
    
    # 条件推送
    location /product {
        http2_push /css/product.css;
        http2_push /js/product.js;
    }
}

# 注意：HTTP/2 Server Push 已被 Chrome 弃用，推荐使用 preload 替代
*/

// ────────────────────────────────────────────────────────────────────────────────────
// 使用 preload 替代 Server Push
// ────────────────────────────────────────────────────────────────────────────────────

/*
<head>
    <!-- 预加载关键资源 -->
    <link rel="preload" href="/css/critical.css" as="style">
    <link rel="preload" href="/js/critical.js" as="script">
    <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
</head>
*/

// ────────────────────────────────────────────────────────────────────────────────────
// Early Hints (103 状态码)
// ────────────────────────────────────────────────────────────────────────────────────

/*
服务器可以在最终响应之前发送 Early Hints，告知浏览器预加载资源：

HTTP/1.1 103 Early Hints
Link: </css/main.css>; rel=preload; as=style
Link: </js/app.js>; rel=preload; as=script

... 稍后发送最终响应 ...

HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
...
*/

// Node.js 示例
const http2 = require('http2');

const server = http2.createSecureServer({ key, cert });

server.on('stream', (stream, headers) => {
    // 发送 Early Hints
    stream.additionalHeaders({
        ':status': 103,
        'link': [
            '</css/main.css>; rel=preload; as=style',
            '</js/app.js>; rel=preload; as=script'
        ].join(', ')
    });
    
    // 发送最终响应
    stream.respond({ 'content-type': 'text/html', ':status': 200 });
    stream.end('<html>...</html>');
});
```

### 3.3 HTTP/3 与 QUIC

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  HTTP/3 与 QUIC                                                                        │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  QUIC 协议特点                                                                         │
│  • 基于 UDP 的传输层协议                                                              │
│  • 内置 TLS 1.3 加密                                                                  │
│  • 解决 TCP 队头阻塞                                                                  │
│  • 连接迁移（网络切换不断开）                                                          │
│  • 0-RTT 连接恢复                                                                     │
│                                                                                       │
│  HTTP/3 优势                                                                          │
│  • 完全解决队头阻塞（包括丢包场景）                                                    │
│  • 更快的连接建立（0-RTT）                                                            │
│  • 更好的移动端体验                                                                   │
│  • 改进的拥塞控制                                                                     │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  版本对比                                                                              │
│                                                                                       │
│  特性              │  HTTP/1.1       │  HTTP/2        │  HTTP/3                     │
│  ─────────────────┼────────────────┼────────────────┼──────────────────────────    │
│  传输层            │  TCP           │  TCP           │  QUIC (UDP)                 │
│  多路复用          │  否            │  是            │  是（无队头阻塞）            │
│  头部压缩          │  否            │  HPACK         │  QPACK                      │
│  连接建立          │  1-3 RTT       │  1-3 RTT       │  0-1 RTT                    │
│  TLS               │  可选          │  必须          │  内置 (TLS 1.3)             │
│  服务器推送        │  否            │  是（已弃用）   │  否                         │
│  连接迁移          │  否            │  否            │  是                         │
│  浏览器支持        │  全部          │  97%+          │  90%+                       │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 域名策略

### 4.1 域名分片与合并

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  域名策略选择                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  HTTP/1.1 时代                                                                         │
│                                                                                       │
│  问题：浏览器对同一域名并发请求有限制（6-8 个）                                         │
│                                                                                       │
│  解决方案：域名分片                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐     │
│  │  static1.example.com  ──►  并发 6 个请求                                    │     │
│  │  static2.example.com  ──►  并发 6 个请求                                    │     │
│  │  static3.example.com  ──►  并发 6 个请求                                    │     │
│  │  总计：18 个并发请求                                                        │     │
│  └─────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                       │
│  缺点：                                                                               │
│  • 增加 DNS 解析时间                                                                  │
│  • 增加 TCP 连接开销                                                                  │
│  • Cookie 无法共享                                                                    │
│  • HTTP/2 下反而降低性能                                                              │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  HTTP/2 时代                                                                           │
│                                                                                       │
│  推荐策略：域名合并                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐     │
│  │  单域名：cdn.example.com                                                    │     │
│  │  单连接：多路复用，无限并发                                                  │     │
│  │  优势：减少连接开销、享受头部压缩、Cookie 共享                               │     │
│  └─────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  推荐方案                                                                              │
│                                                                                       │
│  • 主站域名：www.example.com                                                          │
│  • API 域名：api.example.com（Cookie-free）                                           │
│  • 静态资源：cdn.example.com（Cookie-free）                                           │
│                                                                                       │
│  分离原因：                                                                            │
│  1. 静态资源无需携带 Cookie，减少请求大小                                              │
│  2. 不同类型资源可独立优化                                                            │
│  3. 安全隔离（减少 XSS 影响）                                                         │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Cookie-free 域名

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Cookie-free 域名配置
// ────────────────────────────────────────────────────────────────────────────────────

/*
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  Cookie-free 域名优势                                                                  │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  主站（www.example.com）：                                                            │
│  • 需要携带 Cookie（用户认证、追踪等）                                                 │
│  • Cookie 大小可能达到数 KB                                                           │
│                                                                                       │
│  静态资源（cdn.example.com）：                                                         │
│  • 无需 Cookie                                                                        │
│  • 请求体积更小                                                                       │
│  • 响应更快                                                                           │
│                                                                                       │
│  配置要点：                                                                            │
│  • 静态资源域名不要设置 Cookie                                                        │
│  • 使用独立域名或子域名                                                               │
│  • 主站 Cookie 设置 domain=.example.com 时，所有子域名都会携带                         │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
*/

// 静态资源请求不带 Cookie
const CDN_URL = 'https://static.example.com';

// API 请求带 Cookie
const API_URL = 'https://www.example.com/api';

// 配置示例
fetch(`${CDN_URL}/images/logo.png`);  // 不带 Cookie
fetch(`${API_URL}/user/profile`, { credentials: 'include' });  // 带 Cookie

// ────────────────────────────────────────────────────────────────────────────────────
// 第三方资源优化
// ────────────────────────────────────────────────────────────────────────────────────

// 使用 facade 模式延迟加载第三方脚本
class ThirdPartyFacade {
    constructor(options) {
        this.options = options;
        this.loaded = false;
    }
    
    // 创建占位元素
    createPlaceholder(container) {
        const placeholder = document.createElement('div');
        placeholder.className = 'facade-placeholder';
        placeholder.innerHTML = this.options.placeholder || '';
        
        // 点击或进入视口时加载
        placeholder.addEventListener('click', () => this.load());
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.load();
                observer.disconnect();
            }
        });
        
        observer.observe(placeholder);
        container.appendChild(placeholder);
    }
    
    // 加载实际脚本
    load() {
        if (this.loaded) return;
        
        const script = document.createElement('script');
        script.src = this.options.src;
        script.async = true;
        document.body.appendChild(script);
        
        this.loaded = true;
    }
}

// 使用
const videoFacade = new ThirdPartyFacade({
    src: 'https://www.youtube.com/iframe_api',
    placeholder: '<div class="video-placeholder">点击播放</div>'
});

videoFacade.createPlaceholder(document.getElementById('video-container'));
```

---

## 5. 网络优化检查清单

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  网络优化检查清单                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  请求优化                                                                              │
│  □ 减少不必要的请求                                                                   │
│  □ 合并小文件或内联                                                                   │
│  □ API 请求批量处理                                                                   │
│  □ 使用 GraphQL 或 BFF 减少请求                                                       │
│                                                                                       │
│  CDN 优化                                                                              │
│  □ 静态资源使用 CDN                                                                   │
│  □ 配置合适的缓存策略                                                                 │
│  □ 预连接 CDN 域名                                                                    │
│  □ 使用 Cookie-free 域名                                                              │
│                                                                                       │
│  协议优化                                                                              │
│  □ 启用 HTTP/2 或 HTTP/3                                                             │
│  □ 配置 HTTPS                                                                         │
│  □ 使用 Early Hints                                                                  │
│  □ 关键资源 preload                                                                   │
│                                                                                       │
│  域名策略                                                                              │
│  □ HTTP/2 下合并域名                                                                 │
│  □ 静态资源使用独立域名                                                               │
│  □ 第三方资源延迟加载                                                                 │
│  □ 避免重定向                                                                         │
│                                                                                       │
│  数据传输                                                                              │
│  □ 启用 Gzip/Brotli 压缩                                                              │
│  □ 使用 WebP/AVIF 图片格式                                                           │
│  □ 压缩 JSON 响应                                                                     │
│  □ 使用数据压缩算法                                                                   │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
