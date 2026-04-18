# CORS 跨域资源共享

> 同源策略是浏览器的安全机制，限制了跨域请求。CORS（Cross-Origin Resource Sharing）是一种机制，允许服务器标示除了自己以外的其他源，使浏览器可以访问这些资源。理解 CORS 对于前后端分离开发和 API 设计至关重要。

## 学习要点

- 🔒 理解同源策略的目的和限制
- 🔄 掌握 CORS 的工作原理
- 📋 熟悉 CORS 相关的请求和响应头部
- 🛠️ 学会处理常见的跨域问题

---

## 1. 同源策略

### 1.1 同源定义

```
同源定义：协议 + 域名 + 端口 完全相同

示例（以 https://example.com/page 为基准）：
┌────────────────────────────────────┬────────────┬─────────────────────┐
│  URL                               │  是否同源   │  原因                  │
├────────────────────────────────────┼────────────┼─────────────────────┤
│  https://example.com/other         │    ✓      │  同源                 │
│  http://example.com/page           │    ✗      │  协议不同              │
│  https://www.example.com/page      │    ✗      │  域名不同              │
│  https://example.com:8080/page     │    ✗      │  端口不同              │
│  https://api.example.com/users     │    ✗      │  域名不同（子域名）     │
└────────────────────────────────────┴────────────┴─────────────────────┘
```

### 1.2 同源策略的限制

```
┌─────────────────────────────────────────────────────────────────────────┐
│  受同源策略限制的访问                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Cookie、LocalStorage、SessionStorage、IndexedDB                      │
│     • 无法读取非同源的存储数据                                            │
│                                                                          │
│  2. DOM 操作                                                             │
│     • 无法操作非同源的 DOM（iframe、window.open）                          │
│                                                                          │
│  3. AJAX 请求                                                            │
│     • 可以发送请求，但无法读取响应                                         │
│     • 浏览器会阻止跨域响应                                                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  不受同源策略限制的资源                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  • <script> 标签引入的 JS 文件                                            │
│  • <link> 标签引入的 CSS 文件                                             │
│  • <img> 标签引入的图片                                                   │
│  • <video> 和 <audio> 标签引入的媒体资源                                   │
│  • <iframe> 加载的内容（但无法访问 DOM）                                   │
│  • @font-face 引入的字体（部分浏览器限制）                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 为什么需要同源策略

```
同源策略的目的：
┌─────────────────────────────────────────────────────────────────────────┐
│  防止恶意网站读取其他网站的数据                                            │
│                                                                          │
│  假设没有同源策略：                                                       │
│  1. 用户登录了银行网站 bank.com                                           │
│  2. 用户访问了恶意网站 evil.com                                           │
│  3. evil.com 可以发送请求到 bank.com/account                              │
│  4. 银行返回用户的账户信息                                                │
│  5. evil.com 读取响应，窃取用户数据                                        │
│                                                                          │
│  有了同源策略：                                                           │
│  • evil.com 无法读取 bank.com 的响应                                      │
│  • 保护了用户的敏感数据                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CORS 工作原理

### 2.1 CORS 分类

```
┌─────────────────┬───────────────────────────────────────────────────────┐
│  简单请求        │  满足以下所有条件的请求                                  │
├─────────────────┼───────────────────────────────────────────────────────┤
│  方法           │  GET、POST、HEAD                                        │
│  头部           │  Accept、Accept-Language、Content-Language              │
│                 │  Content-Type（仅限三个值）                              │
│  Content-Type   │  text/plain、multipart/form-data、                      │
│                 │  application/x-www-form-urlencoded                      │
│  其他           │  无自定义头部                                            │
│                 │  请求中没有使用 ReadableStream                            │
└─────────────────┴───────────────────────────────────────────────────────┘

┌─────────────────┬───────────────────────────────────────────────────────┐
│  预检请求        │  不满足简单请求条件的请求                                 │
├─────────────────┼───────────────────────────────────────────────────────┤
│  触发条件        │  • 方法不是 GET/POST/HEAD                                │
│                 │  • Content-Type 不是简单类型                              │
│                 │  • 自定义请求头                                           │
│                 │  • 使用 ReadableStream                                    │
└─────────────────┴───────────────────────────────────────────────────────┘
```

