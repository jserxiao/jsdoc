# HTTP 安全头部

> HTTP 安全头部是保护 Web 应用免受各种攻击的重要防线。通过配置适当的安全响应头，可以有效防范 XSS、点击劫持、数据注入等常见安全威胁。理解并正确配置这些头部对于构建安全的 Web 应用至关重要。

## 学习要点

- 🔒 理解各种 HTTP 安全头部的作用
- 🛡️ 掌握 CSP 内容安全策略的配置
- 🔐 了解 HSTS 的工作原理
- 🎯 学会根据实际需求配置安全策略

---

## 1. 安全头部概览

### 1.1 常用安全头部

```
┌───────────────────────────────────┬─────────────────────────────────────┐
│  头部名称                           │  作用                                 │
├───────────────────────────────────┼─────────────────────────────────────┤
│  Strict-Transport-Security        │  强制使用 HTTPS                      │
│  Content-Security-Policy          │  内容安全策略（防 XSS）               │
│  X-Frame-Options                  │  防止点击劫持                        │
│  X-Content-Type-Options           │  防止 MIME 嗅探                      │
│  X-XSS-Protection                 │  XSS 过滤器（已废弃）                 │
│  Referrer-Policy                  │  控制 Referer 信息                   │
│  Permissions-Policy               │  控制浏览器功能权限                   │
│  Cross-Origin-Opener-Policy       │  跨域隔离                           │
│  Cross-Origin-Resource-Policy     │  跨域资源策略                        │
│  Cross-Origin-Embedder-Policy     │  跨域嵌入策略                        │
└───────────────────────────────────┴─────────────────────────────────────┘
```

---

## 2. Strict-Transport-Security (HSTS)

### 2.1 基本用法

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 2.2 参数说明

```
┌─────────────────────┬───────────────────────────────────────────────────────┐
│  参数                │  说明                                                   │
├─────────────────────┼───────────────────────────────────────────────────────┤
│  max-age            │  有效期（秒），浏览器在此时间内强制使用 HTTPS            │
│                     │  推荐值：31536000（一年）                                │
├─────────────────────┼───────────────────────────────────────────────────────┤
│  includeSubDomains  │  包含所有子域名                                         │
├─────────────────────┼───────────────────────────────────────────────────────┤
│  preload            │  允许加入浏览器预加载列表                                │
│                     │  需要在 hstspreload.org 提交                            │
└─────────────────────┴───────────────────────────────────────────────────────┘
```

### 2.3 工作原理

```
HSTS 工作流程：
┌─────────────────────────────────────────────────────────────────────────┐
│  首次访问（无 HSTS 缓存）：                                               │
│  1. 用户输入 http://example.com                                         │
│  2. 浏览器发送 HTTP 请求                                                │
│  3. 服务器返回 HSTS 头部                                                │
│  4. 浏览器缓存 HSTS 策略                                                │
│                                                                          │
│  后续访问（有 HSTS 缓存）：                                               │
│  1. 用户输入 http://example.com                                         │
│  2. 浏览器自动转换为 https://example.com                                 │
│  3. 直接发送 HTTPS 请求                                                 │
└─────────────────────────────────────────────────────────────────────────┘

防止的攻击：
• SSL 剥离攻击（SSL Stripping）
• 中间人攻击
• Cookie 劫持（配合 Secure 属性）
```

### 2.4 配置示例

```nginx
# Nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # 基础配置
    add_header Strict-Transport-Security "max-age=31536000" always;
    
    # 推荐配置（包含子域名和预加载）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
}
```

---

## 3. Content-Security-Policy (CSP)