### 2.2 简单请求流程

```
简单请求流程：
┌──────────┐                                            ┌──────────┐
│  浏览器   │                                            │  服务器   │
└────┬─────┘                                            └────┬─────┘
     │                                                       │
     │  GET /api/data HTTP/1.1                               │
     │  Host: api.example.com                                │
     │  Origin: https://frontend.com                         │
     │ ───────────────────────────────────────────────────►  │
     │                                                       │
     │  HTTP/1.1 200 OK                                      │
     │  Access-Control-Allow-Origin: https://frontend.com    │
     │  ◄──────────────────────────────────────────────────  │
     │                                                       │
     │  浏览器检查 Origin 是否匹配                            │
     │  匹配 → 允许 JS 读取响应                               │
     │  不匹配 → 阻止响应，抛出 CORS 错误                      │
     │                                                       │
```

### 2.3 预检请求流程

```
非简单请求会先发送 OPTIONS 预检请求：
┌──────────┐                                            ┌──────────┐
│  浏览器   │                                            │  服务器   │
└────┬─────┘                                            └────┬─────┘
     │                                                       │
     │  OPTIONS /api/data HTTP/1.1                           │
     │  Origin: https://frontend.com                         │
     │  Access-Control-Request-Method: PUT                   │
     │  Access-Control-Request-Headers: X-Custom-Header      │
     │ ───────────────────────────────────────────────────►  │
     │                                                       │
     │  HTTP/1.1 200 OK                                      │
     │  Access-Control-Allow-Origin: https://frontend.com    │
     │  Access-Control-Allow-Methods: GET, POST, PUT         │
     │  Access-Control-Allow-Headers: X-Custom-Header        │
     │  Access-Control-Max-Age: 86400                        │
     │  ◄──────────────────────────────────────────────────  │
     │                                                       │
     │  预检通过，发送实际请求                                │
     │                                                       │
     │  PUT /api/data HTTP/1.1                               │
     │  Origin: https://frontend.com                         │
     │  X-Custom-Header: value                               │
     │ ───────────────────────────────────────────────────►  │
     │                                                       │
     │  HTTP/1.1 200 OK                                      │
     │  Access-Control-Allow-Origin: https://frontend.com    │
     │  ◄──────────────────────────────────────────────────  │
     │                                                       │
```

---

## 3. CORS 相关头部

### 3.1 请求头部

```
┌───────────────────────────────────────┬─────────────────────────────────┐
│  Origin                               │  请求源（协议+域名+端口）          │
│                                       │  浏览器自动添加，不可修改           │
├───────────────────────────────────────┼─────────────────────────────────┤
│  Access-Control-Request-Method        │  预检请求中，告知实际请求的方法     │
├───────────────────────────────────────┼─────────────────────────────────┤
│  Access-Control-Request-Headers       │  预检请求中，告知实际请求的自定义头 │
└───────────────────────────────────────┴─────────────────────────────────┘

示例：
Origin: https://www.example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type, Authorization, X-Custom-Header
```

### 3.2 响应头部

```
┌───────────────────────────────────────┬─────────────────────────────────┐
│  头部名称                              │  说明                             │
├───────────────────────────────────────┼─────────────────────────────────┤
│  Access-Control-Allow-Origin          │  允许的源                         │
│                                       │  * 或具体域名                      │
├───────────────────────────────────────┼─────────────────────────────────┤
│  Access-Control-Allow-Methods         │  允许的方法                       │
├───────────────────────────────────────┼─────────────────────────────────┤
│  Access-Control-Allow-Headers         │  允许的请求头                     │
├───────────────────────────────────────┼─────────────────────────────────┤
│  Access-Control-Allow-Credentials     │  是否允许携带凭证（Cookie）        │
├───────────────────────────────────────┼─────────────────────────────────┤
│  Access-Control-Max-Age               │  预检请求缓存时间（秒）            │
├───────────────────────────────────────┼─────────────────────────────────┤
│  Access-Control-Expose-Headers        │  暴露给 JS 的响应头               │
└───────────────────────────────────────┴─────────────────────────────────┘
```