### 3.1 基本用法

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.example.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-src 'self' https://www.youtube.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
```

### 3.2 指令说明

```
┌─────────────────────────┬─────────────────────────────────────────────────────┐
│  指令                    │  说明                                                 │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  default-src            │  默认资源策略，作为其他指令的后备                       │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  script-src             │  JavaScript 资源来源                                  │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  style-src              │  CSS 样式资源来源                                     │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  img-src                │  图片资源来源                                         │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  font-src               │  字体资源来源                                         │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  connect-src            │  AJAX/WebSocket 连接目标                              │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  frame-src              │  iframe 来源                                          │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  object-src             │  <object>/<embed>/<applet> 来源                       │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  media-src              │  音视频资源来源                                       │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  base-uri               │  <base> 元素的 href 属性                              │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  form-action            │  表单提交目标                                         │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  frame-ancestors        │  可嵌入当前页的父页面（替代 X-Frame-Options）          │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  upgrade-insecure-requests │  自动升级 HTTP 到 HTTPS                            │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  block-all-mixed-content │  阻止所有混合内容（已废弃）                            │
└─────────────────────────┴─────────────────────────────────────────────────────┘
```

### 3.3 源值说明

```
┌─────────────────────────┬─────────────────────────────────────────────────────┐
│  源值                    │  说明                                                 │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  'self'                 │  同源资源                                             │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  'none'                 │  禁止任何资源                                         │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  'unsafe-inline'        │  允许内联脚本/样式（有安全风险）                        │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  'unsafe-eval'          │  允许 eval/Function 等（有安全风险）                   │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  'strict-dynamic'       │  允许由已信任脚本动态创建的脚本                        │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  https:                 │  允许任何 HTTPS 资源                                  │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  data:                  │  允许 data: URI（如 base64 图片）                     │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  blob:                  │  允许 blob: URI                                       │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  域名                   │  指定域名，如 https://cdn.example.com                  │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  nonce-xxx              │  允许匹配 nonce 的内联脚本                             │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  sha256-xxx             │  允许匹配哈希的脚本                                   │
└─────────────────────────┴─────────────────────────────────────────────────────┘
```

### 3.4 安全配置示例

```http
# 严格配置（推荐用于高安全需求）
Content-Security-Policy: 
  default-src 'none';
  script-src 'self';
  style-src 'self';
  img-src 'self';
  font-src 'self';
  connect-src 'self';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';

# 中等配置（允许第三方 CDN）
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;

# 使用 nonce（推荐）
Content-Security-Policy: 
  script-src 'self' 'nonce-abc123' 'strict-dynamic';
  style-src 'self' 'nonce-abc123';

# 开发调试（仅报告模式）
Content-Security-Policy-Report-Only: 
  default-src 'self';
  report-uri /csp-report;
```

### 3.5 使用 nonce

```javascript
// 服务端生成 nonce
const crypto = require('crypto');
const nonce = crypto.randomBytes(16).toString('base64');

// 设置 CSP 头部
res.setHeader('Content-Security-Policy', 
  `script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'`
);

// 模板中使用 nonce
// <script nonce="${nonce}">
//   console.log('This script is allowed');
// </script>
```

---

## 4. X-Frame-Options

### 4.1 基本用法

```http
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
X-Frame-Options: ALLOW-FROM https://example.com
```

### 4.2 值说明

```
┌─────────────────┬───────────────────────────────────────────────────────────┐
│  值              │  说明                                                       │
├─────────────────┼───────────────────────────────────────────────────────────┤
│  DENY           │  完全禁止在任何 iframe 中嵌入                               │
│                 │  最安全的选项                                              │
├─────────────────┼───────────────────────────────────────────────────────────┤
│  SAMEORIGIN     │  只允许同源页面嵌入                                         │
│                 │  适合需要被同站 iframe 嵌入的场景                           │
├─────────────────┼───────────────────────────────────────────────────────────┤
│  ALLOW-FROM uri │  允许指定源嵌入（已废弃）                                    │
│                 │  建议使用 CSP 的 frame-ancestors 替代                       │
└─────────────────┴───────────────────────────────────────────────────────────┘
```

### 4.3 防止点击劫持

```
点击劫持攻击原理：
┌─────────────────────────────────────────────────────────────────────────┐
│  1. 攻击者创建恶意页面                                                   │
│  2. 在恶意页面中嵌入目标网站的 iframe                                    │
│  3. 将 iframe 设置为透明                                                 │
│  4. 覆盖一个诱导用户点击的按钮                                           │
│  5. 用户点击按钮时，实际点击的是 iframe 中的操作                          │
│                                                                          │
│  示例场景：                                                              │
│  • 用户已登录银行网站                                                    │
│  • 访问恶意网站                                                          │
│  • 点击"领取奖品"按钮                                                    │
│  • 实际执行了银行转账操作                                                │
└─────────────────────────────────────────────────────────────────────────┘

防护方法：
X-Frame-Options: DENY  // 完全阻止嵌入
X-Frame-Options: SAMEORIGIN  // 只允许同源嵌入

或使用 CSP：
Content-Security-Policy: frame-ancestors 'none';
Content-Security-Policy: frame-ancestors 'self';
```

---

## 5. X-Content-Type-Options

### 5.1 基本用法

```http
X-Content-Type-Options: nosniff
```

### 5.2 作用

```
MIME 嗅探攻击：
┌─────────────────────────────────────────────────────────────────────────┐
│  问题：                                                                  │
│  • 浏览器有时会忽略服务器声明的 Content-Type                              │
│  • 尝试"嗅探"内容的实际类型                                              │
│  • 可能导致执行恶意脚本                                                  │
│                                                                          │
│  示例：                                                                  │
│  • 服务器声明 Content-Type: text/plain                                   │
│  • 内容实际是 <script>alert('xss')</script>                              │
│  • 浏览器嗅探后当做 JavaScript 执行                                       │
└─────────────────────────────────────────────────────────────────────────┘

解决方案：
┌─────────────────────────────────────────────────────────────────────────┐
│  X-Content-Type-Options: nosniff                                        │
│                                                                          │
│  • 禁止浏览器进行 MIME 嗅探                                              │
│  • 强制使用服务器声明的 Content-Type                                      │
│  • 如果类型不匹配，拒绝执行/渲染                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Referrer-Policy

### 6.1 基本用法

```http
Referrer-Policy: strict-origin-when-cross-origin
```

### 6.2 值说明

```
┌───────────────────────────────────┬─────────────────────────────────────┐
│  值                                │  行为                                 │
├───────────────────────────────────┼─────────────────────────────────────┤
│  no-referrer                      │  不发送 Referer                      │
├───────────────────────────────────┼─────────────────────────────────────┤
│  no-referrer-when-downgrade       │  HTTPS→HTTP 时不发送（默认）          │
├───────────────────────────────────┼─────────────────────────────────────┤
│  origin                           │  只发送源（协议+域名+端口）            │
├───────────────────────────────────┼─────────────────────────────────────┤
│  origin-when-cross-origin         │  跨域时只发送源                      │
├───────────────────────────────────┼─────────────────────────────────────┤
│  same-origin                      │  同源时发送完整 URL                  │
├───────────────────────────────────┼─────────────────────────────────────┤
│  strict-origin                    │  只发送源，降级时不发送              │
├───────────────────────────────────┼─────────────────────────────────────┤
│  strict-origin-when-cross-origin  │  同源：完整 URL                      │
│  （推荐）                          │  跨域 HTTPS→HTTPS：源                │
│                                   │  跨域 HTTPS→HTTP：不发送             │
├───────────────────────────────────┼─────────────────────────────────────┤
│  unsafe-url                       │  始终发送完整 URL（不安全）           │
└───────────────────────────────────┴─────────────────────────────────────┘
```

### 6.3 推荐配置

```http
# 推荐配置（默认值，平衡隐私和功能）
Referrer-Policy: strict-origin-when-cross-origin

# 高隐私配置
Referrer-Policy: no-referrer

# 完全控制
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 7. Permissions-Policy

### 7.1 基本用法

```http
Permissions-Policy: 
  geolocation=(self "https://example.com"),
  camera=(),
  microphone=(),
  payment=(self),
  usb=()