### 3.3 头部详解

#### Access-Control-Allow-Origin

```
// 允许所有源
Access-Control-Allow-Origin: *

// 允许特定源（推荐）
Access-Control-Allow-Origin: https://www.example.com

// 动态设置
// 服务端根据请求的 Origin 动态返回允许的源
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://www.example.com',
    'https://app.example.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  next();
});

注意：
• 只能设置一个值，不能是逗号分隔的多个域名
• 需要支持多个域名时，服务端需动态判断并返回
• 设置为 * 时，不能同时设置 credentials: true
```

#### Access-Control-Allow-Credentials

```
Access-Control-Allow-Credentials: true

作用：
┌─────────────────────────────────────────────────────────────────────────┐
│  允许跨域请求携带 Cookie 和认证信息                                        │
│                                                                          │
│  使用条件：                                                               │
│  • 服务端设置 Access-Control-Allow-Credentials: true                     │
│  • Access-Control-Allow-Origin 不能是 *，必须是具体的域名                  │
│  • 客户端请求需设置 credentials: 'include'                                │
└─────────────────────────────────────────────────────────────────────────┘

客户端示例：
fetch('https://api.example.com/data', {
  credentials: 'include'  // 发送 Cookie
});

// XMLHttpRequest
xhr.withCredentials = true;

// Axios
axios.get('/api/data', { withCredentials: true });
```

#### Access-Control-Expose-Headers

```
Access-Control-Expose-Headers: X-Total-Count, X-Page, X-Custom-Header

作用：
┌─────────────────────────────────────────────────────────────────────────┐
│  默认情况下，跨域请求只能读取以下响应头：                                   │
│  • Cache-Control                                                         │
│  • Content-Language                                                      │
│  • Content-Type                                                          │
│  • Expires                                                               │
│  • Last-Modified                                                         │
│  • Pragma                                                                │
│                                                                          │
│  如果需要访问其他响应头，需要通过此头部暴露                                 │
└─────────────────────────────────────────────────────────────────────────┘

示例：
// 服务端
res.setHeader('X-Total-Count', '1000');
res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

// 客户端
const response = await fetch('/api/data');
const totalCount = response.headers.get('X-Total-Count');
```

---

## 4. 服务端配置

### 4.1 Node.js / Express

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// 简单配置 - 允许所有
app.use(cors());

// 详细配置
app.use(cors({
  origin: ['https://example.com', 'https://www.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  exposedHeaders: ['X-Total-Count', 'X-Page'],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204
}));

// 手动处理
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://example.com',
    'https://www.example.com',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Custom-Header');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count, X-Page');
  
  // 预检请求直接返回
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});
```

### 4.2 Nginx

```nginx
# CORS 配置
server {
    listen 80;
    server_name api.example.com;

    # 简单配置
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';

    # 动态配置
    set $cors_origin "";
    if ($http_origin ~* "^https://(www\.)?example\.com$") {
        set $cors_origin $http_origin;
    }
    
    add_header 'Access-Control-Allow-Origin' $cors_origin;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Custom-Header';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Max-Age' 86400;

    # 处理预检请求
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' $cors_origin;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
        add_header 'Access-Control-Max-Age' 86400;
        add_header 'Content-Length' 0;
        add_header 'Content-Type' 'text/plain';
        return 204;
    }

    location / {
        proxy_pass http://backend;
    }
}
```

### 4.3 Spring Boot

```java
// 方式1：注解配置
@CrossOrigin(origins = "https://example.com", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class MyController {

    @CrossOrigin(origins = {"https://example.com", "https://www.example.com"})
    @GetMapping("/data")
    public ResponseEntity<?> getData() {
        // ...
    }
}

// 方式2：全局配置
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://example.com", "https://www.example.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
            .allowedHeaders("Content-Type", "Authorization", "X-Custom-Header")
            .allowCredentials(true)
            .maxAge(86400);
    }
}