```

### 7.2 常用指令

```
┌─────────────────────────┬─────────────────────────────────────────────────────┐
│  指令                    │  控制的功能                                           │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  geolocation            │  地理位置                                             │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  camera                 │  摄像头                                               │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  microphone             │  麦克风                                               │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  payment                │  支付请求 API                                         │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  usb                    │  WebUSB                                               │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  magnetometer           │  磁力计                                               │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  gyroscope              │  陀螺仪                                               │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  accelerometer          │  加速度计                                             │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  fullscreen             │  全屏 API                                             │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  picture-in-picture     │  画中画                                               │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  autoplay               │  自动播放                                             │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  clipboard-read/write   │  剪贴板读写                                           │
└─────────────────────────┴─────────────────────────────────────────────────────┘
```

### 7.3 语法说明

```
语法：feature=(allowlist)

allowlist 值：
┌─────────────────────────┬─────────────────────────────────────────────────────┐
│  ()                     │  禁用该功能                                           │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  (self)                 │  仅同源可使用                                         │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  ("https://example.com")│  指定源可使用                                         │
├─────────────────────────┼─────────────────────────────────────────────────────┤
│  *                      │  允许所有源使用                                       │
└─────────────────────────┴─────────────────────────────────────────────────────┘
```

---

## 8. 跨域隔离头部

### 8.1 概述

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### 8.2 用途

```
跨域隔离用于启用高级功能：
┌─────────────────────────────────────────────────────────────────────────┐
│  • SharedArrayBuffer                                                    │
│  • performance.measureMemory()                                          │
│  • 高精度定时器                                                          │
└─────────────────────────────────────────────────────────────────────────┘

COOP (Cross-Origin-Opener-Policy)：
┌─────────────────────────────────────────────────────────────────────────┐
│  same-origin         共享 window.opener 需要同源                          │
│  same-origin-allow-popups   允许弹出窗口保持 opener                       │
│  unsafe-none         不限制（默认）                                       │
└─────────────────────────────────────────────────────────────────────────┘

CORP (Cross-Origin-Resource-Policy)：
┌─────────────────────────────────────────────────────────────────────────┐
│  same-origin         只有同源可以加载                                     │
│  same-site           同站点可以加载                                       │
│  cross-origin        允许跨域加载                                        │
└─────────────────────────────────────────────────────────────────────────┘

COEP (Cross-Origin-Embedder-Policy)：
┌─────────────────────────────────────────────────────────────────────────┐
│  require-corp        所有资源需要明确授权                                 │
│  unsafe-none         不限制（默认）                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9. 完整配置示例

### 9.1 Nginx 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # CSP
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
    
    # 防止点击劫持
    add_header X-Frame-Options "DENY" always;
    
    # 防止 MIME 嗅探
    add_header X-Content-Type-Options "nosniff" always;
    
    # Referrer 策略
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 权限策略
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # XSS 保护（已废弃，但仍建议添加）
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 9.2 Express 配置

```javascript
const express = require('express');
const helmet = require('helmet');

const app = express();

// 使用 helmet（推荐）
app.use(helmet());

// 或手动配置
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});
```

---

## 小结

### 安全头部配置优先级

| 优先级 | 头部 | 作用 |
|--------|------|------|
| 高 | Strict-Transport-Security | 强制 HTTPS |
| 高 | Content-Security-Policy | 防 XSS |
| 高 | X-Frame-Options | 防点击劫持 |
| 中 | X-Content-Type-Options | 防 MIME 嗅探 |
| 中 | Referrer-Policy | 保护隐私 |
| 低 | Permissions-Policy | 限制功能权限 |

### CSP 关键指令

| 指令 | 说明 | 推荐值 |
|------|------|--------|
| default-src | 默认策略 | 'self' |
| script-src | 脚本来源 | 'self' |
| object-src | 插件来源 | 'none' |
| frame-ancestors | 嵌入限制 | 'none' 或 'self' |
| base-uri | base 标签 | 'self' |
| form-action | 表单提交 | 'self' |

---

## 参考资源

- [OWASP 安全头部指南](https://owasp.org/www-project-secure-headers/)
- [MDN - Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
- [web.dev - 安全头部](https://web.dev/learn/security/)
- [hstspreload.org](https://hstspreload.org/)

---

[返回模块目录](../index.md)