// 方式3：Filter
@Component
public class CorsFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        
        String origin = request.getHeader("Origin");
        if (isAllowedOrigin(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }
        
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "86400");
        
        if ("OPTIONS".equals(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }
        
        chain.doFilter(req, res);
    }
}
```

---

## 5. 常见问题与解决方案

### 5.1 常见错误

```
错误1：Access-Control-Allow-Origin 不能是 *
错误信息：The value of the 'Access-Control-Allow-Origin' header in the response 
must not be the wildcard '*' when the request's credentials mode is 'include'.

原因：使用 credentials: 'include' 时，Allow-Origin 不能是 *
解决：服务端设置具体的域名
```

```
错误2：预检请求失败
错误信息：Response to preflight request doesn't pass access control check

原因：OPTIONS 请求没有正确响应 CORS 头部
解决：确保 OPTIONS 请求返回正确的 CORS 头部
```

```
错误3：读取不到响应头
错误信息：Refused to get unsafe header "X-Custom-Header"

原因：跨域请求默认无法读取自定义响应头
解决：服务端设置 Access-Control-Expose-Headers
```

### 5.2 调试技巧

```javascript
// 1. 检查请求是否跨域
fetch('https://api.example.com/data')
  .then(response => {
    console.log('Status:', response.status);
    console.log('Type:', response.type);  // 'cors' 表示跨域请求
    return response.json();
  });

// 2. 检查响应头
fetch('https://api.example.com/data')
  .then(response => {
    console.log('Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
  });

// 3. 使用浏览器开发者工具
// Network 面板查看请求详情
// Console 查看错误信息
```

### 5.3 其他跨域方案

```javascript
// 1. JSONP（仅支持 GET）
function jsonp(url, callback) {
  const callbackName = 'jsonp_callback_' + Date.now();
  
  const script = document.createElement('script');
  script.src = `${url}?callback=${callbackName}`;
  
  window[callbackName] = (data) => {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };
  
  document.body.appendChild(script);
}

jsonp('https://api.example.com/data', (data) => {
  console.log(data);
});

// 2. 代理服务器
// 开发环境使用 Vite/Webpack 代理
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};

// 3. postMessage（跨窗口通信）
// 父窗口
iframe.contentWindow.postMessage({ type: 'getData' }, 'https://child.com');

// 子窗口
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://parent.com') return;
  
  if (event.data.type === 'getData') {
    event.source.postMessage({ type: 'data', data: result }, event.origin);
  }
});
```

---

## 小结

### CORS 头部速查

| 头部 | 方向 | 作用 |
|------|------|------|
| Origin | 请求 | 标识请求来源 |
| Access-Control-Allow-Origin | 响应 | 允许的源 |
| Access-Control-Allow-Methods | 响应 | 允许的方法 |
| Access-Control-Allow-Headers | 响应 | 允许的请求头 |
| Access-Control-Allow-Credentials | 响应 | 是否允许 Cookie |
| Access-Control-Max-Age | 响应 | 预检缓存时间 |
| Access-Control-Expose-Headers | 响应 | 暴露的响应头 |

### 简单请求 vs 预检请求

| 特性 | 简单请求 | 预检请求 |
|------|---------|---------|
| 方法 | GET/POST/HEAD | PUT/DELETE/PATCH 等 |
| Content-Type | text/plain 等 | application/json |
| 自定义头 | 不允许 | 允许 |
| 流程 | 直接发送 | 先 OPTIONS 预检 |

---

## 参考资源

- [MDN - CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [CORS 规范 (RFC 6454)](https://www.rfc-editor.org/rfc/rfc6454)
- [跨域资源共享详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)

---

[返回模块目录](../index.md)
